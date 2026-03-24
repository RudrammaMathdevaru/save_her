/**
 * File: src/services/auth.service.js
 * Updated: 2026-03-22
 *
 * Purpose:
 * - API calls for authentication (login, register, logout)
 *
 * Changes:
 * - FIXED: All response access updated from response.data.x
 *   to response.data.data.x to match the actual API response
 *   shape: { success, message, data: { user, token } }
 *   because axiosConfig no longer auto-unwraps .data
 *
 * Connected Modules:
 * - Used by AuthContext and auth pages
 *
 * Dependencies:
 * - axiosInstance: Configured axios
 */

import { AUTH_ENDPOINTS, STORAGE_KEYS } from '../utils/constants.js';
import axiosInstance from './axiosConfig.js';

export const register = async (userData) => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.REGISTER, userData);
  const { token, user } = response.data.data;

  if (token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  return response.data;
};

export const login = async (email, password, rememberMe = false) => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, {
    email,
    password,
  });
  const { token, user } = response.data.data;

  if (token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

    if (rememberMe) {
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
      localStorage.setItem(STORAGE_KEYS.SAVED_EMAIL, email);
    } else {
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
      localStorage.removeItem(STORAGE_KEYS.SAVED_EMAIL);
    }
  }

  return response.data;
};

export const logout = async () => {
  try {
    await axiosInstance.post(AUTH_ENDPOINTS.LOGOUT).catch(() => {});
  } finally {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

export const getCurrentUser = async () => {
  const response = await axiosInstance.get(AUTH_ENDPOINTS.ME);
  const user = response.data.data.user;

  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  return user;
};

export const forgotPassword = async (email) => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
    email,
  });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
    token,
    password,
  });
  return response.data;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
};

export const getStoredUser = () => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};
