/**
 * File: src/components/UI/Loader.jsx
 * Updated: 2026-03-18
 *
 * Purpose:
 * - Global loading spinner component
 * - Full-screen overlay with blur effect
 * - Shows during API calls and page transitions
 *
 * Changes:
 * - Created reusable loader component
 * - Added optional message and size variants
 *
 * Connected Modules:
 * - Used by AuthContext and any component needing loading state
 *
 * Dependencies:
 * - react-icons/fi: Icons
 */

import React from 'react';
import { FiLoader } from 'react-icons/fi';

const Loader = ({ 
  message = 'Loading...', 
  fullScreen = true,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  if (fullScreen) {
    return (
      <div
        className="
          fixed inset-0 z-50 flex items-center justify-center
          bg-white/80 backdrop-blur-sm
          transition-all duration-300
        "
        role="status"
        aria-label="Loading"
      >
        <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-white shadow-xl">
          <div
            className={`
              ${spinnerSize} border-gray-200 border-t-indigo-600
              rounded-full animate-spin
            `}
            aria-hidden="true"
          />
          {message && (
            <p className="text-sm text-gray-600 animate-pulse">
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Inline loader
  return (
    <div
      className="flex items-center justify-center gap-3"
      role="status"
      aria-label="Loading"
    >
      <FiLoader className="w-5 h-5 animate-spin text-indigo-600" />
      {message && <span className="text-sm text-gray-600">{message}</span>}
    </div>
  );
};

export default Loader;