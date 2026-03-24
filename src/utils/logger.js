/**
 * File: src/utils/logger.js
 * Updated: 2026-03-18
 *
 * Purpose:
 * - Structured logging using Winston
 * - Different log levels for development/production
 * - File logging in production
 *
 * Connected Modules:
 * - Used throughout the application for consistent logging
 *
 * Dependencies:
 * - winston: Structured logging library
 * - env: Environment configuration
 */

import winston from 'winston';
import { env } from '../config/env.js';

const { combine, timestamp, printf, colorize, json } = winston.format;

// Custom format for development
const devFormat = printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} [${level}]: ${message} ${
    Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
  }`;
});

// Configure logger based on environment
const logger = winston.createLogger({
  level: env.isDevelopment ? 'debug' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    env.isDevelopment ? colorize() : json(),
    env.isDevelopment ? devFormat : json()
  ),
  transports: [
    // Console transport for all environments
    new winston.transports.Console()
  ]
});

// Add file transport in production
if (env.isProduction) {
  logger.add(new winston.transports.File({ 
    filename: 'logs/error.log', 
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 5
  }));
  
  logger.add(new winston.transports.File({ 
    filename: 'logs/combined.log',
    maxsize: 5242880, // 5MB
    maxFiles: 5
  }));
}

export default logger;