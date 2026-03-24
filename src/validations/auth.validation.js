/**
 * File: src/validations/auth.validation.js
 * Updated: 2026-03-18
 *
 * Purpose:
 * - Input validation schemas for auth routes
 * - Matches frontend validation for consistency
 * - Used by validate.middleware.js
 *
 * Connected Modules:
 * - Used in auth.routes.js with validate middleware
 *
 * Dependencies:
 * - express-validator: Validation library
 */

import { body } from 'express-validator';

// Phone number validation regex (exactly 10 digits)
const PHONE_REGEX = /^\d{10}$/;

// Password strength regex (matches frontend)
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,128}$/;

// Name validation (letters, spaces, hyphens, apostrophes)
const NAME_REGEX = /^[a-zA-Z\s'-]+$/;

export const registerValidation = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .matches(NAME_REGEX).withMessage('Name can only contain letters, spaces, hyphens and apostrophes')
    .escape(), // Basic XSS prevention

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Enter a valid email address')
    .normalizeEmail() // Converts to lowercase, removes dots from gmail etc.
    .isLength({ max: 254 }).withMessage('Email is too long')
    .escape(),

  body('phoneNumber')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(PHONE_REGEX).withMessage('Phone number must be exactly 10 digits')
    .escape(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8, max: 128 }).withMessage('Password must be between 8 and 128 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character')
    .escape()
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Enter a valid email address')
    .normalizeEmail()
    .escape(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .escape()
];