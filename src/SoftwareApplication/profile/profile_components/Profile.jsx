/**
 * File: src/SoftwareApplication/profile/profile_components/Profile.jsx
 * Updated: 2026-03-22
 *
 * Purpose:
 * - Display user profile card with real data from backend
 * - Handle avatar upload by sending file to API
 * - Show real member since date, reports count, SOS count
 *
 * Changes:
 * - Replaced all mock/hardcoded data with props from ProfileMain
 * - Avatar upload now calls updateAvatar API, not FileReader base64
 * - memberSince formatted from created_at timestamp
 * - reportsCount and sosCount come from stats prop
 * - Added upload loading state to prevent double submissions
 *
 * Connected Modules:
 * - ProfileMain.jsx (parent)
 * - user.service.js (frontend) for avatar upload
 *
 * Dependencies:
 * - react-icons/ri: Camera and upload icons
 */

import React, { useCallback, useRef, useState } from 'react';
import { RiCameraLine, RiLoader4Line, RiUploadCloudLine } from 'react-icons/ri';
import { updateAvatar } from '../../../services/user.service.js';

const Profile = ({ profileData, stats, onAvatarUpdate }) => {
  const { fullName, email, memberSince, profileImage } = profileData;

  const { reportsCount, sosCount } = stats;

  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Format the ISO date from DB into "Jan 2026"
  const formattedMemberSince = memberSince
    ? new Date(memberSince).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : 'N/A';

  // Build initials from full name for the avatar fallback
  const profileInitials = fullName
    ? fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const handlePhotoClick = useCallback(() => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  }, [isUploading]);

  const handleFileChange = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setUploadError('Only JPEG, PNG, or WEBP images are allowed');
        return;
      }

      // Validate size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image must be under 5MB');
        return;
      }

      setUploadError('');
      setIsUploading(true);

      try {
        const updatedUser = await updateAvatar(file);
        onAvatarUpdate(updatedUser);
      } catch (err) {
        setUploadError(err.message || 'Failed to upload image');
      } finally {
        setIsUploading(false);
        // Reset input so the same file can be re-selected if needed
        event.target.value = '';
      }
    },
    [onAvatarUpdate]
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
      {/* Avatar Section */}
      <div className="relative inline-block mb-4">
        <div
          className="cursor-pointer group"
          onClick={handlePhotoClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-label="Change profile photo"
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt={fullName}
              className="w-28 h-28 rounded-full object-cover mx-auto"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-[#6C63FF]/10 flex items-center justify-center text-[#6C63FF] font-medium text-2xl mx-auto">
              {profileInitials}
            </div>
          )}

          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {isUploading ? (
              <RiLoader4Line
                className="text-white text-2xl animate-spin"
                aria-hidden="true"
              />
            ) : (
              <RiCameraLine
                className="text-white text-2xl"
                aria-hidden="true"
              />
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
        />
      </div>

      {uploadError && (
        <p className="text-xs text-red-500 mb-2" role="alert">
          {uploadError}
        </p>
      )}

      {/* Name and Email */}
      <h2 className="text-xl font-bold text-gray-900 mb-1">{fullName}</h2>
      <p className="text-gray-500 text-sm mb-4">{email}</p>

      <div className="flex items-center justify-center space-x-2 mb-6">
        <span className="px-3 py-1 bg-[#6C63FF]/10 text-[#6C63FF] text-sm font-medium rounded-full">
          Verified Member
        </span>
      </div>

      {/* Stats — real data from DB */}
      <div className="border-t border-gray-100 pt-6 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Member Since</span>
          <span className="font-medium text-gray-900">
            {formattedMemberSince}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Reports Submitted</span>
          <span className="font-medium text-gray-900">{reportsCount}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">SOS Alerts</span>
          <span className="font-medium text-gray-900">{sosCount}</span>
        </div>
      </div>

      {/* Change Photo Button */}
      <button
        onClick={handlePhotoClick}
        disabled={isUploading}
        className="mt-6 w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#6C63FF] hover:text-[#6C63FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Change profile photo"
      >
        <RiUploadCloudLine className="mr-2 inline-block" aria-hidden="true" />
        {isUploading ? 'Uploading...' : 'Change Photo'}
      </button>
    </div>
  );
};

export default React.memo(Profile);
