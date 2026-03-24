/**
 * File: src/utils/appError.js
 * Updated: 2026-03-18
 *
 * Purpose:
 * - Custom error class for application errors
 * - Extends native Error with statusCode property
 * - Used throughout service layer for consistent error handling
 *
 * Connected Modules:
 * - Used by services to throw errors
 * - Caught by error middleware
 *
 * Dependencies:
 * - None
 */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Marks as operational (expected) error

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;