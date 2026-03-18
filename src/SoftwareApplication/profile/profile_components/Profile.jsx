/**
 * File: src/SoftwareApplication/profile/profile_components/Profile.jsx
 * Updated: 2026-02-04
 *
 * Purpose:
 * - Displays user profile card with avatar, basic info, and stats
 * - Handles profile photo upload functionality
 *
 * Changes:
 * - Added proper file upload handling with preview
 * - Implemented accessibility attributes
 * - Added keyboard navigation support
 * - Optimized with useCallback for event handlers
 *
 * Connected Modules:
 * - ProfileMain.jsx (parent)
 *
 * Dependencies:
 * - react-icons/ri: For Remix Icon set
 */

import React, { useCallback, useRef, useState } from 'react';
import { RiCameraLine, RiUploadCloudLine } from 'react-icons/ri';

const Profile = ({ profileData, onProfileUpdate }) => {
  const {
    fullName,
    email,
    memberSince,
    reportsSubmitted,
    sosAlerts,
    profileInitials,
    isVerified,
  } = profileData;

  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handlePhotoClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          console.error('Please select an image file');
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          console.error('File size must be less than 5MB');
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
          onProfileUpdate('profileImage', reader.result);
        };
        reader.readAsDataURL(file);
      }
    },
    [onProfileUpdate]
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handlePhotoClick();
      }
    },
    [handlePhotoClick]
  );

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center">
      {/* Profile Photo Section */}
      <div className="relative inline-block mb-4">
        <div
          className="cursor-pointer group"
          onClick={handlePhotoClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-label="Change profile photo"
        >
          {previewImage ? (
            <img
              src={previewImage}
              alt={fullName}
              className="w-28 h-28 rounded-full object-cover mx-auto"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-[#6C63FF]/10 flex items-center justify-center text-[#6C63FF] font-medium text-2xl mx-auto">
              {profileInitials}
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <RiCameraLine className="text-white text-2xl" aria-hidden="true" />
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
        />
      </div>

      {/* Profile Info */}
      <h2 className="text-xl font-bold text-gray-900 mb-1">{fullName}</h2>
      <p className="text-gray-500 text-sm mb-4">{email}</p>

      {isVerified && (
        <div className="flex items-center justify-center space-x-2 mb-6">
          <span className="px-3 py-1 bg-[#6C63FF]/10 text-[#6C63FF] text-sm font-medium rounded-full">
            Verified Member
          </span>
        </div>
      )}

      {/* Stats Section */}
      <div className="border-t border-gray-100 pt-6 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Member Since</span>
          <span className="font-medium text-gray-900">{memberSince}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Reports Submitted</span>
          <span className="font-medium text-gray-900">{reportsSubmitted}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">SOS Alerts</span>
          <span className="font-medium text-gray-900">{sosAlerts}</span>
        </div>
      </div>

      {/* Change Photo Button */}
      <button
        onClick={handlePhotoClick}
        className="mt-6 w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#6C63FF] hover:text-[#6C63FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2"
        aria-label="Change profile photo"
      >
        <RiUploadCloudLine className="mr-2 inline-block" aria-hidden="true" />
        Change Photo
      </button>
    </div>
  );
};

export default React.memo(Profile);
