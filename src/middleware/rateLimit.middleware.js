/**
 * File: src/middleware/rateLimit.middleware.js
 * Updated: 2026-03-18
 *
 * Purpose:
 * - Rate limiting middleware to prevent brute force attacks
 * - Stricter limits for auth routes
 *
 * Connected Modules:
 * - Used in app.js and auth.routes.js
 *
 * Dependencies:
 * - express-rate-limit: Rate limiting library
 * - env: Rate limit configuration
 */

import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

/**
 * General API rate limiter
 * Limits all requests from an IP
 */
export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT.WINDOW_MS,
  max: env.RATE_LIMIT.MAX_REQUESTS,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  skipSuccessfulRequests: false // Count all requests
});

/**
 * Strict rate limiter for auth routes (login/register)
 * Prevents brute force attacks
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.RATE_LIMIT.AUTH_MAX_ATTEMPTS,
  skipSuccessfulRequests: true, // Don't count successful requests
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});