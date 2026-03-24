/**
 * File: src/routes/sos.routes.js
 * Updated: 2026-03-24
 *
 * Purpose:
 * - Define all SOS routes with JWT auth, multer, validation
 *
 * Changes:
 * - Added DELETE /api/sos/all for bulk deletion
 * - Added DELETE /api/sos/:id for single record deletion
 * - IMPORTANT: /all route must be registered BEFORE /:id
 *   otherwise Express matches "all" as an :id param value
 *
 * Connected Modules:
 * - Mounted in app.js at /api/sos
 *
 * Dependencies:
 * - express: Router
 * - multer: Audio file upload handling
 */

import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import * as sosController from '../controllers/sos.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  deleteSOSValidation,
  triggerSOSValidation,
} from '../validations/sos.validation.js';

const router = express.Router();

const sosAudioDir = path.resolve('uploads/sos-audio');
if (!fs.existsSync(sosAudioDir)) {
  fs.mkdirSync(sosAudioDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, sosAudioDir),
  filename: (_req, _file, cb) => cb(null, `sos-audio-${Date.now()}.webm`),
});

const fileFilter = (_req, file, cb) => {
  const allowed = ['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/wav'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only audio files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
});

router.use(verifyToken);

// POST /api/sos/trigger
router.post(
  '/trigger',
  upload.single('audio'),
  triggerSOSValidation,
  validate,
  sosController.triggerSOS
);

// GET /api/sos/history
router.get('/history', sosController.getSOSHistory);

// DELETE /api/sos/all — MUST be before /:id
router.delete('/all', sosController.deleteAllSOSAlerts);

// DELETE /api/sos/:id
router.delete(
  '/:id',
  deleteSOSValidation,
  validate,
  sosController.deleteSOSAlert
);

export default router;
