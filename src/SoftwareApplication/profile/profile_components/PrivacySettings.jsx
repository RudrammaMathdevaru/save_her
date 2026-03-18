/**
 * File: src/SoftwareApplication/profile/profile_components/PrivacySettings.jsx
 * Updated: 2026-02-04
 *
 * Purpose:
 * - Manages privacy and notification settings
 * - Handles toggle switches with proper accessibility
 *
 * Changes:
 * - Added accessible toggle switches with ARIA attributes
 * - Implemented proper state management
 * - Added keyboard navigation support
 * - Used semantic HTML structure
 *
 * Connected Modules:
 * - ProfileMain.jsx (parent)
 *
 * Dependencies:
 * - No additional npm packages required
 */

import React, { useCallback } from 'react';

const PrivacySettings = ({ settings, onUpdate, className = '' }) => {
  const { profileVisibility, locationSharing, emailNotifications } = settings;

  const handleToggle = useCallback(
    (setting, currentValue) => {
      onUpdate(setting, !currentValue);
    },
    [onUpdate]
  );

  const handleKeyDown = useCallback(
    (event, setting, currentValue) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleToggle(setting, currentValue);
      }
    },
    [handleToggle]
  );

  const settingsList = [
    {
      id: 'profileVisibility',
      label: 'Profile Visibility',
      description: 'Make your profile visible to other community members',
      value: profileVisibility,
    },
    {
      id: 'locationSharing',
      label: 'Location Sharing',
      description: 'Share location during SOS alerts',
      value: locationSharing,
    },
    {
      id: 'emailNotifications',
      label: 'Email Notifications',
      description: 'Receive updates about your reports and community',
      value: emailNotifications,
    },
  ];

  return (
    <div
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 sm:p-8 ${className}`}
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Privacy Settings
      </h2>

      <div className="space-y-4">
        {settingsList.map(({ id, label, description, value }) => (
          <div
            key={id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
          >
            <div>
              <p className="font-medium text-gray-900">{label}</p>
              <p className="text-sm text-gray-500">{description}</p>
            </div>

            <div
              role="switch"
              aria-checked={value}
              aria-label={label}
              tabIndex={0}
              onClick={() => handleToggle(id, value)}
              onKeyDown={(e) => handleKeyDown(e, id, value)}
              className="relative inline-flex items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 rounded-full"
            >
              <div
                className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                  value ? 'bg-[#6C63FF]' : 'bg-gray-300'
                }`}
              />
              <div
                className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
                  value ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(PrivacySettings);
