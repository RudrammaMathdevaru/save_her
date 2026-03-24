/**
 * File: src/config/env.js
 * Updated: 2026-03-23
 *
 * Purpose:
 * - Validate all required environment variables at startup
 * - Crash immediately with a clear message if any are missing
 * - Export typed access to all environment variables
 *
 * Changes:
 * - Merged old and new env.js — old file had RATE_LIMIT section
 *   which new file was missing, causing rateLimit.middleware.js
 *   to crash with "Cannot read properties of undefined (WINDOW_MS)"
 * - New file had Twilio, SendGrid, APP_URL which old file lacked
 * - Both sections now present in one complete file
 *
 * Connected Modules:
 * - Used by app.js, all services, all middleware files
 *
 * Dependencies:
 * - dotenv: Loads .env file into process.env
 */

import dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../.env') });

// All required environment variables
const required = [
  'PORT',
  'NODE_ENV',
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER',
  'SENDGRID_API_KEY',
  'SENDGRID_FROM_EMAIL',
  'APP_URL',
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error('Missing required environment variables:');
  missing.forEach((key) => console.error(`  - ${key}`));
  console.error('\nPlease check your .env file against .env.example');
  process.exit(1);
}

export const env = {
  NODE_ENV: process.env.NODE_ENV,
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  PORT: parseInt(process.env.PORT, 10),

  DB: {
    HOST: process.env.DB_HOST,
    PORT: parseInt(process.env.DB_PORT, 10),
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    NAME: process.env.DB_NAME,
  },

  JWT: {
    SECRET: process.env.JWT_SECRET,
    EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  },

  // RATE_LIMIT section — required by rateLimit.middleware.js
  RATE_LIMIT: {
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
    AUTH_MAX_ATTEMPTS:
      parseInt(process.env.AUTH_RATE_LIMIT_MAX_ATTEMPTS, 10) || 5,
  },

  TWILIO: {
    ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
  },

  SENDGRID: {
    API_KEY: process.env.SENDGRID_API_KEY,
    FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL,
  },

  APP_URL: process.env.APP_URL,
};

console.log('Environment variables validated successfully');
