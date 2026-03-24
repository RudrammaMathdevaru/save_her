/**
 * File: src/utils/constants.js
 * Updated: 2026-03-18
 *
 * Purpose:
 * - Centralized constants for the application
 * - API endpoints and configuration values
 *
 * Changes:
 * - Added API_BASE_URL for backend connection
 * - Added AUTH_ENDPOINTS for all auth routes
 * - Added toast duration constants
 *
 * Connected Modules:
 * - Used by all service and component files
 *
 * Dependencies:
 * - None
 */

// Backend API configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  ME: '/auth/me',
};

// Toast notification durations (in milliseconds)
export const TOAST_DURATION = {
  SUCCESS: 2000,
  ERROR: 3000, // Slightly longer for errors
  WARNING: 2500,
  INFO: 2000,
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'safeher_token',
  USER: 'safeher_user',
  REMEMBER_ME: 'rememberMe',
  SAVED_EMAIL: 'savedEmail',
};

// HTTP Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
};
