/**
 * File: src/controllers/sos.controller.js
 * Updated: 2026-03-24
 *
 * Purpose:
 * - Handle HTTP request/response for SOS routes
 * - Zero business logic — extract, call service, respond
 *
 * Changes:
 * - Added deleteSOSAlert handler for single record deletion
 * - Added deleteAllSOSAlerts handler for bulk deletion
 *
 * Connected Modules:
 * - Called by sos.routes.js
 * - Calls sos.service.js
 *
 * Dependencies:
 * - sos.service: Business logic
 * - response: Standard formatter
 */

import * as sosService from '../services/sos.service.js';
import { sendSuccess } from '../utils/response.js';

export const triggerSOS = async (req, res, next) => {
  try {
    const { latitude, longitude, accuracy, recipients } = req.body;
    const audioPath = req.file ? req.file.path : null;

    const result = await sosService.triggerSOS(
      req.user.id,
      {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        accuracy: parseFloat(accuracy) || null,
      },
      typeof recipients === 'string' ? JSON.parse(recipients) : recipients,
      audioPath
    );

    sendSuccess(res, 200, 'SOS alert sent successfully', result);
  } catch (error) {
    next(error);
  }
};

export const getSOSHistory = async (req, res, next) => {
  try {
    const history = await sosService.getSOSHistory(req.user.id);
    sendSuccess(res, 200, 'SOS history retrieved successfully', { history });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/sos/:id
 * Delete a single SOS record + its audio file
 */
export const deleteSOSAlert = async (req, res, next) => {
  try {
    await sosService.deleteSOSAlert(
      parseInt(req.params.id, 10),
      req.user.id
    );
    sendSuccess(res, 200, 'SOS record deleted successfully', {});
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/sos/all
 * Delete all SOS records for the logged-in user
 */
export const deleteAllSOSAlerts = async (req, res, next) => {
  try {
    const count = await sosService.deleteAllSOSAlerts(req.user.id);
    sendSuccess(res, 200, `${count} SOS records deleted successfully`, { count });
  } catch (error) {
    next(error);
  }
};