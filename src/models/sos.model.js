/**
 * File: src/models/sos.model.js
 * Updated: 2026-03-24
 *
 * Purpose:
 * - All MySQL queries for sos_alerts table
 * - Parameterized queries only — zero string concatenation
 * - Zero business logic
 *
 * Changes:
 * - Added deleteSOSById query for single record deletion
 * - Added deleteAllSOSByUserId query for bulk deletion
 * - Added getAudioPathById to fetch audio path before deletion
 *   so the service layer can delete the file from disk
 *
 * Connected Modules:
 * - Used by sos.service.js
 * - Depends on config/db.js
 *
 * Dependencies:
 * - mysql2/promise: Via db pool
 */

import pool from '../config/db.js';

export const initializeSOSTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS sos_alerts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      latitude DECIMAL(10, 8) NOT NULL,
      longitude DECIMAL(11, 8) NOT NULL,
      accuracy FLOAT DEFAULT NULL,
      audio_path VARCHAR(255) DEFAULT NULL,
      recipients JSON NOT NULL,
      status VARCHAR(50) DEFAULT 'sent',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user_id (user_id),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;
  try {
    await pool.execute(query);
    console.log('SOS alerts table initialized');
  } catch (error) {
    console.error('Failed to initialize sos_alerts table:', error.message);
    throw error;
  }
};

export const createSOSAlert = async (data) => {
  const {
    userId,
    latitude,
    longitude,
    accuracy,
    audioPath,
    recipients,
    status,
  } = data;

  const query = `
    INSERT INTO sos_alerts
      (user_id, latitude, longitude, accuracy, audio_path, recipients, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.execute(query, [
    userId,
    latitude,
    longitude,
    accuracy || null,
    audioPath || null,
    JSON.stringify(recipients),
    status || 'sent',
  ]);

  return findSOSById(result.insertId);
};

export const findSOSById = async (id) => {
  const query = `
    SELECT
      id, user_id, latitude, longitude,
      accuracy, audio_path, recipients,
      status, created_at
    FROM sos_alerts
    WHERE id = ?
    LIMIT 1
  `;
  const [rows] = await pool.execute(query, [id]);
  return rows[0] || null;
};

export const findAllByUserId = async (userId) => {
  const query = `
    SELECT
      id, user_id, latitude, longitude,
      accuracy, audio_path, recipients,
      status, created_at
    FROM sos_alerts
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 50
  `;
  const [rows] = await pool.execute(query, [userId]);
  return rows;
};

/**
 * Get audio path for a single record before deletion
 * Used by service to delete the file from disk
 * @param {number} id
 * @param {number} userId
 * @returns {Object|null}
 */
export const getAudioPathById = async (id, userId) => {
  const query = `
    SELECT id, audio_path
    FROM sos_alerts
    WHERE id = ? AND user_id = ?
    LIMIT 1
  `;
  const [rows] = await pool.execute(query, [id, userId]);
  return rows[0] || null;
};

/**
 * Delete a single SOS alert by ID
 * user_id check prevents one user deleting another's record
 * @param {number} id
 * @param {number} userId
 * @returns {boolean}
 */
export const deleteSOSById = async (id, userId) => {
  const query = `
    DELETE FROM sos_alerts
    WHERE id = ? AND user_id = ?
  `;
  const [result] = await pool.execute(query, [id, userId]);
  return result.affectedRows > 0;
};

/**
 * Get all audio paths for a user before bulk deletion
 * Used by service to delete all audio files from disk
 * @param {number} userId
 * @returns {Array}
 */
export const getAllAudioPathsByUserId = async (userId) => {
  const query = `
    SELECT id, audio_path
    FROM sos_alerts
    WHERE user_id = ?
  `;
  const [rows] = await pool.execute(query, [userId]);
  return rows;
};

/**
 * Delete all SOS alerts for a user
 * @param {number} userId
 * @returns {number} Number of rows deleted
 */
export const deleteAllSOSByUserId = async (userId) => {
  const query = `
    DELETE FROM sos_alerts
    WHERE user_id = ?
  `;
  const [result] = await pool.execute(query, [userId]);
  return result.affectedRows;
};
