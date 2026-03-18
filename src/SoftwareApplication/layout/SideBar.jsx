/**
 * File: src/SoftwareApplication/layout/SideBar.jsx
 * Updated: 2026-03-18
 *
 * Purpose:
 * - Enterprise-grade collapsible sidebar with smooth transitions
 * - Pure black/white theme (no colors)
 * - Hardware-accelerated animations for 60fps performance
 * - Fixed positioning for better animation performance
 * - Full accessibility support (WCAG 2.1 AA)
 * - Responsive mobile drawer with overlay
 *
 * Changes:
 * - Added Incident Reports navigation item between Community and Profile
 * - Used FiAlertTriangle icon for Incident Reports feature
 * - Maintained consistent ordering and styling
 *
 * Connected Modules:
 * - SoftwareApplicationRoutes.jsx (parent layout)
 * - TopBar.jsx (provides toggle state)
 *
 * Dependencies:
 * - react-icons/fi: Feather icons
 * - react-router-dom: Navigation
 * - Tailwind CSS v4: Styling (via vite.config.js)
 */

import { useEffect, useRef } from 'react';
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiClock,
  FiHome,
  FiLogOut,
  FiMessageCircle,
  FiUser,
  FiUsers,
} from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
  { path: '/sos', icon: FiAlertCircle, label: 'SOS' },
  { path: '/contacts', icon: FiUsers, label: 'Emergency Contacts' },
  { path: '/community-posts', icon: FiMessageCircle, label: 'Community' },
  {
    path: '/incident-reports',
    icon: FiAlertTriangle,
    label: 'Incident Reports',
  },
  { path: '/sos-history', icon: FiClock, label: 'SOS History' },
  { path: '/profile', icon: FiUser, label: 'Profile' },
];

const SideBar = ({ isCollapsed, isMobile, isOpen, onClose }) => {
  const sidebarRef = useRef(null);

  // Handle escape key for mobile drawer
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && isMobile) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isMobile, onClose]);

  // Handle body scroll lock for mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMobile, isOpen]);

  // For mobile drawer
  if (isMobile) {
    return (
      <>
        {/* Overlay with fade transition */}
        <div
          className={`
            fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-in-out
            ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          onClick={onClose}
          aria-hidden="true"
          style={{ willChange: 'opacity' }}
        />

        {/* Drawer with slide transition */}
        <aside
          ref={sidebarRef}
          className={`
            fixed left-0 top-0 h-full w-64 sm:w-72 bg-white shadow-xl z-50
            transform transition-transform duration-300 ease-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
          aria-label="Mobile navigation"
          aria-hidden={!isOpen}
          style={{ willChange: 'transform' }}
        >
          <SidebarContent
            isCollapsed={false}
            isMobile={true}
            onClose={onClose}
          />
        </aside>
      </>
    );
  }

  // Desktop sidebar with fixed positioning and smooth width transition
  return (
    <aside
      ref={sidebarRef}
      className={`
        fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-sm
        transition-all duration-300 ease-out transform-gpu
        ${isCollapsed ? 'w-20' : 'w-64'}
        flex flex-col
      `}
      aria-label="Main navigation"
      style={{ willChange: 'width' }}
    >
      <SidebarContent isCollapsed={isCollapsed} />
    </aside>
  );
};

const SidebarContent = ({ isCollapsed, isMobile, onClose }) => {
  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleLogout = () => {
    // Handle logout logic here
    window.location.href = '/';
  };

  return (
    <>
      {/* Logo Area */}
      <div
        className={`
          flex items-center h-16 px-4 border-b border-gray-200
          ${isCollapsed ? 'justify-center' : 'justify-start'}
          overflow-hidden
        `}
      >
        <div
          className={`
            flex items-center gap-2
            ${isCollapsed ? 'justify-center' : ''}
            overflow-hidden
          `}
        >
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">S</span>
          </div>

          {/* Logo text with opacity transition only */}
          <span
            className={`
              font-semibold text-lg text-black whitespace-nowrap
              transition-opacity duration-300 transform-gpu
              ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}
            `}
            aria-hidden={isCollapsed}
          >
            Safe<span className="font-bold">Her</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <ul className="space-y-1.5">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={handleNavClick}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-all duration-200 transform-gpu
                  hover:scale-[1.02] active:scale-[0.98]
                  focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
                  ${isCollapsed ? 'justify-center' : ''}
                  ${
                    isActive
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-black hover:text-white'
                  }
                `}
              >
                <item.icon size={20} className="flex-shrink-0 transform-gpu" />

                {/* Text with opacity transition only */}
                <span
                  className={`
                    text-sm font-medium whitespace-nowrap
                    transition-opacity duration-300 transform-gpu
                    ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}
                  `}
                  aria-hidden={isCollapsed}
                >
                  {item.label}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <div
        className={`
          border-t border-gray-200 p-4
          ${isCollapsed ? 'text-center' : ''}
        `}
      >
        <div
          className={`
            flex items-center gap-3
            ${isCollapsed ? 'justify-center' : ''}
            overflow-hidden
          `}
        >
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-semibold flex-shrink-0 transform-gpu transition-transform hover:scale-105">
            JD
          </div>

          {/* User info with opacity transition only */}
          <div
            className={`
              flex-1 min-w-0 transition-opacity duration-300 transform-gpu
              ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}
            `}
            aria-hidden={isCollapsed}
          >
            <p className="text-sm font-medium text-black truncate">Jane Doe</p>
            <p className="text-xs text-gray-500 truncate">jane@safeher.com</p>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className={`
            mt-4 w-full flex items-center gap-2 px-3 py-2 rounded-lg 
            text-black hover:bg-black hover:text-white
            transition-all duration-200 transform-gpu
            hover:scale-[1.02] active:scale-[0.98]
            focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
            text-sm font-medium
            ${isCollapsed ? 'justify-center' : ''}
          `}
          title={isCollapsed ? 'Logout' : undefined}
          aria-label="Logout"
        >
          <FiLogOut size={18} className="flex-shrink-0" />

          {/* Logout text with opacity transition only */}
          <span
            className={`
              transition-opacity duration-300 transform-gpu
              ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}
            `}
            aria-hidden={isCollapsed}
          >
            Logout
          </span>
        </button>
      </div>
    </>
  );
};

export default SideBar;
