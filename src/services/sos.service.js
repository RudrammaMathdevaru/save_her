/**
 * File: src/services/sos.service.js
 * Updated: 2026-03-23
 *
 * Purpose:
 * - Frontend API calls for SOS module
 * - Trigger SOS alert and fetch history
 *
 * Changes:
 * - Created for SOS module
 *
 * Connected Modules:
 * - Used by SOSButton.jsx
 * - Depends on axiosConfig.js
 *
 * Dependencies:
 * - axiosInstance: Configured axios with JWT interceptor
 */

import axiosInstance from './axiosConfig.js';

/**
 * Trigger SOS alert
 * Sends audio blob, location, and recipients to backend
 * @param {Object} params
 * @param {Blob|null} params.audioBlob - Recorded audio
 * @param {Object} params.location - { latitude, longitude, accuracy }
 * @param {Array} params.recipients - [{ name, phone, email }]
 * @returns {Promise<Object>} SOS result
 */
export const triggerSOS = async ({ audioBlob, location, recipients }) => {
  const formData = new FormData();

  if (audioBlob) {
    formData.append('audio', audioBlob, `sos-audio-${Date.now()}.webm`);
  }

  formData.append('latitude', location.latitude.toString());
  formData.append('longitude', location.longitude.toString());
  formData.append('accuracy', (location.accuracy || 0).toString());
  formData.append('recipients', JSON.stringify(recipients));

  const response = await axiosInstance.post('/sos/trigger', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data.data;
};

/**
 * Get SOS history for logged-in user
 * @returns {Promise<Array>} SOS history records
 */
export const getSOSHistory = async () => {
  const response = await axiosInstance.get('/sos/history');
  return response.data.data.history;
};