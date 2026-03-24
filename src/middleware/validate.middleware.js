/**
 * File: src/middleware/validate.middleware.js
 * Updated: 2026-03-23
 *
 * Purpose:
 * - Request validation middleware using express-validator
 * - Supports BOTH usage patterns without changing any route file:
 *
 *   Pattern A — Factory (used in auth.routes.js):
 *     router.post('/', validate(rulesArray), controller)
 *     validate receives an array, returns a middleware function.
 *
 *   Pattern B — Inline (used in emergency/user routes):
 *     router.post('/', rulesArray, validate, controller)
 *     validate receives (req, res, next) directly,
 *     reads validationResult already stored on req.
 *
 * Changes:
 * - FIXED: Previous version was factory-only — broke auth.routes.js
 *   when called as validate(array) because it expected (req,res,next).
 * - Previous fix broke the opposite — plain middleware broke
 *   auth.routes.js which used the factory pattern.
 * - Now detects which pattern is being used by checking if the
 *   first argument is an array or a Request object, and handles
 *   both correctly. Zero route file changes required.
 *
 * Connected Modules:
 * - Used by auth.routes.js (Pattern A)
 * - Used by user.routes.js (Pattern B)
 * - Used by emergencyContact.routes.js (Pattern B)
 *
 * Dependencies:
 * - express-validator: validationResult to read accumulated errors
 */

import { validationResult } from 'express-validator';
import { sendError } from '../utils/response.js';

/**
 * Format validation errors into consistent shape
 * @param {Result} errors - express-validator result object
 * @returns {Array} Formatted error array
 */
const formatErrors = (errors) =>
  errors.array().map((error) => ({
    field: error.path,
    message: error.msg,
  }));

/**
 * validate — dual-mode validation middleware
 *
 * When called with an ARRAY (factory pattern):
 *   validate([rule1, rule2]) → returns Express middleware
 *   Used as: router.post('/', validate(rules), controller)
 *
 * When called with REQ object (inline pattern):
 *   validate(req, res, next) → reads results directly
 *   Used as: router.post('/', rules, validate, controller)
 */
export const validate = (validationsOrReq, res, next) => {
  // Pattern A — factory: first argument is an array of validation rules
  if (Array.isArray(validationsOrReq)) {
    return async (req, res, next) => {
      // Run every validation rule against the request
      await Promise.all(
        validationsOrReq.map((validation) => validation.run(req))
      );

      const errors = validationResult(req);

      if (errors.isEmpty()) {
        return next();
      }

      return sendError(res, 400, 'Validation failed', formatErrors(errors));
    };
  }

  // Pattern B — inline: first argument is the req object itself
  // Validation rules already ran before this middleware in the chain
  const req = validationsOrReq;
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return sendError(res, 400, 'Validation failed', formatErrors(errors));
};
