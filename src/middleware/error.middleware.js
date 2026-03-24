/**
 * File: src/middleware/error.middleware.js
 * Updated: 2026-03-18
 *
 * Purpose:
 * - Centralized error handling middleware
 * - Different responses for development/production
 * - Never expose stack traces to client in production
 *
 * Connected Modules:
 * - Used in app.js after all routes
 *
 * Dependencies:
 * - logger: Structured logging
 * - env: Environment config
 */

import { env } from '../config/env.js';
import logger from '../utils/logger.js';
import { sendError } from '../utils/response.js';

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id
  });

  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  }

  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'Duplicate entry';
  }

  // In production, don't expose internal error details
  if (env.isProduction && statusCode === 500) {
    message = 'Internal server error';
  }

  // Send error response
  sendError(res, statusCode, message, err.errors || null);
};