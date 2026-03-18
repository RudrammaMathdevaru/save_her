/**
 * File: save_her/src/SoftwareApplication/emergency_contact/emergency_contact_components/AddEmergencyContactModal.jsx
 * Updated: 2026-02-04
 *
 * Purpose:
 * - Modal form for adding or editing emergency contacts
 * - Fully responsive with proper keyboard navigation
 * - Includes form validation for required fields
 *
 * Changes:
 * - Added glass effect with backdrop-blur
 * - Used white/95 for semi-transparent background
 * - Preserved all form validation and accessibility
 *
 * Connected Modules:
 * - Used by EmergencyContactMain.jsx
 *
 * Dependencies:
 * - react-icons/ri for close icon
 */

import { useEffect, useRef, useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';

const AddEmergencyContactModal = ({
  isOpen,
  onClose,
  onSave,
  editingContact,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);
  const nameInputRef = useRef(null);

  // Load contact data when editing
  useEffect(() => {
    if (editingContact) {
      setFormData({
        name: editingContact.name || '',
        relationship: editingContact.relationship || '',
        phone: editingContact.phone || '',
      });
    } else {
      setFormData({ name: '', relationship: '', phone: '' });
    }
    setErrors({});
  }, [editingContact, isOpen]);

  // Focus trap and auto-focus on name input
  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      nameInputRef.current.focus();
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

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.relationship.trim()) {
      newErrors.relationship = 'Relationship is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50 overflow-y-auto"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
            {editingContact
              ? 'Edit Emergency Contact'
              : 'Add Emergency Contact'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <RiCloseLine className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                ref={nameInputRef}
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 text-sm focus:outline-none ${
                  errors.name
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:border-[#6C63FF]'
                }`}
                placeholder="Enter contact name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Relationship Field */}
            <div>
              <label
                htmlFor="relationship"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Relationship <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="relationship"
                name="relationship"
                value={formData.relationship}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 text-sm focus:outline-none ${
                  errors.relationship
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:border-[#6C63FF]'
                }`}
                placeholder="e.g., Sister, Friend, Doctor"
                aria-invalid={!!errors.relationship}
                aria-describedby={
                  errors.relationship ? 'relationship-error' : undefined
                }
              />
              {errors.relationship && (
                <p
                  id="relationship-error"
                  className="mt-1 text-sm text-red-500"
                >
                  {errors.relationship}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 text-sm focus:outline-none ${
                  errors.phone
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:border-[#6C63FF]'
                }`}
                placeholder="+1 (555) 000-0000"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone && (
                <p id="phone-error" className="mt-1 text-sm text-red-500">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap cursor-pointer border-2 border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF] hover:text-white flex-1 order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-[#6C63FF] text-white hover:bg-[#5a52e6] shadow-lg shadow-[#6C63FF]/30 flex-1 order-1 sm:order-2"
                disabled={
                  !formData.name.trim() ||
                  !formData.relationship.trim() ||
                  !formData.phone.trim()
                }
              >
                {editingContact ? 'Update Contact' : 'Add Contact'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmergencyContactModal;
