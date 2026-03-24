/**
 * File: src/Routes/ProtectedRoutes.jsx
 * Updated: 2026-03-18
 *
 * Purpose:
 * - Guard component for protected routes
 * - Redirects to login if not authenticated
 *
 * Changes:
 * - Replaced mock auth check with real AuthContext
 * - Added loading state
 *
 * Connected Modules:
 * - Used in AppRoutes.jsx
 *
 * Dependencies:
 * - react-router-dom
 * - useAuth hook
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from '../components/UI/Loader.jsx';
import { useAuth } from '../hooks/useAuth.js';

const ProtectedRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader message="Checking authentication..." />;
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoutes;
