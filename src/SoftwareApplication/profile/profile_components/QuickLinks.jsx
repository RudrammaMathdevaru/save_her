/**
 * File: src/SoftwareApplication/profile/profile_components/QuickLinks.jsx
 * Updated: 2026-02-04
 *
 * Purpose:
 * - Displays quick action links for profile management
 * - Handles navigation to different settings sections
 *
 * Changes:
 * - Added proper button semantics with accessibility
 * - Implemented keyboard navigation
 * - Added ARIA labels for screen readers
 * - Used react-icons consistently
 *
 * Connected Modules:
 * - ProfileMain.jsx (parent)
 *
 * Dependencies:
 * - react-icons/ri: For Remix Icon set
 */

import React, { useCallback } from 'react';
import {
  RiArrowRightSLine,
  RiDeleteBinLine,
  RiNotification3Line,
  RiShieldKeyholeLine,
} from 'react-icons/ri';

const QuickLinks = ({ className = '' }) => {
  const handleLinkClick = useCallback((action) => {
    // Navigation logic would go here
    console.log(`Navigating to: ${action}`);
  }, []);

  const handleKeyDown = useCallback(
    (event, action) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleLinkClick(action);
      }
    },
    [handleLinkClick]
  );

  const links = [
    {
      id: 'password',
      icon: RiShieldKeyholeLine,
      label: 'Change Password',
      color: 'purple',
      action: 'change-password',
    },
    {
      id: 'notifications',
      icon: RiNotification3Line,
      label: 'Notification Settings',
      color: 'green',
      action: 'notification-settings',
    },
    {
      id: 'delete',
      icon: RiDeleteBinLine,
      label: 'Delete Account',
      color: 'red',
      action: 'delete-account',
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      purple: 'bg-purple-50 text-[#6C63FF]',
      green: 'bg-green-50 text-green-600',
      red: 'bg-red-50 text-red-500',
    };
    return colors[color] || colors.purple;
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 ${className}`}
    >
      <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
      <div className="space-y-3" role="navigation" aria-label="Quick actions">
        {links.map(({ id, icon: Icon, label, color, action }) => (
          <button
            key={id}
            onClick={() => handleLinkClick(action)}
            onKeyDown={(e) => handleKeyDown(e, action)}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2"
            aria-label={label}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 ${getColorClasses(color)} rounded-lg flex items-center justify-center`}
              >
                <Icon aria-hidden="true" />
              </div>
              <span className="font-medium text-gray-700">{label}</span>
            </div>
            <RiArrowRightSLine className="text-gray-400" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(QuickLinks);
