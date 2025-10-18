import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';

function ProtectedRoute({ isAuthenticated, loading, children }) {
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Show a loader while authentication is being checked
  }

  if (!isAuthenticated) {
    // Redirect to the login page and remember the original URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is authenticated, render the children (the protected route)
  return children;
}

export default ProtectedRoute;
