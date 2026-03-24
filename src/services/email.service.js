/**
 * File: src/services/email.service.js
 * Updated: 2026-03-23
 *
 * Purpose:
 * - Send SOS alert emails via SendGrid
 * - Attaches audio file and includes full emergency details
 *
 * Changes:
 * - FIXED: Audio file was not attaching because audioPath from multer
 *   is a relative path (uploads/sos-audio/xxx.webm). fs.readFile
 *   needs an absolute path. Now uses path.resolve(process.cwd(), audioPath)
 *   to build the correct absolute path regardless of where the server
 *   process is started from.
 *
 * Connected Modules:
 * - Called by sos.service.js
 *
 * Dependencies:
 * - @sendgrid/mail: Email delivery with attachment support
 * - fs/promises: Read audio file from disk for attachment
 * - path: Resolve absolute file paths safely
 * - env: SendGrid credentials from validated environment config
 */

import sgMail from '@sendgrid/mail';
import fs from 'fs/promises';
import path from 'path';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';

sgMail.setApiKey(env.SENDGRID.API_KEY);

/**
 * Build HTML email body
 * @param {Object} params
 * @returns {string} HTML string
 */
const buildEmailHTML = ({ userName, date, time, mapsLink, hasAudio }) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;margin-top:20px;">

        <div style="background:#dc2626;padding:24px 32px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:28px;letter-spacing:2px;">
            EMERGENCY SOS ALERT
          </h1>
          <p style="color:#fecaca;margin:8px 0 0;font-size:14px;">
            SafeHer Emergency Notification System
          </p>
        </div>

        <div style="background:#fef2f2;border-left:4px solid #dc2626;padding:16px 32px;">
          <p style="margin:0;color:#991b1b;font-size:16px;font-weight:bold;">
            A SafeHer user requires immediate assistance.
          </p>
        </div>

        <div style="padding:32px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:14px;width:120px;">
                User Name
              </td>
              <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:14px;font-weight:bold;">
                ${userName}
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:14px;">
                Date
              </td>
              <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:14px;">
                ${date}
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:14px;">
                Time
              </td>
              <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:14px;">
                ${time}
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;color:#6b7280;font-size:14px;">
                Location
              </td>
              <td style="padding:12px 0;color:#111827;font-size:14px;">
                <a href="${mapsLink}" style="color:#2563eb;text-decoration:none;font-weight:bold;">
                  View on Google Maps
                </a>
              </td>
            </tr>
          </table>

          ${
            hasAudio
              ? `
          <div style="margin-top:24px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;">
            <p style="margin:0;color:#166534;font-size:14px;">
              An audio recording from the time of the alert is attached to this email.
              Please listen to it immediately.
            </p>
          </div>
          `
              : ''
          }

          <div style="text-align:center;margin-top:32px;">
            <a href="${mapsLink}"
               style="display:inline-block;background:#dc2626;color:#ffffff;padding:14px 32px;
                      border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;
                      letter-spacing:1px;">
              VIEW LOCATION NOW
            </a>
          </div>
        </div>

        <div style="background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="margin:0;color:#9ca3af;font-size:12px;">
            This is an automated emergency alert from SafeHer.
            Do not reply to this email.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
};

/**
 * Send SOS alert email with optional audio attachment
 * @param {Object} params
 * @param {string} params.to - Recipient email
 * @param {string} params.recipientName - Recipient name
 * @param {string} params.userName - User who triggered SOS
 * @param {string} params.date - Formatted date
 * @param {string} params.time - Formatted time
 * @param {string} params.mapsLink - Google Maps URL
 * @param {string|null} params.audioPath - Relative or absolute path to audio file
 * @returns {Object} { success, error }
 */
export const sendSOSEmail = async ({
  to,
  recipientName,
  userName,
  date,
  time,
  mapsLink,
  audioPath,
}) => {
  try {
    const hasAudio = !!audioPath;

    const msg = {
      to,
      from: {
        email: env.SENDGRID.FROM_EMAIL,
        name: 'SafeHer Emergency Alert',
      },
      subject: `URGENT - SOS Alert from ${userName}`,
      html: buildEmailHTML({ userName, date, time, mapsLink, hasAudio }),
      attachments: [],
    };

    if (hasAudio) {
      try {
        // Resolve to absolute path — multer saves relative paths
        // process.cwd() is the backend project root directory
        const absoluteAudioPath = path.isAbsolute(audioPath)
          ? audioPath
          : path.resolve(process.cwd(), audioPath);

        logger.info(`Reading audio file from: ${absoluteAudioPath}`);

        const audioBuffer = await fs.readFile(absoluteAudioPath);
        const audioBase64 = audioBuffer.toString('base64');
        const audioFileName = path.basename(absoluteAudioPath);

        msg.attachments.push({
          content: audioBase64,
          filename: audioFileName,
          type: 'audio/webm',
          disposition: 'attachment',
        });

        logger.info(
          `Audio attached: ${audioFileName} (${audioBuffer.length} bytes)`
        );
      } catch (fileError) {
        logger.warn(
          `Audio file not found — sending email without attachment. Path: ${audioPath}. Error: ${fileError.message}`
        );
      }
    }

    await sgMail.send(msg);

    logger.info(`SOS email sent to ${to}`);

    return { success: true };
  } catch (error) {
    logger.error(`Email failed to ${to}: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
};
