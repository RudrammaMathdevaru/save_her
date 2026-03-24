/**
 * File: src/validations/emergencyContact.validation.js
 * Updated: 2026-03-23
 *
 * Purpose:
 * - Validation rules for emergency contact endpoints
 * - Enforces name, relationship, phone format on every write
 *
 * Changes:
 * - Created for emergency contacts module
 *
 * Connected Modules:
 * - Used by emergency_contacts.routes.js
 *
 * Dependencies:
 * - express-validator: Input validation and sanitization
 */

import { body, param } from 'express-validator';

export const createContactValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must be under 100 characters'),

  body('relationship')
    .trim()
    .notEmpty()
    .withMessage('Relationship is required')
    .isLength({ max: 100 })
    .withMessage('Relationship must be under 100 characters'),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+?[\d\s\-\(\)]{7,15}$/)
    .withMessage('Please enter a valid phone number'),
];

export const updateContactValidation = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('Invalid contact ID'),

  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must be under 100 characters'),

  body('relationship')
    .trim()
    .notEmpty()
    .withMessage('Relationship is required')
    .isLength({ max: 100 })
    .withMessage('Relationship must be under 100 characters'),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+?[\d\s\-\(\)]{7,15}$/)
    .withMessage('Please enter a valid phone number'),
];

export const deleteContactValidation = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('Invalid contact ID'),
];