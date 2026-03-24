/**
 * File: src/routes/auth.routes.js
 * Updated: 2026-03-18
 *
 * Purpose:
 * - Authentication route definitions
 * - Connect HTTP methods to controller functions
 * - Apply middleware (validation, rate limiting, auth)
 *
 * Connected Modules:
 * - Used in app.js
 * - Depends on auth.controller.js
 * - Depends on validation middleware
 *
 * Dependencies:
 * - express: Router
 */

import { Router } from 'express';
import { register, login, getProfile } from '../controllers/auth.controller.js';
import { registerValidation, loginValidation } from '../validations/auth.validation.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post(
  '/register',
  authLimiter, // Apply strict rate limiting
  validate(registerValidation),
  register
);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post(
  '/login',
  authLimiter, // Apply strict rate limiting
  validate(loginValidation),
  login
);

/**
 * @route GET /api/auth/me
 * @desc Get current user profile
 * @access Private
 */
router.get(
  '/me',
  authenticate, // Requires valid JWT
  getProfile
);

export default router;