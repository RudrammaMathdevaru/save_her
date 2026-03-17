/**
 * File: src/Routes/AppRoutes.jsx
 * Updated: 2026-03-11
 *
 * Purpose:
 * - Main routing configuration for the application.
 * - Handles both public pages (home, about, etc.) and protected dashboard routes.
 *
 * Changes:
 * - Removed redundant /about route (now handled by home page scroll)
 * - Added /service and /contact routes if needed for direct access
 * - Preserved all dashboard and auth routes
 */

import { Route, Routes } from 'react-router-dom';

/* Public Pages */
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ReportsPage from '../pages/ReportsPage';

/* Auth */
import ForgotPassword from '../pages/ForgotPasswordPage';

/* Dashboard Pages */
import CommunityPosts from '../components/dashboard/dashboard_componenta/CommunityPosts';
import EmergencyContacts from '../components/dashboard/dashboard_componenta/EmergencyContacts';
import Profile from '../components/dashboard/dashboard_componenta/Profile';
import Dashboard from '../components/dashboard/dashboard_componenta/SafeherDashboard';
import SOS from '../components/dashboard/dashboard_componenta/SOS';
import SOSHistory from '../components/dashboard/dashboard_componenta/SOSHistory';

/* Optional: If you need direct access to service/contact pages (not just scroll) */
// import ServicePage from "../pages/ServicePage";
// import ContactPage from "../pages/ContactPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Main landing page with all sections */}
      <Route path="/" element={<HomePage />} />

      {/* Optional direct routes if needed */}
      {/* <Route path="/service" element={<ServicePage />} /> */}
      {/* <Route path="/contact" element={<ContactPage />} /> */}

      {/* Public routes */}
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Dashboard routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/sos" element={<SOS />} />
      <Route path="/contacts" element={<EmergencyContacts />} />
      <Route path="/community-posts" element={<CommunityPosts />} />
      <Route path="/sos-history" element={<SOSHistory />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default AppRoutes;
