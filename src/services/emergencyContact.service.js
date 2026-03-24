/**
 * File: src/services/emergencyContact.service.js
 * Updated: 2026-03-23
 *
 * Purpose:
 * - All API calls for emergency contact management
 * - Get, create, update, delete contacts via backend
 *
 * Changes:
 * - Created for emergency contacts module
 *
 * Connected Modules:
 * - Used by EmergencyContactMain.jsx
 * - Depends on axiosConfig.js for authenticated requests
 *
 * Dependencies:
 * - axiosInstance: Configured axios with JWT interceptor
 */

import axiosInstance from './axiosConfig.js';

/**
 * Get all emergency contacts for logged-in user
 * @returns {Promise<Array>} List of contacts
 */
export const getAllContacts = async () => {
  const response = await axiosInstance.get('/emergency-contacts');
  return response.data.data.contacts;
};

/**
 * Create a new emergency contact
 * @param {Object} data - { name, relationship, phone }
 * @returns {Promise<Object>} Created contact
 */
export const createContact = async (data) => {
  const response = await axiosInstance.post('/emergency-contacts', data);
  return response.data.data.contact;
};

/**
 * Update an existing emergency contact
 * @param {number} id - Contact ID
 * @param {Object} data - { name, relationship, phone }
 * @returns {Promise<Object>} Updated contact
 */
export const updateContact = async (id, data) => {
  const response = await axiosInstance.put(`/emergency-contacts/${id}`, data);
  return response.data.data.contact;
};

/**
 * Delete an emergency contact
 * @param {number} id - Contact ID
 * @returns {Promise<void>}
 */
export const deleteContact = async (id) => {
  await axiosInstance.delete(`/emergency-contacts/${id}`);
};