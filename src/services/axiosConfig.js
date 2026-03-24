/**
 * File: src/services/axiosConfig.js
 * Updated: 2026-03-22
 *
 * Purpose:
 * - Configure axios instance with base URL and interceptors
 * - Inject JWT token into every request automatically
 * - Handle 401 redirect globally
 *
 * Changes:
 * - FIXED: Response interceptor was returning response.data
 *   which caused every service file to double-unwrap (.data.user
 *   instead of .user). Interceptor now returns the full response
 *   object so services access response.data.user correctly.
 *
 * Connected Modules:
 * - Used by auth.service.js and user.service.js (frontend)
 *
 * Dependencies:
 * - axios: HTTP client
 */

import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — inject auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — do NOT unwrap here
// Services access response.data themselves for clarity
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorResponse = {
      success: false,
      message: error.response?.data?.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
      errors: error.response?.data?.errors || [],
    };

    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(errorResponse);
  }
);

export default axiosInstance;
