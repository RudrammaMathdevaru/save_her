/**
 * File: src/components/UI/ToastContainer.jsx
 * Updated: 2026-03-18
 *
 * Purpose:
 * - Manages multiple toast notifications
 * - Provides context for toast methods
 * - Responsive positioning (mobile: top center, desktop: top right)
 *
 * Changes:
 * - Created toast container with context
 * - Added methods: success, error, warning, info, remove
 * - Responsive positioning based on screen size
 *
 * Connected Modules:
 * - Used by App.jsx to wrap application
 * - Used by components via useToast hook
 *
 * Dependencies:
 * - react: createContext, useContext, useState
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from './Toast.jsx';
import { TOAST_DURATION } from '../../utils/constants.js';

// Create context
const ToastContext = createContext(null);

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Add a toast
  const addToast = useCallback((type, message, duration) => {
    const id = toastId++;
    setToasts((prev) => [...prev, { id, type, message, duration }]);
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, duration || TOAST_DURATION[type.toUpperCase()] || 2000);
  }, []);

  // Remove a toast
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Toast methods
  const toast = {
    success: (message, duration) => addToast('success', message, duration),
    error: (message, duration) => addToast('error', message, duration),
    warning: (message, duration) => addToast('warning', message, duration),
    info: (message, duration) => addToast('info', message, duration),
    remove: removeToast,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      
      {/* Toast container - responsive positioning */}
      <div
        className="
          fixed z-50 pointer-events-none
          sm:top-4 sm:right-4 sm:left-auto
          top-4 left-1/2 transform -translate-x-1/2 sm:transform-none
          w-full sm:w-auto max-w-[calc(100%-2rem)] sm:max-w-md
          flex flex-col items-center sm:items-end
        "
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto w-full sm:w-auto">
            <Toast
              {...toast}
              onClose={removeToast}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Custom hook for using toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};