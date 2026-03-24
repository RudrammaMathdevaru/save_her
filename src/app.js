/**
 * File: src/app.js
 * Updated: 2026-03-23
 *
 * Purpose:
 * - Express application setup
 * - Global middleware, all route mounting, error handling
 * - Static file serving for avatars and SOS audio
 *
 * Changes:
 * - ADDED: MIME type configuration for .webm files to serve as audio/webm
 *   Previously Express served .webm as video/webm, causing browser audio
 *   elements to reject playback with "Invalid content type" error
 * - FIXED: Audio playback now works correctly with .webm files
 *
 * Connected Modules:
 * - auth.routes.js, user.routes.js,
 *   emergencyContact.routes.js, sos.routes.js
 *
 * Dependencies:
 * - express, helmet, cors, morgan, path
 */

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rateLimit.middleware.js';
import { initializeEmergencyContactTable } from './models/emergencyContact.model.js';
import { initializeSOSTable } from './models/sos.model.js';
import { initializeUserTable } from './models/user.model.js';
import authRoutes from './routes/auth.routes.js';
import emergencyContactRoutes from './routes/emergencyContact.routes.js';
import sosRoutes from './routes/sos.routes.js';
import userRoutes from './routes/user.routes.js';
import logger from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.isDevelopment ? '*' : process.env.FRONTEND_URL,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(
  morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) },
    skip: (req, res) => env.isProduction && res.statusCode < 400,
  })
);

app.use('/api', apiLimiter);

// Serve uploaded files — avatars and SOS audio
// Configure MIME types for audio files
const staticOptions = {
  setHeaders: (res, filePath) => {
    // Set correct MIME type for .webm audio files
    if (filePath.endsWith('.webm')) {
      res.setHeader('Content-Type', 'audio/webm');
    }
    // Set correct MIME type for other audio formats if needed
    if (filePath.endsWith('.mp3')) {
      res.setHeader('Content-Type', 'audio/mpeg');
    }
    if (filePath.endsWith('.wav')) {
      res.setHeader('Content-Type', 'audio/wav');
    }
    if (filePath.endsWith('.ogg')) {
      res.setHeader('Content-Type', 'audio/ogg');
    }
    // Allow CORS for audio files
    res.setHeader('Access-Control-Allow-Origin', '*');
  },
};

app.use(
  '/uploads',
  express.static(path.resolve(__dirname, '..', 'uploads'), staticOptions)
);

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// All API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/emergency-contacts', emergencyContactRoutes);
app.use('/api/sos', sosRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use(errorHandler);

// Initialize all tables on startup
const initializeTables = async () => {
  await initializeUserTable();
  await initializeEmergencyContactTable();
  await initializeSOSTable();
};

initializeTables().catch((err) => {
  logger.error('Failed to initialize database tables:', err);
  process.exit(1);
});

export default app;
