/**
 * File: src/services/user.service.js
 * Updated: 2026-03-22
 *
 * Purpose:
 * - All API calls for user profile management
 *
 * Changes:
 * - FIXED: All calls now use response.data correctly
 *   (axiosConfig no longer auto-unwraps response)
 * - FIXED: getUserProfile now calls /user/profile not /auth/me
 * - Emergency contact uses correct endpoint /user/emergency-contact
 *
 * Connected Modules:
 * - Used by ProfileMain.jsx and profile components
 * - Depends on axiosConfig.js
 *
 * Dependencies:
 * - axiosInstance: Configured axios
 */

import axiosInstance from './axiosConfig.js';

/**
 * Get full user profile
 * @returns {Promise} User data
 */
export const getUserProfile = async () => {
  const response = await axiosInstance.get('/user/profile');
  return response.data.data.user;
};

/**
 * Get user stats (reports count, SOS count)
 * @returns {Promise} { reportsCount, sosCount }
 */
export const getUserStats = async () => {
  const response = await axiosInstance.get('/user/stats');
  return response.data.data.stats;
};

/**
 * Update location and bio
 * @param {Object} data - { location, bio }
 * @returns {Promise} Updated user
 */
export const updateUserProfile = async (data) => {
  const response = await axiosInstance.put('/user/profile', data);
  return response.data.data.user;
};

/**
 * Upload profile avatar image
 * @param {File} file - Image file from input
 * @returns {Promise} Updated user with new profileImage URL
 */
export const updateAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await axiosInstance.post('/user/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data.user;
};

/**
 * Update emergency contact number
 * @param {string} emergencyContact - Exactly 10 digits
 * @returns {Promise} Updated user
 */
export const updateEmergencyContact = async (emergencyContact) => {
  const response = await axiosInstance.put('/user/emergency-contact', {
    emergencyContact,
  });
  return response.data.data.user;
};
