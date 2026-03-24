/**
 * File: src/SoftwareApplication/profile/profile_components/PersonalInformation.jsx
 * Updated: 2026-03-22
 *
 * Purpose:
 * - Manage location and bio fields only (as requested)
 * - Submit changes to backend via updateUserProfile API
 *
 * Changes:
 * - Form now only manages location and bio (backend fields)
 * - fullName, email, phone are displayed read-only from profileData
 * - Save calls the real API and shows success/error feedback
 * - isDirty correctly tracks only location and bio changes
 *
 * Connected Modules:
 * - ProfileMain.jsx (parent passes updateUserProfile and onUpdate)
 *
 * Dependencies:
 * - react-icons/ri: Save icon
 */

import React, { useCallback, useMemo, useState } from 'react';
import { RiSaveLine } from 'react-icons/ri';

const PersonalInformation = ({ profileData, onUpdate, updateUserProfile }) => {
  const [formData, setFormData] = useState({
    location: profileData.location || '',
    bio: profileData.bio || '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'location':
        return value.length <= 100
          ? ''
          : 'Location must be under 100 characters';
      case 'bio':
        return value.length <= 200 ? '' : 'Bio must be under 200 characters';
      default:
        return '';
    }
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setIsDirty(true);
      setSaveSuccess(false);
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validateField]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const newErrors = {};
      Object.keys(formData).forEach((key) => {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setIsSubmitting(true);

      try {
        const updatedUser = await updateUserProfile(formData);
        onUpdate(updatedUser);
        setIsDirty(false);
        setSaveSuccess(true);
      } catch (err) {
        setErrors({
          submit: err.message || 'Failed to save. Please try again.',
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, onUpdate, updateUserProfile, validateField]
  );

  const handleCancel = useCallback(() => {
    setFormData({
      location: profileData.location || '',
      bio: profileData.bio || '',
    });
    setErrors({});
    setIsDirty(false);
    setSaveSuccess(false);
  }, [profileData]);

  const bioCharCount = useMemo(() => formData.bio.length, [formData.bio]);

  const hasErrors = Object.values(errors).some((e) => e);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Personal Information
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-6">
          {/* Read-only fields — from DB, not editable here */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={profileData.fullName || ''}
                readOnly
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 text-sm text-gray-500 cursor-not-allowed focus:outline-none"
                aria-label="Full name (read only)"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={profileData.email || ''}
                readOnly
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 text-sm text-gray-500 cursor-not-allowed focus:outline-none"
                aria-label="Email address (read only)"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={profileData.phoneNumber || ''}
              readOnly
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 text-sm text-gray-500 cursor-not-allowed focus:outline-none"
              aria-label="Phone number (read only)"
            />
          </div>

          {/* Editable fields */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 text-sm focus:outline-none ${
                errors.location
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-gray-200 focus:border-[#6C63FF]'
              }`}
              placeholder="City, State"
              aria-invalid={!!errors.location}
              aria-describedby={errors.location ? 'location-error' : undefined}
            />
            {errors.location && (
              <p
                id="location-error"
                className="mt-1 text-xs text-red-500"
                role="alert"
              >
                {errors.location}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="4"
              value={formData.bio}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 text-sm resize-none focus:outline-none ${
                errors.bio
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-gray-200 focus:border-[#6C63FF]'
              }`}
              placeholder="Tell us about yourself..."
              aria-invalid={!!errors.bio}
              aria-describedby={errors.bio ? 'bio-error' : 'bio-hint'}
              maxLength={200}
            />
            <div className="mt-1 flex justify-between text-xs">
              <p id="bio-hint" className="text-gray-400">
                Brief description for your profile. Max 200 characters.
              </p>
              <p
                className={
                  bioCharCount > 180 ? 'text-orange-500' : 'text-gray-400'
                }
              >
                {bioCharCount}/200
              </p>
            </div>
            {errors.bio && (
              <p
                id="bio-error"
                className="mt-1 text-xs text-red-500"
                role="alert"
              >
                {errors.bio}
              </p>
            )}
          </div>

          {errors.submit && (
            <p className="text-sm text-red-500" role="alert">
              {errors.submit}
            </p>
          )}

          {saveSuccess && (
            <p className="text-sm text-green-600" role="status">
              Profile saved successfully.
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !isDirty || hasErrors}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap bg-[#6C63FF] text-white hover:bg-[#5a52e6] shadow-lg shadow-[#6C63FF]/30 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 flex-1 sm:flex-none"
            >
              <RiSaveLine className="mr-2 inline-block" aria-hidden="true" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting || !isDirty}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap border-2 border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 flex-1 sm:flex-none"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default React.memo(PersonalInformation);
