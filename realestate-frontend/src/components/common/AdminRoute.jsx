import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated but not admin, redirect to properties
  if (!isAdmin()) {
    return <Navigate to="/properties" replace />;
  }
  
  // If authenticated and admin, render the children
  return children;
};

export default AdminRoute;