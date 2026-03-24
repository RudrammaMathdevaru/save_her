/**
 * File: src/services/sos.service.js
 * Updated: 2026-03-24
 *
 * Purpose:
 * - All business logic for SOS alert operations
 * - Orchestrates send flow, history fetch, and deletion
 *
 * Changes:
 * - Added deleteSOSAlert — deletes DB record + audio file from disk
 * - Added deleteAllSOSAlerts — bulk delete all records + all audio files
 *
 * Connected Modules:
 * - Called by sos.controller.js
 * - Calls sms.service.js, email.service.js, sos.model.js
 * - Calls user.model.js for user name lookup
 *
 * Dependencies:
 * - fs/promises: Delete audio files from disk on record deletion
 * - path: Resolve absolute paths for file deletion
 */

import fs from 'fs/promises';
import path from 'path';
import * as sosModel from '../models/sos.model.js';
import * as userModel from '../models/user.model.js';
import AppError from '../utils/appError.js';
import logger from '../utils/logger.js';
import { sendSOSEmail } from './email.service.js';
import { sendSOSSMS } from './sms.service.js';

/**
 * Delete a single audio file from disk safely
 * Never throws — a missing file is not a fatal error
 * @param {string|null} audioPath
 */
const deleteAudioFile = async (audioPath) => {
  if (!audioPath) return;

  try {
    const absolutePath = path.isAbsolute(audioPath)
      ? audioPath
      : path.resolve(process.cwd(), audioPath);

    await fs.unlink(absolutePath);
    logger.info(`Audio file deleted from disk: ${absolutePath}`);
  } catch (err) {
    // File may already be gone — log warning but do not crash
    logger.warn(`Could not delete audio file: ${audioPath} — ${err.message}`);
  }
};

/**
 * Trigger a full SOS alert
 */
export const triggerSOS = async (userId, location, recipients, audioPath) => {
  const user = await userModel.findUserById(userId);
  if (!user) throw new AppError('User not found', 404);

  const userName = user.full_name;

  const now = new Date();
  const date = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const time = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const mapsLink = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;

  const sosRecord = await sosModel.createSOSAlert({
    userId,
    latitude: location.latitude,
    longitude: location.longitude,
    accuracy: location.accuracy,
    audioPath,
    recipients,
    status: 'sending',
  });

  const deliveryResults = await Promise.all(
    recipients.map(async (recipient) => {
      const result = { name: recipient.name, sms: null, email: null };

      if (recipient.phone) {
        result.sms = await sendSOSSMS({
          to: recipient.phone,
          userName,
          date,
          time,
          mapsLink,
        });
      }

      if (recipient.email) {
        result.email = await sendSOSEmail({
          to: recipient.email,
          recipientName: recipient.name,
          userName,
          date,
          time,
          mapsLink,
          audioPath,
        });
      }

      return result;
    })
  );

  logger.info(
    `SOS triggered by user ${userId} — ${recipients.length} recipients notified`
  );

  return {
    sosId: sosRecord.id,
    userName,
    date,
    time,
    mapsLink,
    deliveryResults,
  };
};

/**
 * Get SOS history for a user
 */
export const getSOSHistory = async (userId) => {
  const records = await sosModel.findAllByUserId(userId);
  return records.map(formatSOSRecord);
};

/**
 * Delete a single SOS alert
 * Verifies ownership, deletes audio from disk, then deletes DB record
 * @param {number} id
 * @param {number} userId
 */
export const deleteSOSAlert = async (id, userId) => {
  const record = await sosModel.getAudioPathById(id, userId);

  if (!record) {
    throw new AppError('SOS record not found', 404);
  }

  // Delete audio file from disk before removing DB record
  await deleteAudioFile(record.audio_path);

  const deleted = await sosModel.deleteSOSById(id, userId);

  if (!deleted) {
    throw new AppError('Failed to delete SOS record', 500);
  }
};

/**
 * Delete all SOS alerts for a user
 * Deletes all audio files from disk first, then removes all DB records
 * @param {number} userId
 * @returns {number} Count of deleted records
 */
export const deleteAllSOSAlerts = async (userId) => {
  const records = await sosModel.getAllAudioPathsByUserId(userId);

  // Delete all audio files from disk in parallel
  await Promise.all(records.map((r) => deleteAudioFile(r.audio_path)));

  const deletedCount = await sosModel.deleteAllSOSByUserId(userId);

  logger.info(`Deleted ${deletedCount} SOS records for user ${userId}`);

  return deletedCount;
};

/**
 * Format raw DB row for API response
 */
const formatSOSRecord = (record) => {
  return {
    id: record.id,
    latitude: parseFloat(record.latitude),
    longitude: parseFloat(record.longitude),
    accuracy: record.accuracy,
    audioUrl: record.audio_path
      ? `${process.env.APP_URL}/uploads/sos-audio/${path.basename(record.audio_path)}`
      : null,
    recipients:
      typeof record.recipients === 'string'
        ? JSON.parse(record.recipients)
        : record.recipients,
    status: record.status,
    createdAt: record.created_at,
  };
};
