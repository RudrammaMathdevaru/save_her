/**
 * File: src/components/UI/Toast.jsx
 * Updated: 2026-03-18
 *
 * Purpose:
 * - Individual toast notification component
 * - Different styles for success, error, warning, info
 * - Responsive positioning handled by container
 * - Auto-dismiss after duration
 *
 * Changes:
 * - Created reusable toast component
 * - Added close button and progress bar
 *
 * Connected Modules:
 * - Used by ToastContainer.jsx
 *
 * Dependencies:
 * - react-icons/fi: Icons
 */

import React, { useEffect, useState } from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiX,
  FiAlertTriangle,
} from 'react-icons/fi';
import { TOAST_DURATION } from '../../utils/constants.js';

const Toast = ({ 
  id, 
  type = 'info', 
  message, 
  duration = TOAST_DURATION[type.toUpperCase()] || 2000,
  onClose,
  pauseOnHover = true,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);

  // Auto-dismiss timer
  useEffect(() => {
    if (isPaused) return;

    const startTime = Date.now();
    const endTime = startTime + duration;
    
    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = endTime - now;
      const newProgress = (remaining / duration) * 100;
      
      if (remaining <= 0) {
        clearInterval(timer);
        onClose(id);
      } else {
        setProgress(newProgress);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [id, duration, onClose, isPaused]);

  // Icon based on type
  const icons = {
    success: <FiCheckCircle className="w-5 h-5 text-green-500" />,
    error: <FiAlertCircle className="w-5 h-5 text-red-500" />,
    warning: <FiAlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <FiInfo className="w-5 h-5 text-blue-500" />,
  };

  // Background color based on type
  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  // Progress bar color
  const progressColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  return (
    <div
      className={`
        relative w-full sm:w-96 rounded-lg border shadow-lg
        ${bgColors[type]} backdrop-blur-sm
        overflow-hidden animate-slideInRight
        mb-3 last:mb-0
      `}
      role="alert"
      aria-live="polite"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {icons[type]}
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800 break-words">{message}</p>
        </div>

        {/* Close button */}
        <button
          onClick={() => onClose(id)}
          className="
            flex-shrink-0 text-gray-400 hover:text-gray-600
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-gray-400 rounded
          "
          aria-label="Close notification"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* Progress bar */}
      <div
        className={`
          absolute bottom-0 left-0 h-1 transition-all duration-100
          ${progressColors[type]}
        `}
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />
    </div>
  );
};

export default Toast;