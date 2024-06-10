import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../main';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, isAuthorized } = useContext(Context);
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]); // Add this state for users
  const navigateTo = useNavigate();

  useEffect(() => {
    if (isAuthorized) {
      const fetchJobs = async () => {
        try {
          const { data } = await axios.get('http://localhost:4000/api/v1/job/getall', {
            withCredentials: true,
          });
          setJobs(data.jobs);
        } catch (error) {
          toast.error(error.response.data.message);
        }
      };
      fetchJobs();
      
      const fetchUsers = async () => {
        try {
          const { data } = await axios.get('http://localhost:4000/api/v1/user/users', {
            withCredentials: true,
          });
          setUsers(data.users.filter(u => u.role !== 'Admin')); // Exclude admin users
        } catch (error) {
          toast.error(error.response.data.message);
        }
      };
      fetchUsers();
    } else {
      navigateTo('/');
    }
  }, [isAuthorized, navigateTo]);

  const handleVerify = async (id) => {
    try {
      const { data } = await axios.put(`http://localhost:4000/api/v1/job/verify/${id}`, {}, {
        withCredentials: true,
      });
      toast.success(data.message);
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === id ? { ...job, isVerified: true } : job
        )
      );
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      const { data } = await axios.delete(`http://localhost:4000/api/v1/job/delete/${id}`, {
        withCredentials: true,
      });
      toast.success(data.message);
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const { data } = await axios.delete(`http://localhost:4000/api/v1/user/${id}`, {
        withCredentials: true,
      });
      toast.success(data.message);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <section className="admin_dashboard page bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">Job Management</h1>
        {jobs.length <= 0 ? (
          <h4 className="text-center text-gray-500">No Jobs Found</h4>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200">Title</th>
                <th className="py-2 px-4 border-b border-gray-200">Category</th>
                <th className="py-2 px-4 border-b border-gray-200">Job Type</th>
                <th className="py-2 px-4 border-b border-gray-200">Verified</th>
                <th className="py-2 px-4 border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td className="py-2 px-4 border-b border-gray-200">{job.title}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{job.category}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{job.jobType}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {job.isVerified ? (
                      <span className="text-green-600 font-bold">Verified</span>
                    ) : (
                      user.role === 'Admin' && (
                        <button
                          onClick={() => handleVerify(job._id)}
                          className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                        >
                          Verify
                        </button>
                      )
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {user.role === 'Admin' && (
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Delete Job
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-700 mt-12">User Management</h1>
        {users.length <= 0 ? (
          <h4 className="text-center text-gray-500">No Users Found</h4>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200">Name</th>
                <th className="py-2 px-4 border-b border-gray-200">Email</th>
                <th className="py-2 px-4 border-b border-gray-200">Role</th>
                <th className="py-2 px-4 border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="py-2 px-4 border-b border-gray-200">{user.name}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{user.email}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{user.role}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Delete User
                    </button>
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

export default AdminDashboard;
