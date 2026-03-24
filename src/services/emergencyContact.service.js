/**
 * File: src/services/emergencyContact.service.js
 * Updated: 2026-03-23
 *
 * Purpose:
 * - All business logic for emergency contact operations
 * - Ownership checks, limit enforcement, data formatting
 *
 * Changes:
 * - Created for emergency contacts module
 *
 * Connected Modules:
 * - Called by emergencyContact.controller.js
 * - Calls emergencyContact.model.js
 * - Uses appError.js for error throwing
 *
 * Dependencies:
 * - appError: Centralized error class
 */

import * as contactModel from '../models/emergencyContact.model.js';
import AppError from '../utils/appError.js';

// Maximum contacts per user
const MAX_CONTACTS = 10;

/**
 * Get all contacts for the logged-in user
 * @param {number} userId
 * @returns {Array} Formatted contacts
 */
export const getAllContacts = async (userId) => {
  const contacts = await contactModel.findAllByUserId(userId);
  return contacts.map(formatContact);
};

/**
 * Create a new contact
 * Enforces max 10 contacts per user
 * @param {number} userId
 * @param {Object} data - { name, relationship, phone }
 * @returns {Object} Formatted created contact
 */
export const createContact = async (userId, data) => {
  const count = await contactModel.countByUserId(userId);

  if (count >= MAX_CONTACTS) {
    throw new AppError(
      `You can only have up to ${MAX_CONTACTS} emergency contacts`,
      400
    );
  }

  const contact = await contactModel.createContact(userId, data);
  return formatContact(contact);
};

/**
 * Update an existing contact
 * Verifies ownership before updating
 * @param {number} id
 * @param {number} userId
 * @param {Object} data - { name, relationship, phone }
 * @returns {Object} Formatted updated contact
 */
export const updateContact = async (id, userId, data) => {
  const existing = await contactModel.findByIdAndUserId(id, userId);

  if (!existing) {
    throw new AppError('Contact not found', 404);
  }

  const updated = await contactModel.updateContact(id, userId, data);
  return formatContact(updated);
};

/**
 * Delete a contact
 * Verifies ownership before deleting
 * @param {number} id
 * @param {number} userId
 */
export const deleteContact = async (id, userId) => {
  const existing = await contactModel.findByIdAndUserId(id, userId);

  if (!existing) {
    throw new AppError('Contact not found', 404);
  }

  const deleted = await contactModel.deleteContact(id, userId);

  if (!deleted) {
    throw new AppError('Failed to delete contact', 500);
  }
};

/**
 * Format raw DB row for API response
 * @param {Object} contact - Raw DB row
 * @returns {Object} Clean formatted contact
 */
const formatContact = (contact) => {
  return {
    id: contact.id,
    userId: contact.user_id,
    name: contact.name,
    relationship: contact.relationship,
    phone: contact.phone,
    createdAt: contact.created_at,
  };
};