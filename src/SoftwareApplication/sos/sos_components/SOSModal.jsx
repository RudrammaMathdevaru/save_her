/**
 * File: src/SoftwareApplication/sos/sos_components/SOSModal.jsx
 * Updated: 2026-03-23
 *
 * Purpose:
 * - Modal shown after recording completes
 * - Shows saved emergency contacts for selection
 * - Allows manual email and phone entry
 * - Submits selected recipients to trigger SOS
 *
 * Changes:
 * - Created for SOS module
 *
 * Connected Modules:
 * - Used by SOSButton.jsx
 * - Calls getAllContacts from emergencyContact.service.js
 *
 * Dependencies:
 * - react-icons/ri: Icons throughout modal
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  RiAddLine,
  RiAlarmWarningFill,
  RiCloseLine,
  RiLoader4Line,
  RiMailLine,
  RiPhoneLine,
  RiUserLine,
} from 'react-icons/ri';
import { getAllContacts } from '../../../services/emergencyContact.service.js';

const SOSModal = ({ isOpen, onClose, onSend, isSending }) => {
  const [savedContacts, setSavedContacts] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [manualEmail, setManualEmail] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualName, setManualName] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [error, setError] = useState('');
  const firstFocusRef = useRef(null);

  // Load saved emergency contacts
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    const fetchContacts = async () => {
      try {
        setLoadingContacts(true);
        const contacts = await getAllContacts();
        if (!cancelled) {
          setSavedContacts(contacts);
        }
      } catch {
        if (!cancelled) {
          setSavedContacts([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingContacts(false);
        }
      }
    };

    fetchContacts();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  // Auto-focus first element when modal opens
  useEffect(() => {
    if (isOpen && firstFocusRef.current) {
      firstFocusRef.current.focus();
    }
  }, [isOpen]);

  // Escape key closes modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !isSending) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, isSending]);

  const toggleContact = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleManualPhoneChange = useCallback((e) => {
    // Digits, +, -, spaces only
    const cleaned = e.target.value.replace(/[^\d\s\+\-\(\)]/g, '');
    setManualPhone(cleaned);
  }, []);

  const handleSend = useCallback(() => {
    setError('');

    // Build recipients list from selected saved contacts
    const recipients = savedContacts
      .filter((c) => selectedIds.has(c.id))
      .map((c) => ({
        name: c.name,
        phone: c.phone || '',
        email: '',
      }));

    // Add manual entry if filled
    if (manualName.trim() || manualEmail.trim() || manualPhone.trim()) {
      if (!manualName.trim()) {
        setError('Please enter a name for the manual contact');
        return;
      }
      if (!manualEmail.trim() && !manualPhone.trim()) {
        setError('Please enter at least an email or phone for the manual contact');
        return;
      }
      recipients.push({
        name: manualName.trim(),
        phone: manualPhone.trim(),
        email: manualEmail.trim(),
      });
    }

    if (recipients.length === 0) {
      setError('Please select at least one contact or fill in the manual entry');
      return;
    }

    onSend(recipients);
  }, [savedContacts, selectedIds, manualName, manualEmail, manualPhone, onSend]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(6px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSending) onClose();
      }}
      role="presentation"
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sos-modal-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RiAlarmWarningFill
              className="text-white text-2xl"
              aria-hidden="true"
            />
            <div>
              <h2
                id="sos-modal-title"
                className="text-white font-bold text-lg"
              >
                Send SOS Alert
              </h2>
              <p className="text-red-100 text-xs">
                Select who to notify immediately
              </p>
            </div>
          </div>
          <button
            ref={firstFocusRef}
            onClick={onClose}
            disabled={isSending}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600"
            aria-label="Close modal"
          >
            <RiCloseLine className="text-xl" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Saved Contacts Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <RiUserLine aria-hidden="true" />
              Your Emergency Contacts
            </h3>

            {loadingContacts ? (
              <div className="flex items-center justify-center py-6">
                <RiLoader4Line
                  className="text-2xl text-red-500 animate-spin"
                  aria-label="Loading contacts"
                />
              </div>
            ) : savedContacts.length === 0 ? (
              <p className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4 text-center">
                No saved contacts found. Use the manual entry below.
              </p>
            ) : (
              <div className="space-y-2">
                {savedContacts.map((contact) => {
                  const isSelected = selectedIds.has(contact.id);
                  return (
                    <button
                      key={contact.id}
                      onClick={() => toggleContact(contact.id)}
                      disabled={isSending}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isSelected
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                      aria-pressed={isSelected}
                      aria-label={`${isSelected ? 'Deselect' : 'Select'} ${contact.name}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-red-500 bg-red-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {contact.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {contact.relationship} · {contact.phone}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Manual Entry Section */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <RiAddLine aria-hidden="true" />
              Add Manually
            </h3>

            <div className="space-y-3">
              <div>
                <label
                  htmlFor="manualName"
                  className="block text-xs font-medium text-gray-600 mb-1"
                >
                  Name
                </label>
                <input
                  id="manualName"
                  type="text"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  disabled={isSending}
                  placeholder="Contact name"
                  className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="manualEmail"
                  className="block text-xs font-medium text-gray-600 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <RiMailLine
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                  />
                  <input
                    id="manualEmail"
                    type="email"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    disabled={isSending}
                    placeholder="emergency@email.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="manualPhone"
                  className="block text-xs font-medium text-gray-600 mb-1"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <RiPhoneLine
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                  />
                  <input
                    id="manualPhone"
                    type="tel"
                    inputMode="numeric"
                    value={manualPhone}
                    onChange={handleManualPhoneChange}
                    disabled={isSending}
                    placeholder="+91 9876543210"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p
              className="mt-4 text-sm text-red-600 bg-red-50 rounded-xl p-3"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            className="flex-1 px-6 py-3 rounded-xl font-medium border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={isSending}
            className="flex-1 px-6 py-3 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center gap-2 text-sm shadow-lg shadow-red-500/30"
          >
            {isSending ? (
              <>
                <RiLoader4Line
                  className="animate-spin"
                  aria-hidden="true"
                />
                Sending Alert...
              </>
            ) : (
              <>
                <RiAlarmWarningFill aria-hidden="true" />
                Send SOS Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SOSModal;