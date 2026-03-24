/**
 * File: src/SoftwareApplication/profile/profile_components/EmergencyContact.jsx
 * Updated: 2026-03-22
 *
 * Purpose:
 * - Manage emergency contact number
 * - Strict input: only digits allowed, exactly 10, no letters
 * - Connects to backend via updateEmergencyContact API
 *
 * Changes:
 * - Input now silently strips any non-digit character as user types
 *   (letters never appear in the field at all)
 * - Enforces max 10 digit length
 * - Save calls real API, shows success/error feedback
 * - Removed debounced auto-save — explicit Save button instead
 *
 * Connected Modules:
 * - ProfileMain.jsx (parent)
 *
 * Dependencies:
 * - react-icons/ri: Information icon
 */

import React, { useCallback, useState } from 'react';
import { RiInformationLine } from 'react-icons/ri';

const EmergencyContact = ({
  emergencyContact,
  onUpdate,
  updateEmergencyContact,
  className = '',
}) => {
  const [value, setValue] = useState(emergencyContact || '');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = useCallback((e) => {
    // Strip every non-digit character silently — letters never appear
    const digitsOnly = e.target.value.replace(/\D/g, '');

    // Enforce max 10 digits
    const capped = digitsOnly.slice(0, 10);

    setValue(capped);
    setIsDirty(true);
    setSaveSuccess(false);

    if (capped.length > 0 && capped.length < 10) {
      setError('Emergency contact must be exactly 10 digits');
    } else {
      setError('');
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (value.length !== 10) {
      setError('Emergency contact must be exactly 10 digits');
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedUser = await updateEmergencyContact(value);
      onUpdate(updatedUser);
      setIsDirty(false);
      setSaveSuccess(true);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to save. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [value, onUpdate, updateEmergencyContact]);

  const handleCancel = useCallback(() => {
    setValue(emergencyContact || '');
    setError('');
    setIsDirty(false);
    setSaveSuccess(false);
  }, [emergencyContact]);

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
          inputMode="numeric"
          value={value}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 text-sm focus:outline-none ${
            error
              ? 'border-red-500 focus:border-red-600'
              : 'border-gray-200 focus:border-[#6C63FF]'
          }`}
          placeholder="10 digit number"
          maxLength={10}
          aria-invalid={!!error}
          aria-describedby={error ? 'emergency-error' : 'emergency-hint'}
        />

        <div className="mt-1 flex justify-between text-xs">
          <p id="emergency-hint" className="text-gray-400">
            <RiInformationLine
              className="mr-1 inline-block"
              aria-hidden="true"
            />
            Digits only. Exactly 10 digits required.
          </p>
          <p
            className={value.length === 10 ? 'text-green-500' : 'text-gray-400'}
          >
            {value.length}/10
          </p>
        </div>

        {error && (
          <p
            id="emergency-error"
            className="mt-1 text-xs text-red-500"
            role="alert"
          >
            {error}
          </p>
        )}

        {saveSuccess && (
          <p className="mt-1 text-xs text-green-600" role="status">
            Emergency contact saved successfully.
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={
              isSubmitting || !isDirty || !!error || value.length !== 10
            }
            className="px-6 py-3 rounded-xl font-medium transition-all duration-300 bg-[#6C63FF] text-white hover:bg-[#5a52e6] shadow-lg shadow-[#6C63FF]/30 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 flex-1 sm:flex-none text-sm"
          >
            {isSubmitting ? 'Saving...' : 'Save Contact'}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting || !isDirty}
            className="px-6 py-3 rounded-xl font-medium transition-all duration-300 border-2 border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 flex-1 sm:flex-none text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(EmergencyContact);
