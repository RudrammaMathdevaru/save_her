/**
 * File: src/controllers/user.controller.js
 * Updated: 2026-03-22
 *
 * Purpose:
 * - Handle HTTP request/response for user profile routes
 * - Extract data from request, call service, send response
 * - Zero business logic here
 *
 * Changes:
 * - Created for profile module
 *
 * Connected Modules:
 * - Called by user.routes.js
 * - Calls user.service.js (backend)
 * - Uses response.js for formatting
 *
 * Dependencies:
 * - user.service: Business logic layer
 * - response: Standard response formatter
 */

import * as userService from '../services/user.service.js';
import { sendSuccess } from '../utils/response.js';

/**
 * GET /api/user/profile
 * Get full profile for logged-in user
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id);
    sendSuccess(res, 200, 'Profile retrieved successfully', { user });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/user/profile
 * Update location and bio
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { location, bio } = req.body;
    const user = await userService.updateProfile(req.user.id, {
      location,
      bio,
    });
    sendSuccess(res, 200, 'Profile updated successfully', { user });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/user/avatar
 * Upload profile photo — file handled by multer middleware
 */
export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(
        new (await import('../utils/appError.js')).default(
          'No image file provided',
          400
        )
      );
    }

    const user = await userService.updateAvatar(req.user.id, req.file.path);
    sendSuccess(res, 200, 'Profile photo updated successfully', { user });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/user/emergency-contact
 * Update emergency contact number
 */
export const updateEmergencyContact = async (req, res, next) => {
  try {
    const { emergencyContact } = req.body;
    const user = await userService.updateEmergencyContact(
      req.user.id,
      emergencyContact
    );
    sendSuccess(res, 200, 'Emergency contact updated successfully', { user });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/user/stats
 * Get reports count and SOS count for profile card
 */
export const getUserStats = async (req, res, next) => {
  try {
    const stats = await userService.getUserStats(req.user.id);
    sendSuccess(res, 200, 'Stats retrieved successfully', { stats });
  } catch (error) {
    next(error);
  }
};