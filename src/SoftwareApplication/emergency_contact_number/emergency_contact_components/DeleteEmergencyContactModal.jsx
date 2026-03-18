/**
 * File: save_her/src/SoftwareApplication/emergency_contact/emergency_contact_components/DeleteEmergencyContactModal.jsx
 * Updated: 2026-02-04
 *
 * Purpose:
 * - Delete confirmation modal with glass morphism effect
 * - Asks user to confirm before deleting a contact
 * - Shows contact details being deleted
 *
 * Changes:
 * - Added glass effect with backdrop-blur and white/95 background
 * - Implemented keyboard navigation (Escape to cancel)
 * - Added proper accessibility attributes
 * - Made fully responsive
 *
 * Connected Modules:
 * - Used by EmergencyContactMain.jsx for delete confirmations
 *
 * Dependencies:
 * - react-icons/ri for warning and close icons
 */

import { useEffect, useRef } from 'react';
import { RiCloseLine, RiErrorWarningLine } from 'react-icons/ri';

const DeleteEmergencyContactModal = ({
  isOpen,
  onClose,
  onConfirm,
  contactName,
  contactPhone,
}) => {
  const modalRef = useRef(null);
  const cancelButtonRef = useRef(null);

  // Focus trap and auto-focus on cancel button
  useEffect(() => {
    if (isOpen && cancelButtonRef.current) {
      cancelButtonRef.current.focus();
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
        className="relative w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3
            id="delete-modal-title"
            className="text-lg font-semibold text-gray-900"
          >
            Delete Contact
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <RiCloseLine className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <RiErrorWarningLine className="text-2xl text-red-500" />
              </div>
            </div>
            <div className="flex-1">
              <p id="delete-modal-description" className="text-gray-600 mb-2">
                Are you sure you want to delete this contact?
              </p>
              {contactName && (
                <div className="bg-gray-50 rounded-lg p-3 mb-2">
                  <p className="font-medium text-gray-900">{contactName}</p>
                  {contactPhone && (
                    <p className="text-sm text-gray-500 mt-1">{contactPhone}</p>
                  )}
                </div>
              )}
              <p className="text-sm text-gray-500">
                This action cannot be undone.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              ref={cancelButtonRef}
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap cursor-pointer border-2 border-gray-300 text-gray-700 hover:bg-gray-100 flex-1 order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap cursor-pointer bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30 flex-1 order-1 sm:order-2"
              aria-label="Confirm delete"
            >
              Delete Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteEmergencyContactModal;
