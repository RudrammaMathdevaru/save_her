/**
 * File: src/SoftwareApplication/profile/profile_components/EmergencyContact.jsx
 * Updated: 2026-02-04
 *
 * Purpose:
 * - Manages emergency contact information
 * - Handles validation for emergency contact phone numbers
 *
 * Changes:
 * - Added proper validation for emergency contact
 * - Implemented real-time updates with debouncing
 * - Added accessibility attributes
 * - Included warning/information messages
 *
 * Connected Modules:
 * - ProfileMain.jsx (parent)
 *
 * Dependencies:
 * - react-icons/ri: For Remix Icon set
 */

import React, { useCallback, useEffect, useState } from 'react';
import { RiInformationLine } from 'react-icons/ri';

const EmergencyContact = ({ emergencyContact, onUpdate, className = '' }) => {
  const [contact, setContact] = useState(emergencyContact);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isDirty, setIsDirty] = useState(false);

  // Validate phone number
  const validatePhone = useCallback((phone) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  }, []);

  // Debounced update
  useEffect(() => {
    if (isDirty && isValid) {
      const timer = setTimeout(() => {
        onUpdate(contact);
        setIsDirty(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [contact, isValid, isDirty, onUpdate]);

  const handleChange = useCallback(
    (e) => {
      const value = e.target.value;
      setContact(value);
      setIsDirty(true);

      const valid = validatePhone(value);
      setIsValid(valid);
      setError(valid ? '' : 'Please enter a valid phone number');
    },
    [validatePhone]
  );

  const handleBlur = useCallback(() => {
    if (isDirty && isValid) {
      onUpdate(contact);
      setIsDirty(false);
    }
  }, [contact, isValid, isDirty, onUpdate]);

  return (
    <div
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 sm:p-8 ${className}`}
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Emergency Contact
      </h2>

      <div>
        <label
          htmlFor="emergencyContact"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Emergency Contact Phone
        </label>
        <input
          id="emergencyContact"
          name="emergencyContact"
          type="tel"
          value={contact}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 text-sm focus:outline-none ${
            error
              ? 'border-red-500 focus:border-red-600'
              : 'border-gray-200 focus:border-[#6C63FF]'
          }`}
          placeholder="+1 (555) 000-0000"
          aria-invalid={!!error}
          aria-describedby={error ? 'emergency-error' : 'emergency-hint'}
        />

        {error && (
          <p
            id="emergency-error"
            className="mt-1 text-xs text-red-500"
            role="alert"
          >
            {error}
          </p>
        )}

        <p id="emergency-hint" className="mt-2 text-sm text-gray-500">
          <RiInformationLine className="mr-1 inline-block" aria-hidden="true" />
          This number will be notified in case of an emergency SOS alert.
        </p>
      </div>
    </div>
  );
};

export default React.memo(EmergencyContact);
