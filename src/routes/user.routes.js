/**
 * File: src/routes/user.routes.js
 * Updated: 2026-03-22
 *
 * Purpose:
 * - Define all user profile routes
 * - Wire auth middleware, multer, and validation
 *
 * Changes:
 * - Created for profile module
 *
 * Connected Modules:
 * - Mounted in app.js at /api/user
 * - Uses auth.middleware.js for JWT protection
 * - Uses user.controller.js for handlers
 * - Uses user.validation.js for input rules
 *
 * Dependencies:
 * - express: Router
 * - multer: File upload handling
 * - path/fs: Directory creation for uploads
 */

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { verifyToken } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  updateProfileValidation,
  updateEmergencyContactValidation,
} from '../validations/user.validation.js';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

// Ensure uploads directory exists at startup
const uploadDir = path.resolve('uploads/avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config — saves to uploads/avatars/
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    // Pattern: avatar-<userId>-<timestamp>.<ext>
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `avatar-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

// File filter — images only
const fileFilter = (_req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WEBP images are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

// All routes below require a valid JWT
router.use(verifyToken);

// GET /api/user/profile
router.get('/profile', userController.getProfile);

// PUT /api/user/profile
router.put(
  '/profile',
  updateProfileValidation,
  validate,
  userController.updateProfile
);

// POST /api/user/avatar
router.post('/avatar', upload.single('avatar'), userController.updateAvatar);

// PUT /api/user/emergency-contact
router.put(
  '/emergency-contact',
  updateEmergencyContactValidation,
  validate,
  userController.updateEmergencyContact
);

// GET /api/user/stats
router.get('/stats', userController.getUserStats);

export default router;