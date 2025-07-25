import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // For routes that require authentication
  if (requireAuth) {
    // Check if user is authenticated and has valid user data
    if (!isAuthenticated || !user) {
      console.log('🚫 Access denied - redirecting to login');
      // Redirect to login with the current location so we can redirect back after login
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Additional check: verify token exists in localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('🚫 No token found - redirecting to login');
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // All checks passed, render the protected component
    return <>{children}</>;
  }

  // For routes that should only be accessible when NOT authenticated (login, register)
  if (!requireAuth && isAuthenticated && user) {
    console.log('✅ User already authenticated - redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // Render the public component
  return <>{children}</>;
};

export default ProtectedRoute;
