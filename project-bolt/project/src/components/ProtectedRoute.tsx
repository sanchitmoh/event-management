import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../services/auth.service';

interface ProtectedRouteProps {
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasRequiredRole, setHasRequiredRole] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const loggedIn = await AuthService.isLoggedIn(); // Check if user is logged in
        setIsLoggedIn(loggedIn);

        if (loggedIn && requiredRole) {
          const hasRole = AuthService.hasRole(requiredRole); // Check if user has the required role
          setHasRequiredRole(hasRole);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsLoggedIn(false);
        setHasRequiredRole(false);
      } finally {
        setIsLoading(false); // Stop loading once authentication is resolved
      }
    };

    checkAuth();
  }, [requiredRole]);

  // Show a loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-700">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login page if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to unauthorized page if user lacks the required role
  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render child routes if authenticated and authorized
  return <Outlet />;
};

export default ProtectedRoute;