import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../services/AuthService';

interface ProtectedRouteProps {
  requiredRole?: string;
}

/**
 * A wrapper for routes that require authentication
 * Redirects to login if user is not authenticated
 * Optionally checks for specific roles
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const isLoggedIn = AuthService.isLoggedIn();
  
  // Check if user has required role (if specified)
  if (isLoggedIn && requiredRole) {
    const hasRequiredRole = AuthService.hasRole(requiredRole);
    
    // If role is required but user doesn't have it, redirect to unauthorized page
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // If not logged in, redirect to login page
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If logged in (and has required role if specified), render the child routes
  return <Outlet />;
};

export default ProtectedRoute; 