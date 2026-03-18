/**
 * File: src/Routes/AppRoutes.jsx
 * Updated: 2026-03-17
 *
 * Purpose:
 * - Website public routes only (no dashboard routes)
 * - Home, Login, Register, Reports, ForgotPassword
 *
 * Changes:
 * - Removed all dashboard routes (moved to SoftwareApplicationRoutes)
 * - Clean separation between website and software application
 *
 * Connected Modules:
 * - App.jsx (main layout controller)
 * - All website pages
 */

import { Route, Routes } from 'react-router-dom';

// Public Website Pages
import ForgotPassword from '../pages/ForgotPasswordPage';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ReportsPage from '../pages/ReportsPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Main landing page */}
      <Route path="/" element={<HomePage />} />

      {/* Public routes */}
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Note: All dashboard routes are handled by SoftwareApplicationRoutes */}
      {/* This ensures clean separation between website and software app */}
    </Routes>
  );
};

export default AppRoutes;
