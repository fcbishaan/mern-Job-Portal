import React, { useContext } from "react";
import { Context } from "../../main";
import { Link } from "react-router-dom";
import { FaFacebookF, FaYoutube, FaLinkedin } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

const Footer = () => {
  const { isAuthorized } = useContext(Context);
  return (
    <footer className={`bg-black text-white ${isAuthorized ? "footerShow" : "footerHide"} py-4 px-4 md:px-0`}>
      <div className="container mx-auto flex justify-between items-center">
        <div>&copy; All rights reserved by codebyIshaan</div>
        <div className="flex space-x-4">
          <Link to={"https://www.facebook.com/profile.php?id=100030535123397"} target="_blank">
            <FaFacebookF className="text-2xl hover:text-white-200" />
          </Link>
          <Link to={"https://www.youtube.com/@CodeWithZeeshu"} target="_blank">
            <FaYoutube className="text-2xl hover:text-white-200" />
          </Link>
          <Link to={"https://www.linkedin.com/in/codebyishaan/"} target="_blank">
            <FaLinkedin className="text-2xl hover:text-white-200" />
          </Link>
          <Link to={"https://www.instagram.com/z_4_zeeshuuu/"} target="_blank">
            <RiInstagramFill className="text-2xl hover:text-white-200" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
