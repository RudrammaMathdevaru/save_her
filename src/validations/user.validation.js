/**
 * File: src/validations/user.validation.js
 * Updated: 2026-03-22
 *
 * Purpose:
 * - Validation rules for user profile endpoints
 * - Location, bio, emergency contact validation
 *
 * Changes:
 * - Created new validation file for profile module
 *
 * Connected Modules:
 * - Used by user.routes.js
 *
 * Dependencies:
 * - express-validator: Input validation and sanitization
 */

import { body } from 'express-validator';

export const updateProfileValidation = [
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location must be under 100 characters'),

  body('bio')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Bio must be under 200 characters'),
];

export const updateEmergencyContactValidation = [
  body('emergencyContact')
    .notEmpty()
    .withMessage('Emergency contact is required')
    .matches(/^\d{10}$/)
    .withMessage('Emergency contact must be exactly 10 digits'),
];