/**
 * File: src/models/emergencyContact.model.js
 * Updated: 2026-03-23
 *
 * Purpose:
 * - All MySQL queries for emergency_contacts table
 * - Parameterized queries only — zero string concatenation
 * - Zero business logic — only raw data access
 *
 * Changes:
 * - Created for emergency contacts module
 *
 * Connected Modules:
 * - Used by emergencyContact.service.js
 * - Depends on config/db.js
 *
 * Dependencies:
 * - mysql2/promise: Via db pool
 */

import pool from '../config/db.js';

/**
 * Initialize emergency_contacts table if not exists
 */
export const initializeEmergencyContactTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS emergency_contacts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      relationship VARCHAR(100) NOT NULL,
      phone VARCHAR(15) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user_id (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  try {
    await pool.execute(query);
    console.log('Emergency contacts table initialized');
  } catch (error) {
    console.error('Failed to initialize emergency contacts table:', error.message);
    throw error;
  }
};

/**
 * Get all contacts for a user
 * @param {number} userId
 * @returns {Array} List of contacts
 */
export const findAllByUserId = async (userId) => {
  const query = `
    SELECT id, user_id, name, relationship, phone, created_at
    FROM emergency_contacts
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  const [rows] = await pool.execute(query, [userId]);
  return rows;
};

/**
 * Find a single contact by ID and user_id
 * user_id check prevents one user accessing another user's contact
 * @param {number} id
 * @param {number} userId
 * @returns {Object|null}
 */
export const findByIdAndUserId = async (id, userId) => {
  const query = `
    SELECT id, user_id, name, relationship, phone, created_at
    FROM emergency_contacts
    WHERE id = ? AND user_id = ?
    LIMIT 1
  `;

  const [rows] = await pool.execute(query, [id, userId]);
  return rows[0] || null;
};

/**
 * Create a new emergency contact
 * @param {number} userId
 * @param {Object} data - { name, relationship, phone }
 * @returns {Object} Created contact
 */
export const createContact = async (userId, data) => {
  const { name, relationship, phone } = data;

  const query = `
    INSERT INTO emergency_contacts (user_id, name, relationship, phone)
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await pool.execute(query, [userId, name, relationship, phone]);

  return findByIdAndUserId(result.insertId, userId);
};

/**
 * Update an existing contact
 * @param {number} id
 * @param {number} userId
 * @param {Object} data - { name, relationship, phone }
 * @returns {Object} Updated contact
 */
export const updateContact = async (id, userId, data) => {
  const { name, relationship, phone } = data;

  const query = `
    UPDATE emergency_contacts
    SET name = ?, relationship = ?, phone = ?
    WHERE id = ? AND user_id = ?
  `;

  await pool.execute(query, [name, relationship, phone, id, userId]);

  return findByIdAndUserId(id, userId);
};

/**
 * Delete a contact
 * @param {number} id
 * @param {number} userId
 * @returns {boolean} True if deleted
 */
export const deleteContact = async (id, userId) => {
  const query = `
    DELETE FROM emergency_contacts
    WHERE id = ? AND user_id = ?
  `;

  const [result] = await pool.execute(query, [id, userId]);
  return result.affectedRows > 0;
};

/**
 * Count contacts for a user
 * Used to enforce a maximum contacts limit
 * @param {number} userId
 * @returns {number}
 */
export const countByUserId = async (userId) => {
  const query = `
    SELECT COUNT(*) as total
    FROM emergency_contacts
    WHERE user_id = ?
  `;

  const [rows] = await pool.execute(query, [userId]);
  return rows[0].total;
};