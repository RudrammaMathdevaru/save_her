/**
 * File: src/routes/emergencyContact.routes.js
 * Updated: 2026-03-23
 *
 * Purpose:
 * - Define all emergency contact routes
 * - Wire JWT auth, validation, and controller handlers
 *
 * Changes:
 * - Created for emergency contacts module
 *
 * Connected Modules:
 * - Mounted in app.js at /api/emergency-contacts
 * - Uses auth.middleware.js for JWT protection
 * - Uses emergencyContact.controller.js for handlers
 * - Uses emergencyContact.validation.js for input rules
 *
 * Dependencies:
 * - express: Router
 */

import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createContactValidation,
  deleteContactValidation,
  updateContactValidation,
} from '../validations/emergencyContact.validation.js';
import * as contactController from '../controllers/emergencyContact.controller.js';

const router = express.Router();

// All routes require valid JWT
router.use(verifyToken);

// GET /api/emergency-contacts
router.get('/', contactController.getAllContacts);

// POST /api/emergency-contacts
router.post(
  '/',
  createContactValidation,
  validate,
  contactController.createContact
);

// PUT /api/emergency-contacts/:id
router.put(
  '/:id',
  updateContactValidation,
  validate,
  contactController.updateContact
);

// DELETE /api/emergency-contacts/:id
router.delete(
  '/:id',
  deleteContactValidation,
  validate,
  contactController.deleteContact
);

export default router;