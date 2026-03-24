/**
 * File: src/services/sms.service.js
 * Updated: 2026-03-23
 *
 * Purpose:
 * - Send emergency SMS alerts via Twilio
 * - Formats message with user name, date, time, Google Maps link
 *
 * Changes:
 * - FIXED: Added phone number normalization to E.164 format
 *   Twilio requires international format (+91XXXXXXXXXX for India)
 *   Numbers saved without country code (8792018045) were being
 *   rejected with "Permission to send SMS not enabled for region"
 *   Now auto-prepends +91 if no country code prefix is present
 *
 * Connected Modules:
 * - Called by sos.service.js
 *
 * Dependencies:
 * - twilio: SMS delivery via Twilio API
 * - env: Validated Twilio credentials from environment config
 */

import twilio from 'twilio';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';

const client = twilio(env.TWILIO.ACCOUNT_SID, env.TWILIO.AUTH_TOKEN);

/**
 * Normalize phone number to E.164 format required by Twilio
 * If number already starts with + it is returned as-is
 * If number is 10 digits (Indian mobile), +91 is prepended
 * @param {string} phone
 * @returns {string} Normalized phone number
 */
const normalizePhoneNumber = (phone) => {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');

  if (cleaned.startsWith('+')) {
    return cleaned;
  }

  // 10 digit Indian mobile number — prepend +91
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }

  // Already has country code without + (e.g. 919876543210)
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned}`;
  }

  // Return as-is with + if nothing matches — let Twilio give the error
  return `+${cleaned}`;
};

/**
 * Build SMS message body
 * @param {Object} params
 * @returns {string}
 */
const buildSMSBody = ({ userName, date, time, mapsLink }) => {
  return [
    'EMERGENCY SOS ALERT',
    '',
    'SafeHer user needs immediate help.',
    '',
    `Name     : ${userName}`,
    `Date     : ${date}`,
    `Time     : ${time}`,
    `Location : ${mapsLink}`,
    '',
    'Please respond immediately.',
    'Automated alert from SafeHer.',
  ].join('\n');
};

/**
 * Send SOS SMS to a single phone number via Twilio
 * Returns result object — never throws — so one failed SMS
 * does not block emails to other recipients
 *
 * @param {Object} params
 * @param {string} params.to - Recipient phone number
 * @param {string} params.userName - Name of user who triggered SOS
 * @param {string} params.date - Formatted date string
 * @param {string} params.time - Formatted time string
 * @param {string} params.mapsLink - Google Maps URL
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
 */
export const sendSOSSMS = async ({ to, userName, date, time, mapsLink }) => {
  const normalizedTo = normalizePhoneNumber(to);

  try {
    const message = await client.messages.create({
      body: buildSMSBody({ userName, date, time, mapsLink }),
      from: env.TWILIO.PHONE_NUMBER,
      to: normalizedTo,
    });

    logger.info(`SMS sent to ${normalizedTo} — SID: ${message.sid}`);

    return {
      success: true,
      messageId: message.sid,
    };
  } catch (error) {
    logger.error(`SMS failed to ${normalizedTo}: ${error.message}`);

    return {
      success: false,
      error: error.message,
    };
  }
};
