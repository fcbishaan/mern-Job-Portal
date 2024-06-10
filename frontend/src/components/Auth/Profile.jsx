import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../../main';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { user, setUser, setIsAuthorized } = useContext(Context);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || '',
  });

  useEffect(() => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      role: user?.role || '',
    });
  }, [user]);

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:4000/api/v1/user/logout', {
        withCredentials: true,
      });
      setUser(null);
      setIsAuthorized(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        'http://localhost:4000/api/v1/user/profile',
        formData,
        { withCredentials: true }
      );
      setUser(response.data.user);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div className="profile bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-semibold mb-6">Profile</h1>
          {user ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-lg font-medium">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-lg font-medium">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-lg font-medium">Phone:</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-lg font-medium">Role:</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-500 transition-colors duration-300"
              >
                Update Profile
              </button>
              <button
                type="button"
                className="bg-red-700 text-white py-2 px-4 rounded-md hover:bg-red-500 transition-colors duration-300"
                onClick={handleLogout}
              >
                Logout
              </button>
            </form>
          ) : (
            <p className="text-lg">Please log in to view your profile.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
