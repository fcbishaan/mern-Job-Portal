// src/components/AdminRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Context } from '../../main';

const AdminRoute = ({ children }) => {
  const { user } = useContext(Context);

  return user && user.role === 'Admin' ? children : <Navigate to="/" />;
};

export default AdminRoute;
