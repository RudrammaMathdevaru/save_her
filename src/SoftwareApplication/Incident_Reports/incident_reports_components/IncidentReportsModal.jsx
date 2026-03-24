/**
 * File: src/SoftwareApplication/incidentReports/incident_reports_components/IncidentReportsModal.jsx
 * Updated: 2026-02-04
 *
 * Purpose:
 * - Modal form for submitting new incident reports
 * - Handles form validation, image upload, and submission
 * - Manages form state and error messages
 *
 * Changes:
 * - Implemented complete form with all fields matching reference
 * - Added validation with error messages
 * - Added image upload with FileReader (base64 for localStorage)
 * - Added accessibility attributes for form controls
 * - Ensured keyboard navigation and focus management
 *
 * Connected Modules:
 * - IncidentReportsMain.jsx (parent)
 *
 * Dependencies:
 * - react-icons/ri: For Remix Icon set
 * - No additional npm packages (uses native FileReader)
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  RiCloseLine,
  RiErrorWarningLine,
  RiGlobalLine,
  RiImageAddLine,
  RiLockLine,
} from 'react-icons/ri';

const IncidentReportsModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Suspicious Activity',
    severity: 'Medium',
    status: 'Pending',
    location: '',
    date: '',
    time: '',
    image: null,
    visibility: 'public',
    canDelete: true, // New reports can be deleted by the creator
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalRef = useRef(null);
  const firstInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Focus management
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle click outside
  const handleBackdropClick = useCallback(
    (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    },
    [onClose]
  );

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    return newErrors;
  }, [formData]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear error for this field
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    },
    [errors]
  );

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  }, []);

  const removeImage = useCallback(() => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        // Focus the first field with error
        const firstErrorField = Object.keys(validationErrors)[0];
        const errorElement = document.querySelector(
          `[name="${firstErrorField}"]`
        );
        if (errorElement) {
          errorElement.focus();
        }
        return;
      }

      setIsSubmitting(true);

      try {
        // Generate unique ID
        const newReport = {
          ...formData,
          id: `incident_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
        };

        await onSubmit(newReport);

        // Reset form
        setFormData({
          title: '',
          description: '',
          category: 'Suspicious Activity',
          severity: 'Medium',
          status: 'Pending',
          location: '',
          date: '',
          time: '',
          image: null,
          visibility: 'public',
          canDelete: true,
        });
        setImagePreview(null);
        setErrors({});

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error submitting report:', error);
        alert('Failed to submit report. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, onSubmit, validateForm]
  );

  if (!isOpen) return null;

  const categories = [
    'Suspicious Activity',
    'Harassment',
    'Infrastructure Issue',
    'Assault',
    'Stalking',
    'Theft',
    'Vandalism',
    'Other',
  ];

  const severities = ['Low', 'Medium', 'High'];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Submit incident report"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Submit Incident Report
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2"
            aria-label="Close modal"
          >
            <RiCloseLine className="text-xl" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body - Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]"
        >
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                ref={firstInputRef}
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.title ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:border-[#6C63FF] transition-colors`}
                placeholder="Brief title of the incident"
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? 'title-error' : undefined}
              />
              {errors.title && (
                <p
                  id="title-error"
                  className="mt-1 text-xs text-red-500 flex items-center gap-1"
                >
                  <RiErrorWarningLine className="text-xs" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.description ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:border-[#6C63FF] transition-colors resize-none`}
                placeholder="Provide details about the incident..."
                aria-invalid={!!errors.description}
                aria-describedby={
                  errors.description ? 'description-error' : undefined
                }
              />
              {errors.description && (
                <p
                  id="description-error"
                  className="mt-1 text-xs text-red-500 flex items-center gap-1"
                >
                  <RiErrorWarningLine className="text-xs" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Category and Severity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#6C63FF] transition-colors"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="severity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Severity
                </label>
                <select
                  id="severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#6C63FF] transition-colors"
                >
                  {severities.map((sev) => (
                    <option key={sev} value={sev}>
                      {sev}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.location ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:border-[#6C63FF] transition-colors`}
                placeholder="Where did this happen?"
                aria-invalid={!!errors.location}
                aria-describedby={
                  errors.location ? 'location-error' : undefined
                }
              />
              {errors.location && (
                <p
                  id="location-error"
                  className="mt-1 text-xs text-red-500 flex items-center gap-1"
                >
                  <RiErrorWarningLine className="text-xs" />
                  {errors.location}
                </p>
              )}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.date ? 'border-red-500' : 'border-gray-200'
                  } focus:outline-none focus:border-[#6C63FF] transition-colors`}
                  aria-invalid={!!errors.date}
                  aria-describedby={errors.date ? 'date-error' : undefined}
                />
                {errors.date && (
                  <p
                    id="date-error"
                    className="mt-1 text-xs text-red-500 flex items-center gap-1"
                  >
                    <RiErrorWarningLine className="text-xs" />
                    {errors.date}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.time ? 'border-red-500' : 'border-gray-200'
                  } focus:outline-none focus:border-[#6C63FF] transition-colors`}
                  aria-invalid={!!errors.time}
                  aria-describedby={errors.time ? 'time-error' : undefined}
                />
                {errors.time && (
                  <p
                    id="time-error"
                    className="mt-1 text-xs text-red-500 flex items-center gap-1"
                  >
                    <RiErrorWarningLine className="text-xs" />
                    {errors.time}
                  </p>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo Evidence (Optional)
              </label>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[#6C63FF] hover:text-[#6C63FF] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 inline-flex items-center gap-2"
                >
                  <RiImageAddLine aria-hidden="true" />
                  Upload Photo
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-sm text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded px-2 py-1"
                  >
                    Remove
                  </button>
                )}
              </div>
              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-auto rounded-lg object-cover"
                  />
                </div>
              )}
            </div>

            {/* Visibility Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Visibility
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, visibility: 'public' }))
                  }
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    formData.visibility === 'public'
                      ? 'border-[#6C63FF] bg-[#6C63FF]/5 text-[#6C63FF]'
                      : 'border-gray-200 text-gray-600'
                  } transition-colors focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2`}
                >
                  <RiGlobalLine
                    className="mr-2 inline-block"
                    aria-hidden="true"
                  />
                  Public
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, visibility: 'private' }))
                  }
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    formData.visibility === 'private'
                      ? 'border-[#6C63FF] bg-[#6C63FF]/5 text-[#6C63FF]'
                      : 'border-gray-200 text-gray-600'
                  } transition-colors focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2`}
                >
                  <RiLockLine
                    className="mr-2 inline-block"
                    aria-hidden="true"
                  />
                  Private
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-medium transition-colors border-2 border-gray-200 text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg font-medium transition-all duration-300 bg-[#6C63FF] text-white hover:bg-[#5a52e6] shadow-lg shadow-[#6C63FF]/30 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(IncidentReportsModal);
