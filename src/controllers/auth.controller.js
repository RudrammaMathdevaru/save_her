/**
 * File: src/controllers/auth.controller.js
 * Updated: 2026-03-18
 *
 * Purpose:
 * - Handle HTTP requests for authentication
 * - Extract data from request, call service, send response
 * - NO business logic - only request/response handling
 *
 * Connected Modules:
 * - Used by auth.routes.js
 * - Depends on auth.service.js for business logic
 * - Depends on response.js for formatting
 *
 * Dependencies:
 * - auth.service: Business logic
 * - response: Standard response formatter
 */

import * as authService from '../services/auth.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import logger from '../utils/logger.js';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body;

    // Call service layer
    const { user, token } = await authService.registerUser({
      fullName,
      email,
      phoneNumber,
      password
    });

    // Send success response
    sendSuccess(res, 201, 'Registration successful', {
      user,
      token
    });
  } catch (error) {
    // Pass to error middleware
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Call service layer
    const { user, token } = await authService.loginUser(email, password);

    // Send success response
    sendSuccess(res, 200, 'Login successful', {
      user,
      token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getProfile = async (req, res, next) => {
  try {
    // User ID comes from auth middleware
    const userId = req.user.id;

    // Call service layer
    const user = await authService.getUserProfile(userId);

    // Send success response
    sendSuccess(res, 200, 'Profile retrieved successfully', { user });
  } catch (error) {
    next(error);
  }
};