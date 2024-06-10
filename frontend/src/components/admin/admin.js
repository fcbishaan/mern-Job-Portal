// src/components/Admin.js
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../main';
import axios from 'axios';
import toast from 'react-hot-toast';

const Admin = () => {
  const { user, isAuthorized } = useContext(Context);
  const [employers, setEmployers] = useState([]);

  useEffect(() => {
    if (isAuthorized && user.role === 'Admin') {
      const fetchEmployers = async () => {
        try {
          const { data } = await axios.get('http://localhost:4000/api/v1/employer/getall', { withCredentials: true });
          setEmployers(data.employers);
        } catch (error) {
          toast.error(error.response.data.message);
        }
      };
      fetchEmployers();
    }
  }, [isAuthorized, user]);

  const handleVerification = async (id, isVerified) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/employer/verify/${id}`,
        { isVerified },
        { withCredentials: true }
      );
      toast.success(data.message);
      setEmployers((prevEmployers) =>
        prevEmployers.map((employer) =>
          employer._id === id ? { ...employer, isVerified } : employer
        )
      );
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <section className="admin_dashboard page bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">Admin Dashboard</h1>
        {employers.length <= 0 ? (
          <h4 className="text-center text-gray-500">No Employers Found</h4>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200">Name</th>
                <th className="py-2 px-4 border-b border-gray-200">Email</th>
                <th className="py-2 px-4 border-b border-gray-200">Phone</th>
                <th className="py-2 px-4 border-b border-gray-200">Verification Status</th>
                <th className="py-2 px-4 border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employers.map((employer) => (
                <tr key={employer._id}>
                  <td className="py-2 px-4 border-b border-gray-200">{employer.name}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{employer.email}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{employer.phone}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {employer.isVerified ? 'Verified' : 'Not Verified'}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {employer.isVerified ? (
                      <button
                        onClick={() => handleVerification(employer._id, false)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Unverify
                      </button>
                    ) : (
                      <button
                        onClick={() => handleVerification(employer._id, true)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default Admin;
