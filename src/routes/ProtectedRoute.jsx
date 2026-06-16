import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { SkeletonPage } from '../components/Skeleton';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <SkeletonPage />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    // Redirect wrong role to their respective dashboard
    const destination = currentUser.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
    return <Navigate to={destination} replace />;
  }

  return children;
};
