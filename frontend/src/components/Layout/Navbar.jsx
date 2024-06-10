import React, { useContext, useState } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/v1/user/logout", {
        withCredentials: true,
      });
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response.data.message);
      setIsAuthorized(true);
    }
  };

  return (
    <nav className="bg-blue-900 shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          <h1>JobHub</h1>
        </div>
        {isAuthorized && (
          <div className="hidden md:flex space-x-6 items-center">
            {user && user.role === "Admin" ? (
              <>
                <Link to="/admin/dashboard" className="text-white hover:text-gray-200">
                  ADMIN DASHBOARD
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className="text-white hover:text-gray-200">
                  HOME
                </Link>
                <Link to="/job/getall" className="text-white hover:text-gray-200">
                  ALL JOBS
                </Link>
                <Link to="/applications/me" className="text-white hover:text-gray-200">
                  {user && user.role === "Employer" ? "APPLICANT'S APPLICATIONS" : "MY APPLICATIONS"}
                </Link>
                {user && user.role === "Employer" && (
                  <>
                    <Link to="/job/post" className="text-white hover:text-gray-200">
                      POST NEW JOB
                    </Link>
                    <Link to="/job/me" className="text-white hover:text-gray-200">
                      VIEW YOUR JOBS
                    </Link>
                  </>
                )}
              </>
            )}
            <div className="relative">
              <button className="text-white bg-blue-900 hover:bg-blue-700 rounded px-4 py-2" onClick={() => setShow(!show)}>
                WELCOME, {user && user.name.toUpperCase()}
              </button>
              {show && (
                <ul className="absolute right-0 mt-2 w-48 bg-blue-900 text-white shadow-md py-2 rounded">
                  <li>
                    <Link to="/profile" className="block px-4 py-2 hover:bg-blue-700" onClick={() => setShow(false)}>
                      View Profile
                    </Link>
                  </li>
                  <li>
                    <button className="block w-full text-left px-4 py-2 hover:bg-blue-700" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        )}
        {!isAuthorized && (
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/login" className="text-white hover:text-gray-200">
              LOGIN
            </Link>
            <Link to="/register" className="text-white hover:text-gray-200">
              REGISTER
            </Link>
          </div>
        )}
        <div className="md:hidden">
          <GiHamburgerMenu className="text-white text-2xl" onClick={() => setShow(!show)} />
        </div>
      </div>
      {show && (
        <ul className="md:hidden bg-blue-900 text-white flex flex-col space-y-4 px-6 py-4">
          {isAuthorized ? (
            <>
              {user && user.role === "Admin" ? (
                <>
                  <li>
                    <Link to="/admin/dashboard" className="hover:text-gray-200" onClick={() => setShow(false)}>
                      ADMIN DASHBOARD
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/" className="hover:text-gray-200" onClick={() => setShow(false)}>
                      HOME
                    </Link>
                  </li>
                  <li>
                    <Link to="/job/getall" className="hover:text-gray-200" onClick={() => setShow(false)}>
                      ALL JOBS
                    </Link>
                  </li>
                  <li>
                    <Link to="/applications/me" className="hover:text-gray-200" onClick={() => setShow(false)}>
                      {user && user.role === "Employer" ? "APPLICANT'S APPLICATIONS" : "MY APPLICATIONS"}
                    </Link>
                  </li>
                  {user && user.role === "Employer" && (
                    <>
                      <li>
                        <Link to="/job/post" className="hover:text-gray-200" onClick={() => setShow(false)}>
                          POST NEW JOB
                        </Link>
                      </li>
                      <li>
                        <Link to="/job/me" className="hover:text-gray-200" onClick={() => setShow(false)}>
                          VIEW YOUR JOBS
                        </Link>
                      </li>
                    </>
                  )}
                </>
              )}
              <li>
                <Link to="/profile" className="hover:text-gray-200" onClick={() => setShow(false)}>
                  View Profile
                </Link>
              </li>
              <li>
                <button className="text-left w-full hover:text-gray-200" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:text-gray-200" onClick={() => setShow(false)}>
                  LOGIN
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-gray-200" onClick={() => setShow(false)}>
                  REGISTER
                </Link>
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
