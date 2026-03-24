/**
 * File: src/controllers/emergencyContact.controller.js
 * Updated: 2026-03-23
 *
 * Purpose:
 * - Handle HTTP request/response for emergency contact routes
 * - Zero business logic — only extract, call service, respond
 *
 * Changes:
 * - Created for emergency contacts module
 *
 * Connected Modules:
 * - Called by emergencyContact.routes.js
 * - Calls emergencyContact.service.js
 * - Uses response.js for formatting
 *
 * Dependencies:
 * - emergencyContact.service: Business logic
 * - response: Standard response formatter
 */

import * as contactService from '../services/emergencyContact.service.js';
import { sendSuccess } from '../utils/response.js';

/**
 * GET /api/emergency-contacts
 * Get all contacts for logged-in user
 */
export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactService.getAllContacts(req.user.id);
    sendSuccess(res, 200, 'Contacts retrieved successfully', { contacts });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/emergency-contacts
 * Create a new contact
 */
export const createContact = async (req, res, next) => {
  try {
    const { name, relationship, phone } = req.body;
    const contact = await contactService.createContact(req.user.id, {
      name,
      relationship,
      phone,
    });
    sendSuccess(res, 201, 'Contact added successfully', { contact });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/emergency-contacts/:id
 * Update an existing contact
 */
export const updateContact = async (req, res, next) => {
  try {
    const { name, relationship, phone } = req.body;
    const contact = await contactService.updateContact(
      parseInt(req.params.id, 10),
      req.user.id,
      { name, relationship, phone }
    );
    sendSuccess(res, 200, 'Contact updated successfully', { contact });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/emergency-contacts/:id
 * Delete a contact
 */
export const deleteContact = async (req, res, next) => {
  try {
    await contactService.deleteContact(
      parseInt(req.params.id, 10),
      req.user.id
    );
    sendSuccess(res, 200, 'Contact deleted successfully', {});
  } catch (error) {
    next(error);
  }
};