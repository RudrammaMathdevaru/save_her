/**
 * File: src/services/user.service.js
 * Updated: 2026-03-22
 *
 * Purpose:
 * - All business logic for user profile operations
 * - Validates ownership, handles file path cleanup,
 *   formats data before sending to model layer
 *
 * Changes:
 * - Created new service for profile module
 *
 * Connected Modules:
 * - Called by user.controller.js
 * - Calls user.model.js for DB queries
 * - Uses appError.js for error throwing
 *
 * Dependencies:
 * - fs/promises: Delete old avatar files from disk
 * - path: Resolve file paths safely
 * - appError: Centralized error class
 */

import fs from 'fs/promises';
import path from 'path';
import * as userModel from '../models/user.model.js';
import AppError from '../utils/appError.js';

/**
 * Get full profile for authenticated user
 * @param {number} userId
 * @returns {Object} User profile data
 */
export const getProfile = async (userId) => {
  const user = await userModel.findUserById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return formatUser(user);
};

/**
 * Update location and bio
 * @param {number} userId
 * @param {Object} data - { location, bio }
 * @returns {Object} Updated user
 */
export const updateProfile = async (userId, data) => {
  const user = await userModel.findUserById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const updated = await userModel.updateProfile(userId, {
    location: data.location ?? user.location,
    bio: data.bio ?? user.bio,
  });

  return formatUser(updated);
};

/**
 * Update profile avatar image
 * Deletes old image from disk before saving new path
 * @param {number} userId
 * @param {string} newImagePath - Path from multer
 * @returns {Object} Updated user with new image URL
 */
export const updateAvatar = async (userId, newImagePath) => {
  const user = await userModel.findUserById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Delete old image file from disk if it exists
  if (user.profile_image) {
    const oldFilePath = path.resolve(user.profile_image);
    try {
      await fs.unlink(oldFilePath);
    } catch {
      // File may already be deleted — not a fatal error
    }
  }

  const updated = await userModel.updateAvatar(userId, newImagePath);
  return formatUser(updated);
};

/**
 * Update emergency contact number
 * @param {number} userId
 * @param {string} emergencyContact - Exactly 10 digits
 * @returns {Object} Updated user
 */
export const updateEmergencyContact = async (userId, emergencyContact) => {
  const user = await userModel.findUserById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const updated = await userModel.updateEmergencyContact(
    userId,
    emergencyContact
  );

  return formatUser(updated);
};

/**
 * Get user stats (reports count, SOS count)
 * @param {number} userId
 * @returns {Object} { reportsCount, sosCount }
 */
export const getUserStats = async (userId) => {
  const stats = await userModel.getUserStats(userId);

  if (!stats) {
    throw new AppError('User not found', 404);
  }

  return stats;
};

/**
 * Format user object for API response
 * Converts DB snake_case to camelCase
 * Builds full image URL from stored path
 * Never exposes password
 * @param {Object} user - Raw DB row
 * @returns {Object} Clean formatted user
 */
const formatUser = (user) => {
  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    phoneNumber: user.phone_number,
    location: user.location || '',
    bio: user.bio || '',
    emergencyContact: user.emergency_contact || '',
    profileImage: user.profile_image
      ? `${process.env.APP_URL}/uploads/avatars/${path.basename(user.profile_image)}`
      : null,
    memberSince: user.created_at,
  };
};