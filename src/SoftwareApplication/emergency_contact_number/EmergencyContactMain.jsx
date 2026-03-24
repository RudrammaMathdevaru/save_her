/**
 * File: src/SoftwareApplication/emergency_contact/EmergencyContactMain.jsx
 * Updated: 2026-03-23
 *
 * Purpose:
 * - Main container for emergency contacts feature
 * - Fetches contacts from backend API on mount
 * - Handles add, edit, delete via API calls
 * - Shows loading and error states
 *
 * Changes:
 * - Replaced all localStorage logic with real API calls
 * - Added loading state on initial fetch
 * - Added per-action loading states (saving, deleting)
 * - Added error display for API failures
 * - onAddClick prop passed to AllEmergencyContactCards to fix
 *   the DOM querySelector hack in the empty state button
 *
 * Connected Modules:
 * - AllEmergencyContactCards.jsx
 * - AddEmergencyContactModal.jsx
 * - DeleteEmergencyContactModal.jsx
 * - emergencyContact.service.js (frontend)
 *
 * Dependencies:
 * - react-icons/ri: Add icon
 */

import { useCallback, useEffect, useState } from 'react';
import { RiAddLine, RiLoader4Line } from 'react-icons/ri';
import {
  createContact,
  deleteContact,
  getAllContacts,
  updateContact,
} from '../../services/emergencyContact.service.js';
import AddEmergencyContactModal from './emergency_contact_components/AddEmergencyContactModal';
import AllEmergencyContactCards from './emergency_contact_components/AllEmergencyContactCards';
import DeleteEmergencyContactModal from './emergency_contact_components/DeleteEmergencyContactModal';

const EmergencyContactMain = () => {
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [deletingContact, setDeletingContact] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  // Fetch all contacts on mount
  useEffect(() => {
    let cancelled = false;

    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await getAllContacts();
        if (!cancelled) {
          setContacts(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load contacts');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchContacts();

    return () => {
      cancelled = true;
    };
  }, []);

  // Prevent body scroll when any modal is open
  useEffect(() => {
    if (isModalOpen || isDeleteModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, isDeleteModalOpen]);

  const handleAddContact = useCallback(async (formData) => {
    setIsSaving(true);
    setError('');

    try {
      const newContact = await createContact(formData);
      setContacts((prev) => [newContact, ...prev]);
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to add contact');
    } finally {
      setIsSaving(false);
    }
  }, []);

  const handleEditContact = useCallback(
    async (formData) => {
      if (!editingContact) return;

      setIsSaving(true);
      setError('');

      try {
        const updated = await updateContact(editingContact.id, formData);
        setContacts((prev) =>
          prev.map((c) => (c.id === editingContact.id ? updated : c))
        );
        setEditingContact(null);
        setIsModalOpen(false);
      } catch (err) {
        setError(err.message || 'Failed to update contact');
      } finally {
        setIsSaving(false);
      }
    },
    [editingContact]
  );

  const handleDeleteContact = useCallback(async () => {
    if (!deletingContact) return;

    setIsDeleting(true);
    setError('');

    try {
      await deleteContact(deletingContact.id);
      setContacts((prev) => prev.filter((c) => c.id !== deletingContact.id));
      setDeletingContact(null);
      setIsDeleteModalOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to delete contact');
    } finally {
      setIsDeleting(false);
    }
  }, [deletingContact]);

  const handleEditClick = useCallback((contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((contact) => {
    setDeletingContact(contact);
    setIsDeleteModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingContact(null);
    setError('');
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setDeletingContact(null);
    setError('');
  }, []);

  const handleOpenAddModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  return (
    <div className="">
      <div className="max-w-8xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Emergency Contacts
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your trusted emergency contacts
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-[#6C63FF] text-white hover:bg-[#5a52e6] shadow-lg shadow-[#6C63FF]/30 w-full sm:w-auto flex items-center justify-center"
            aria-label="Add new emergency contact"
          >
            <RiAddLine className="mr-2 text-xl" aria-hidden="true" />
            Add Contact
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <RiLoader4Line
              className="text-4xl text-[#6C63FF] animate-spin"
              aria-label="Loading contacts"
            />
          </div>
        ) : (
          <AllEmergencyContactCards
            contacts={contacts}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onAddClick={handleOpenAddModal}
          />
        )}

        {/* Add/Edit Modal */}
        <AddEmergencyContactModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={editingContact ? handleEditContact : handleAddContact}
          editingContact={editingContact}
          isSaving={isSaving}
        />

        {/* Delete Confirmation Modal */}
        <DeleteEmergencyContactModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteContact}
          contactName={deletingContact?.name}
          contactPhone={deletingContact?.phone}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
};

export default EmergencyContactMain;
