/**
 * File: src/SoftwareApplication/layout/TopBar.jsx
 * Updated: 2026-03-18
 *
 * Purpose:
 * - Enterprise-grade top navigation bar with black/white theme
 * - Mobile-responsive with hamburger menu trigger
 * - Sidebar toggle button for desktop
 * - Notification and user section aligned to far right
 * - Smooth dropdown animations with proper positioning
 * - Full accessibility support with keyboard navigation
 *
 * Changes:
 * - Added real user data from AuthContext
 * - Updated user avatar with initials
 *
 * Connected Modules:
 * - SoftwareApplicationRoutes.jsx (parent layout)
 * - SideBar.jsx (receives toggle state)
 *
 * Dependencies:
 * - react-icons/fi: Feather icons
 * - useAuth: Authentication context
 */

import { useEffect, useRef, useState } from 'react';
import {
  FiBell,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiUser,
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth.js';

const TopBar = ({
  onMobileMenuToggle,
  onSidebarToggle,
  isSidebarCollapsed,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();

  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key for dropdowns
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.full_name) return 'U';

    const names = user.full_name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.full_name.substring(0, 2).toUpperCase();
  };

  const notifications = [
    {
      id: 1,
      message: 'New SOS alert in your area',
      time: '2 minutes ago',
      read: false,
    },
    {
      id: 2,
      message: 'Your safety check is due',
      time: '1 hour ago',
      read: false,
    },
    { id: 3, message: 'Community post liked', time: '3 hours ago', read: true },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 lg:px-6 sticky top-0 z-30 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center flex-1">
        {/* Mobile Menu Button */}
        <button
          onClick={onMobileMenuToggle}
          className="
            lg:hidden p-2 rounded-lg hover:bg-black hover:text-white mr-2
            transition-all duration-200 transform-gpu
            hover:scale-105 active:scale-95
            focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
            text-black
          "
          aria-label="Toggle menu"
          aria-expanded="false"
        >
          <FiMenu size={20} className="transform-gpu" />
        </button>

        {/* Sidebar Toggle Button (desktop only) */}
        <button
          onClick={onSidebarToggle}
          className="
            hidden lg:flex p-2 rounded-lg hover:bg-black hover:text-white mr-3
            transition-all duration-200 transform-gpu
            hover:scale-105 active:scale-95
            focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
            text-black
          "
          aria-label={
            isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
          }
        >
          {isSidebarCollapsed ? (
            <FiChevronRight size={20} className="transform-gpu" />
          ) : (
            <FiChevronLeft size={20} className="transform-gpu" />
          )}
        </button>

        {/* Page Title */}
        <h1 className="text-lg font-semibold text-black">Dashboard</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-end gap-1 sm:gap-2">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="
              p-2 rounded-lg hover:bg-black hover:text-white text-black relative
              transition-all duration-200 transform-gpu
              hover:scale-105 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
            "
            aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
            aria-expanded={showNotifications}
          >
            <FiBell size={20} className="transform-gpu" />
            {unreadCount > 0 && (
              <span
                className="
                  absolute -top-1 -right-1 w-5 h-5 bg-black text-white 
                  text-xs rounded-full flex items-center justify-center
                "
                aria-label={`${unreadCount} unread notifications`}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              className="
                absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl 
                border border-gray-200 py-2 z-50
                animate-dropdown origin-top-right
              "
              role="menu"
              aria-label="Notifications"
            >
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="font-semibold text-black">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    className={`
                      w-full text-left px-4 py-3 hover:bg-black hover:text-white 
                      transition-colors duration-200
                      focus:outline-none focus:bg-black focus:text-white
                      ${!notification.read ? 'bg-gray-50' : ''}
                    `}
                    role="menuitem"
                  >
                    <p className="text-sm text-inherit">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.time}
                    </p>
                  </button>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-gray-200">
                <button
                  className="
                    text-sm text-black hover:text-black font-medium
                    transition-colors duration-200
                    focus:outline-none focus:underline
                  "
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="
              flex items-center gap-2 p-2 rounded-lg hover:bg-black hover:text-white
              transition-all duration-200 transform-gpu
              hover:scale-105 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
              text-black
            "
            aria-label="User menu"
            aria-expanded={showUserMenu}
          >
            <div
              className="
                w-8 h-8 rounded-full bg-black
                flex items-center justify-center text-white font-semibold
                transform-gpu transition-transform
              "
            >
              {getUserInitials()}
            </div>
            <span className="hidden md:block text-sm font-medium text-black">
              {user?.full_name?.split(' ')[0] || 'User'}
            </span>
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div
              className="
                absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl 
                border border-gray-200 py-1 z-50
                animate-dropdown origin-top-right
              "
              role="menu"
              aria-label="User menu"
            >
              <button
                className="
                  w-full flex items-center gap-2 px-4 py-2 text-sm text-black 
                  hover:bg-black hover:text-white transition-colors duration-200
                  focus:outline-none focus:bg-black focus:text-white
                "
                role="menuitem"
              >
                <FiUser size={16} />
                <span>Profile</span>
              </button>
              <button
                className="
                  w-full flex items-center gap-2 px-4 py-2 text-sm text-black 
                  hover:bg-black hover:text-white transition-colors duration-200
                  focus:outline-none focus:bg-black focus:text-white
                "
                role="menuitem"
              >
                <FiSettings size={16} />
                <span>Settings</span>
              </button>
              <hr className="my-1 border-gray-200" />
              <button
                onClick={handleLogout}
                className="
                  w-full flex items-center gap-2 px-4 py-2 text-sm text-black 
                  hover:bg-black hover:text-white transition-colors duration-200
                  focus:outline-none focus:bg-black focus:text-white
                "
                role="menuitem"
              >
                <FiLogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
