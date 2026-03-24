/**
 * File: src/SoftwareApplication/profile/ProfileMain.jsx
 * Updated: 2026-03-22
 *
 * Purpose:
 * - Main container for the profile page
 * - Fetches real user data and stats from backend on mount
 * - Distributes data and update handlers to child components
 *
 * Changes:
 * - Connected to getUserProfile and getUserStats API calls
 * - Added loading and error states
 * - Replaced all hardcoded mock data with real API data
 * - privacySettings remain static as requested
 *
 * Connected Modules:
 * - Profile.jsx, PersonalInformation.jsx, EmergencyContact.jsx
 * - PrivacySettings.jsx, QuickLinks.jsx
 * - user.service.js (frontend)
 *
 * Dependencies:
 * - react: hooks
 * - react-icons/ri: Loading spinner icon
 */

import React, { useCallback, useEffect, useState } from 'react';
import { RiLoader4Line } from 'react-icons/ri';
import {
  getUserProfile,
  getUserStats,
  updateEmergencyContact,
  updateUserProfile,
} from '../../services/user.service.js';
import EmergencyContact from './profile_components/EmergencyContact';
import PersonalInformation from './profile_components/PersonalInformation';
import PrivacySettings from './profile_components/PrivacySettings';
import Profile from './profile_components/Profile';
import QuickLinks from './profile_components/QuickLinks';

const ProfileMain = () => {
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({ reportsCount: 0, sosCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Privacy settings are static as requested
  const [privacySettings] = useState({
    profileVisibility: true,
    locationSharing: true,
    emailNotifications: true,
  });

  // Fetch profile and stats on mount
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError('');

        const [user, userStats] = await Promise.all([
          getUserProfile(),
          getUserStats(),
        ]);

        if (!cancelled) {
          setProfileData(user);
          setStats(userStats);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load profile');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Called by PersonalInformation after a successful save
  const handleProfileUpdate = useCallback((updatedUser) => {
    setProfileData((prev) => ({ ...prev, ...updatedUser }));
  }, []);

  // Called by Profile.jsx after avatar upload
  const handleAvatarUpdate = useCallback((updatedUser) => {
    setProfileData((prev) => ({ ...prev, ...updatedUser }));
  }, []);

  // Called by EmergencyContact after a successful save
  const handleEmergencyContactUpdate = useCallback((updatedUser) => {
    setProfileData((prev) => ({ ...prev, ...updatedUser }));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RiLoader4Line
          className="text-4xl text-[#6C63FF] animate-spin"
          aria-label="Loading profile"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1">
          <Profile
            profileData={profileData}
            stats={stats}
            onAvatarUpdate={handleAvatarUpdate}
          />
          <QuickLinks className="mt-6" />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2">
          <PersonalInformation
            profileData={profileData}
            onUpdate={handleProfileUpdate}
            updateUserProfile={updateUserProfile}
          />
          <EmergencyContact
            emergencyContact={profileData.emergencyContact}
            onUpdate={handleEmergencyContactUpdate}
            updateEmergencyContact={updateEmergencyContact}
            className="mt-6"
          />
          <PrivacySettings
            settings={privacySettings}
            onUpdate={() => {}}
            className="mt-6"
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProfileMain);
