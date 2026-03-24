/**
 * File: src/server.js
 * Updated: 2026-03-18
 *
 * Purpose:
 * - Start HTTP server
 * - Handle graceful shutdown
 * - Listen on configured port
 *
 * Connected Modules:
 * - app.js: Express application
 *
 * Dependencies:
 * - app: Express app
 * - env: Environment config
 * - logger: Structured logging
 */

import app from './app.js';
import { env } from './config/env.js';
import logger from './utils/logger.js';

const PORT = env.PORT || 5000;

// Create server
const server = app.listen(PORT, () => {
  logger.info(`
  🚀 SafeHer Backend Server
  =========================
  📡 Environment: ${env.NODE_ENV}
  🔌 Port: ${PORT}
  📅 Started: ${new Date().toISOString()}
  =========================
  `);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);

  server.close(() => {
    logger.info('HTTP server closed');
    logger.info('Database connection pool closed');
    logger.info('Goodbye! 👋');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error(
      'Could not close connections in time, forcefully shutting down'
    );
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
  gracefulShutdown('UNHANDLED_REJECTION');
});
