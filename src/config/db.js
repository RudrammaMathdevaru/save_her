/**
 * File: src/config/db.js
 * Updated: 2026-03-18
 *
 * Purpose:
 * - Create and export MySQL connection pool
 * - Use mysql2/promise for async/await support
 * - Test connection on startup
 *
 * Connected Modules:
 * - Used by all model files for database queries
 *
 * Dependencies:
 * - mysql2: MySQL driver with promise support
 * - env: Validated environment variables
 */

import mysql from 'mysql2/promise';
import { env } from './env.js';
import logger from '../utils/logger.js';

// Create connection pool
const pool = mysql.createPool({
  host: env.DB.HOST,
  port: env.DB.PORT,
  user: env.DB.USER,
  password: env.DB.PASSWORD,
  database: env.DB.NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    logger.info('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    logger.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Run connection test (non-blocking)
testConnection();

export default pool;