/**
 * File: src/SoftwareApplication/profile/profile_components/PersonalInformation.jsx
 * Updated: 2026-02-04
 *
 * Purpose:
 * - Manages personal information form with validation
 * - Handles form submission and real-time updates
 *
 * Changes:
 * - Added form validation with error messages
 * - Implemented proper form submission handling
 * - Added accessibility attributes for form controls
 * - Optimized with useCallback and useMemo
 *
 * Connected Modules:
 * - ProfileMain.jsx (parent)
 *
 * Dependencies:
 * - react-icons/ri: For Remix Icon set
 */

import React, { useCallback, useMemo, useState } from 'react';
import { RiSaveLine } from 'react-icons/ri';

const PersonalInformation = ({ profileData, onUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: profileData.fullName,
    email: profileData.email,
    phone: profileData.phone,
    location: profileData.location,
    bio: profileData.bio,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Validation rules
  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ''
          : 'Invalid email address';
      case 'phone':
        return /^\+?[\d\s-]{10,}$/.test(value) ? '' : 'Invalid phone number';
      case 'fullName':
        return value.trim().length >= 2
          ? ''
          : 'Name must be at least 2 characters';
      case 'bio':
        return value.length <= 200
          ? ''
          : 'Bio must be less than 200 characters';
      default:
        return '';
    }
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setIsDirty(true);

      // Validate on change
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    },
    [validateField]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Validate all fields
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

      // Simulate API call
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        Object.keys(formData).forEach((key) => {
          onUpdate(key, formData[key]);
        });
        setIsDirty(false);
      } catch (error) {
        console.error('Failed to update profile:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, onUpdate, validateField]
  );

  const handleCancel = useCallback(() => {
    setFormData({
      fullName: profileData.fullName,
      email: profileData.email,
      phone: profileData.phone,
      location: profileData.location,
      bio: profileData.bio,
    });
    setErrors({});
    setIsDirty(false);
  }, [profileData]);

  // Memoized character count
  const bioCharCount = useMemo(() => formData.bio.length, [formData.bio]);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Personal Information
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-6">
          {/* Name and Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 text-sm focus:outline-none ${
                  errors.fullName
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-green-500 focus:border-green-600'
                }`}
                placeholder="Enter your full name"
                aria-invalid={!!errors.fullName}
                aria-describedby={
                  errors.fullName ? 'fullName-error' : undefined
                }
                required
              />
              {errors.fullName && (
                <p
                  id="fullName-error"
                  className="mt-1 text-xs text-red-500"
                  role="alert"
                >
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 text-sm focus:outline-none ${
                  errors.email
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-green-500 focus:border-green-600'
                }`}
                placeholder="your@email.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                required
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="mt-1 text-xs text-red-500"
                  role="alert"
                >
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Phone and Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 text-sm focus:outline-none ${
                  errors.phone
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-green-500 focus:border-green-600'
                }`}
                placeholder="+1 (555) 000-0000"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone && (
                <p
                  id="phone-error"
                  className="mt-1 text-xs text-red-500"
                  role="alert"
                >
                  {errors.phone}
                </p>
              )}
            </div>

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
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C63FF] focus:outline-none transition-all duration-300 text-sm"
                placeholder="City, State"
              />
            </div>
          </div>

          {/* Bio */}
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
                className={`${bioCharCount > 180 ? 'text-orange-500' : 'text-gray-400'}`}
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

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="submit"
              disabled={
                isSubmitting || !isDirty || Object.keys(errors).length > 0
              }
              className="px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap bg-[#6C63FF] text-white hover:bg-[#5a52e6] shadow-lg shadow-[#6C63FF]/30 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 flex-1 sm:flex-none"
              aria-label="Save changes"
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
