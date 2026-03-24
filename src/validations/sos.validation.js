/**
 * File: src/validations/sos.validation.js
 * Updated: 2026-03-24
 *
 * Purpose:
 * - Validation rules for SOS endpoints
 *
 * Changes:
 * - Added deleteSOSValidation for single delete route
 *
 * Connected Modules:
 * - Used by sos.routes.js
 *
 * Dependencies:
 * - express-validator
 */

import { body, param } from 'express-validator';

export const triggerSOSValidation = [
  body('latitude')
    .notEmpty()
    .withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Invalid latitude'),

  body('longitude')
    .notEmpty()
    .withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid longitude'),

  body('recipients')
    .notEmpty()
    .withMessage('At least one recipient is required')
    .custom((value) => {
      let parsed;
      try {
        parsed = typeof value === 'string' ? JSON.parse(value) : value;
      } catch {
        throw new Error('Recipients must be valid JSON');
      }

      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('At least one recipient is required');
      }

      for (const recipient of parsed) {
        if (!recipient.name || !recipient.name.trim()) {
          throw new Error('Each recipient must have a name');
        }
        if (!recipient.phone && !recipient.email) {
          throw new Error('Each recipient must have at least a phone or email');
        }
      }

      return true;
    }),
];

export const deleteSOSValidation = [
  param('id').isInt({ gt: 0 }).withMessage('Invalid SOS record ID'),
];
