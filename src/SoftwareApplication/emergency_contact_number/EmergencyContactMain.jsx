/**
 * File: save_her/src/SoftwareApplication/emergency_contact/EmergencyContactMain.jsx
 * Updated: 2026-02-04
 *
 * Purpose:
 * - Main container for emergency contacts feature
 * - Manages contacts state and modal visibility (add/edit/delete)
 * - Handles localStorage persistence
 *
 * Changes:
 * - Added delete modal state management
 * - Replaced window.confirm with custom delete modal
 * - Preserved exact layout from reference
 * - Added proper body scroll locking
 *
 * Connected Modules:
 * - AllEmergencyContactCards (displays contacts)
 * - AddEmergencyContactModal (add/edit form)
 * - DeleteEmergencyContactModal (delete confirmation)
 *
 * Dependencies:
 * - react-icons/ri for all icons
 * - localStorage for data persistence (API-ready)
 */

import { useEffect, useState } from 'react';
import { RiAddLine } from 'react-icons/ri';
import AddEmergencyContactModal from './emergency_contact_components/AddEmergencyContactModal';
import AllEmergencyContactCards from './emergency_contact_components/AllEmergencyContactCards';
import DeleteEmergencyContactModal from './emergency_contact_components/DeleteEmergencyContactModal';

const STORAGE_KEY = 'emergency_contacts';

const EmergencyContactMain = () => {
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [deletingContact, setDeletingContact] = useState(null);

  // Load contacts from localStorage on mount
  useEffect(() => {
    const storedContacts = localStorage.getItem(STORAGE_KEY);
    if (storedContacts) {
      try {
        setContacts(JSON.parse(storedContacts));
      } catch (error) {
        console.error('Failed to parse stored contacts:', error);
        setContacts([]);
      }
    }
  }, []);

  // Save contacts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

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

  const handleAddContact = (contactData) => {
    const newContact = {
      ...contactData,
      id: Date.now().toString(), // Simple unique ID
    };
    setContacts([...contacts, newContact]);
    setIsModalOpen(false);
  };

  const handleEditContact = (contactData) => {
    const updatedContacts = contacts.map((contact) =>
      contact.id === editingContact.id
        ? { ...contactData, id: contact.id }
        : contact
    );
    setContacts(updatedContacts);
    setEditingContact(null);
    setIsModalOpen(false);
  };

  const handleDeleteContact = () => {
    if (deletingContact) {
      setContacts(
        contacts.filter((contact) => contact.id !== deletingContact.id)
      );
      setDeletingContact(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleEditClick = (contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (contact) => {
    setDeletingContact(contact);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingContact(null);
  };

  return (
    <div className="">
      <div className="max-w-8xl ">
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
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-[#6C63FF] text-white hover:bg-[#5a52e6] shadow-lg shadow-[#6C63FF]/30 w-full sm:w-auto flex items-center justify-center"
            aria-label="Add new emergency contact"
          >
            <RiAddLine className="mr-2 text-xl" />
            Add Contact
          </button>
        </div>

        {/* Contacts Grid */}
        <AllEmergencyContactCards
          contacts={contacts}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />

        {/* Add/Edit Modal */}
        <AddEmergencyContactModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={editingContact ? handleEditContact : handleAddContact}
          editingContact={editingContact}
        />

        {/* Delete Confirmation Modal */}
        <DeleteEmergencyContactModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteContact}
          contactName={deletingContact?.name}
          contactPhone={deletingContact?.phone}
        />
      </div>
    </div>
  );
};

export default EmergencyContactMain;
