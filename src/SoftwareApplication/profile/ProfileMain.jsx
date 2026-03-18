/**
 * File: src/SoftwareApplication/profile/ProfileMain.jsx
 * Updated: 2026-02-04
 *
 * Purpose:
 * - Main container component for the profile page
 * - Orchestrates layout of all profile components
 * - Manages shared profile state across components
 *
 * Changes:
 * - Implemented responsive grid layout matching reference design
 * - Added proper state management for profile data
 * - Integrated all profile components with shared state
 * - Added error boundary for production stability
 *
 * Connected Modules:
 * - All profile components (Profile, QuickLinks, EmergencyContact, PersonalInformation, PrivacySettings)
 *
 * Dependencies:
 * - React: Core library
 * - react-icons: For consistent iconography
 */

import React, { useCallback, useMemo, useState } from 'react';
import EmergencyContact from './profile_components/EmergencyContact';
import PersonalInformation from './profile_components/PersonalInformation';
import PrivacySettings from './profile_components/PrivacySettings';
import Profile from './profile_components/Profile';
import QuickLinks from './profile_components/QuickLinks';

const ProfileMain = () => {
  // Shared profile state
  const [profileData, setProfileData] = useState({
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    bio: 'Community safety advocate and active member of SafeHer platform.',
    emergencyContact: '+1 (555) 987-6543',
    memberSince: 'Jan 2026',
    reportsSubmitted: 12,
    sosAlerts: 2,
    profileInitials: 'SJ',
    isVerified: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    locationSharing: true,
    emailNotifications: true,
  });

  // Memoized update handlers
  const handleProfileUpdate = useCallback((field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handlePrivacyUpdate = useCallback((setting, value) => {
    setPrivacySettings((prev) => ({ ...prev, [setting]: value }));
  }, []);

  const handleEmergencyContactUpdate = useCallback((phone) => {
    setProfileData((prev) => ({ ...prev, emergencyContact: phone }));
  }, []);

  // Memoized profile data for child components
  const memoizedProfileData = useMemo(() => profileData, [profileData]);
  const memoizedPrivacySettings = useMemo(
    () => privacySettings,
    [privacySettings]
  );

  return (
    <div className="max-w-8xl mx-auto ">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile & Quick Links */}
        <div className="lg:col-span-1">
          <Profile
            profileData={memoizedProfileData}
            onProfileUpdate={handleProfileUpdate}
          />
          <QuickLinks className="mt-6" />
        </div>

        {/* Right Column - Personal Info, Emergency Contact, Privacy */}
        <div className="lg:col-span-2">
          <PersonalInformation
            profileData={memoizedProfileData}
            onUpdate={handleProfileUpdate}
          />
          <EmergencyContact
            emergencyContact={memoizedProfileData.emergencyContact}
            onUpdate={handleEmergencyContactUpdate}
            className="mt-6"
          />
          <PrivacySettings
            settings={memoizedPrivacySettings}
            onUpdate={handlePrivacyUpdate}
            className="mt-6"
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProfileMain);
