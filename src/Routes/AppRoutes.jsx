/**
 * File: src/Routes/AppRoutes.jsx
 * Updated: 2026-03-18
 *
 * Purpose:
 * - Main routing configuration for the application
 * - Public routes and protected dashboard routes
 *
 * Changes:
 * - Wrapped dashboard routes with ProtectedRoutes
 *
 * Connected Modules:
 * - All page components
 *
 * Dependencies:
 * - react-router-dom
 */

import { Route, Routes } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes.jsx';

// Public pages
import AboutMain from '../components/aboutWeb/AboutMain.jsx';
import ContactMain from '../components/contactweb/ContactMain.jsx';
import Reports from '../components/reports/Reports.jsx';
import ServiceMain from '../components/serviseWeb/ServiceMain.jsx';
import ForgotPasswordPage from '../pages/ForgotPasswordPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import ReportsPage from '../pages/ReportsPage.jsx';

// Dashboard pages
import CommunityPostPage from '../SoftwareApplication/software_applications_pages/CommunityPostPage.jsx';
import DashboardPage from '../SoftwareApplication/software_applications_pages/DashboardPage.jsx';
import EmergencyContactPage from '../SoftwareApplication/software_applications_pages/EmergencyContactPage.jsx';
import IncidentReportsPage from '../SoftwareApplication/software_applications_pages/IncidentReportsPage.jsx';
import ProfilePage from '../SoftwareApplication/software_applications_pages/ProfilePage.jsx';
import SOSHistoryPage from '../SoftwareApplication/software_applications_pages/SOSHistoryPage.jsx';
import SOSPage from '../SoftwareApplication/software_applications_pages/SOSPage.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutMain />} />
      <Route path="/services" element={<ServiceMain />} />
      <Route path="/contact" element={<ContactMain />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/public-reports" element={<ReportsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/sos" element={<SOSPage />} />
        <Route path="/contacts" element={<EmergencyContactPage />} />
        <Route path="/community-posts" element={<CommunityPostPage />} />
        <Route path="/incident-reports" element={<IncidentReportsPage />} />
        <Route path="/sos-history" element={<SOSHistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* 404 - Add a 404 page if needed */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};

export default AppRoutes;
