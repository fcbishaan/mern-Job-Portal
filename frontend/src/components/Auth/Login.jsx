// src/components/Auth/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Context } from '../../main';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser, setIsAuthorized } = useContext(Context);
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:4000/api/v1/user/login',
        { email, password },
        { withCredentials: true }
      );
      setUser(response.data.user);
      setIsAuthorized(true);
      if (response.data.user.role === 'Admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error(error.response.data.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-3 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <form onSubmit={loginHandler}>
          <div className="space-y-2">
            <label className="block text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
