/**
 * File: src/SoftwareApplication/routes_for_software_application/SoftwareApplicationRoutes.jsx
 * Updated: 2026-03-17
 *
 * Purpose:
 * - Main layout for software application
 * - Uses fixed sidebar with margin-based content for smooth animations
 * - Collapsible sidebar with modern design
 * - Mobile responsive with drawer
 * - Pure black/white theme
 *
 * Changes:
 * - Changed from flex layout to fixed sidebar + margin content
 * - Added dynamic margin transition for content area (ml-20 / ml-64)
 * - Fixed layout mismatch with SideBar component
 * - Preserved all routing logic and mobile detection
 * - Optimized for 60fps animations
 *
 * Connected Modules:
 * - App.jsx
 * - SideBar.jsx (fixed positioning version)
 * - TopBar.jsx
 *
 * Dependencies:
 * - react-router-dom: For routing
 * - react: Hooks for state management
 */

import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

// Dashboard Components
import EmergencyContacts from '../../SoftwareApplication/software_applications_pages/EmergencyContactPage';
import CommunityPosts from '../software_applications_pages/CommunityPostPage';
import Dashboard from '../software_applications_pages/DashboardPage';
import IncidentReportsPage from '../software_applications_pages/IncidentReportsPage';
import Profile from '../software_applications_pages/ProfilePage';
import SOSHistory from '../software_applications_pages/SOSHistoryPage';
import SOS from '../software_applications_pages/SOSPage';

// Layout Components
import SideBar from '../layout/SideBar';
import TopBar from '../layout/TopBar';

const SoftwareApplicationRoutes = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSidebarToggle = () => {
    if (isMobile) {
      // On mobile, toggle the drawer
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      // On desktop, toggle collapsed state
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  // Calculate margin for main content based on sidebar state
  // On mobile, margin is 0 (sidebar is hidden/drawer)
  // On desktop, margin changes with collapsed state
  const contentMargin = isMobile
    ? 'ml-0'
    : sidebarCollapsed
      ? 'ml-20'
      : 'ml-64';

  return (
    <div className="relative h-screen bg-white overflow-hidden">
      {/* Sidebar - fixed positioning */}
      <SideBar
        isCollapsed={sidebarCollapsed}
        isMobile={isMobile}
        isOpen={mobileMenuOpen}
        onClose={handleMobileMenuClose}
      />

      {/* Main Content Area - with dynamic margin that transitions smoothly */}
      <div
        className={`
          ${contentMargin} transition-all duration-300 ease-out transform-gpu
          h-screen flex flex-col
        `}
        style={{ willChange: 'margin-left' }}
      >
        <TopBar
          onMobileMenuToggle={handleSidebarToggle}
          onSidebarToggle={handleSidebarToggle}
          isSidebarCollapsed={sidebarCollapsed}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sos" element={<SOS />} />
              <Route path="/contacts" element={<EmergencyContacts />} />
              <Route path="/community-posts" element={<CommunityPosts />} />
              <Route
                path="/incident-reports"
                element={<IncidentReportsPage />}
              />
              <Route path="/sos-history" element={<SOSHistory />} />
              <Route path="/profile" element={<Profile />} />

              <Route path="*" element={<Dashboard />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SoftwareApplicationRoutes;
