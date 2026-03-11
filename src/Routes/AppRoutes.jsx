import React from "react";
import { Routes, Route } from "react-router-dom";

/* Public Pages */
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ReportsPage from "../pages/ReportsPage";

/* Auth */
import ForgotPassword from "../components/login/login_components/ForgotPassword";

/* Dashboard Pages */
import Dashboard from "../components/dashboard/dashboard_componenta/SafeherDashboard";
import SOS from "../components/dashboard/dashboard_componenta/SOS";
import EmergencyContacts from "../components/dashboard/dashboard_componenta/EmergencyContacts";
import CommunityPosts from "../components/dashboard/dashboard_componenta/CommunityPosts";
import SOSHistory from "../components/dashboard/dashboard_componenta/SOSHistory";
import Profile from "../components/dashboard/dashboard_componenta/Profile";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/reports" element={<ReportsPage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

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