/**
 * File: src/models/user.model.js
 * Updated: 2026-03-22
 *
 * Purpose:
 * - All MySQL queries for the users table
 * - Parameterized queries only — zero string concatenation
 * - Zero business logic — only raw data access
 *
 * Changes:
 * - Added updateProfile query for location and bio
 * - Added updateAvatar query for profile image path
 * - Added updateEmergencyContact query
 * - Added getUserStats query returning placeholder counts
 *   until reports and SOS modules are built
 *
 * Connected Modules:
 * - Used by auth.service.js and user.service.js (backend)
 * - Depends on config/db.js
 *
 * Dependencies:
 * - mysql2/promise: Via db pool
 */

import pool from '../config/db.js';

/**
 * Create users table if not exists
 */
export const initializeUserTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone_number VARCHAR(10) NOT NULL,
      password VARCHAR(255) NOT NULL,
      location VARCHAR(100) DEFAULT NULL,
      bio VARCHAR(200) DEFAULT NULL,
      emergency_contact VARCHAR(10) DEFAULT NULL,
      profile_image VARCHAR(255) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_phone (phone_number)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  try {
    await pool.execute(createTableQuery);
    console.log('Users table initialized');
  } catch (error) {
    console.error('Failed to initialize users table:', error.message);
    throw error;
  }
};

/**
 * Create a new user
 * @param {Object} userData - { full_name, email, phone_number, password }
 * @returns {Object} Created user (without password)
 */
export const createUser = async (userData) => {
  const { full_name, email, phone_number, password } = userData;

  const query = `
    INSERT INTO users (full_name, email, phone_number, password)
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await pool.execute(query, [
    full_name,
    email,
    phone_number,
    password,
  ]);

  return {
    id: result.insertId,
    full_name,
    email,
    phone_number,
  };
};

/**
 * Find user by email
 * @param {string} email
 * @returns {Object|null}
 */
export const findUserByEmail = async (email) => {
  const query = `
    SELECT id, full_name, email, phone_number, password, created_at
    FROM users
    WHERE email = ?
  `;

  const [rows] = await pool.execute(query, [email]);
  return rows[0] || null;
};

/**
 * Find user by ID — includes all profile fields
 * @param {number} id
 * @returns {Object|null}
 */
export const findUserById = async (id) => {
  const query = `
    SELECT
      id,
      full_name,
      email,
      phone_number,
      location,
      bio,
      emergency_contact,
      profile_image,
      created_at
    FROM users
    WHERE id = ?
  `;

  const [rows] = await pool.execute(query, [id]);
  return rows[0] || null;
};

/**
 * Check if email already exists
 * @param {string} email
 * @returns {boolean}
 */
export const emailExists = async (email) => {
  const query = 'SELECT 1 FROM users WHERE email = ? LIMIT 1';
  const [rows] = await pool.execute(query, [email]);
  return rows.length > 0;
};

/**
 * Check if phone number already exists
 * @param {string} phoneNumber
 * @returns {boolean}
 */
export const phoneExists = async (phoneNumber) => {
  const query = 'SELECT 1 FROM users WHERE phone_number = ? LIMIT 1';
  const [rows] = await pool.execute(query, [phoneNumber]);
  return rows.length > 0;
};

/**
 * Update user profile fields: location and bio
 * @param {number} userId
 * @param {Object} data - { location, bio }
 * @returns {Object} Updated user
 */
export const updateProfile = async (userId, data) => {
  const { location, bio } = data;

  const query = `
    UPDATE users
    SET location = ?, bio = ?
    WHERE id = ?
  `;

  await pool.execute(query, [location ?? null, bio ?? null, userId]);

  return findUserById(userId);
};

/**
 * Update profile image path
 * @param {number} userId
 * @param {string} imagePath - Relative path to stored image file
 * @returns {Object} Updated user
 */
export const updateAvatar = async (userId, imagePath) => {
  const query = `
    UPDATE users
    SET profile_image = ?
    WHERE id = ?
  `;

  await pool.execute(query, [imagePath, userId]);

  return findUserById(userId);
};

/**
 * Update emergency contact number
 * @param {number} userId
 * @param {string} emergencyContact - Exactly 10 digits
 * @returns {Object} Updated user
 */
export const updateEmergencyContact = async (userId, emergencyContact) => {
  const query = `
    UPDATE users
    SET emergency_contact = ?
    WHERE id = ?
  `;

  await pool.execute(query, [emergencyContact, userId]);

  return findUserById(userId);
};

/**
 * Get user statistics
 * Reports and SOS modules are not built yet.
 * Returns 0 as placeholder — will be replaced with real
 * JOIN queries once those tables exist.
 * @param {number} userId
 * @returns {Object} { reportsCount, sosCount }
 */
export const getUserStats = async (userId) => {
  // Verify the user exists
  const query = `
    SELECT id FROM users WHERE id = ? LIMIT 1
  `;

  const [rows] = await pool.execute(query, [userId]);

  if (!rows[0]) return null;

  return {
    reportsCount: 0,
    sosCount: 0,
  };
};
