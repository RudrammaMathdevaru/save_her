/**
 * File: src/SoftwareApplication/emergency_contact/emergency_contact_components/AllEmergencyContactCards.jsx
 * Updated: 2026-03-23
 *
 * Purpose:
 * - Display all emergency contacts in a responsive grid
 * - Each card shows name, relationship, phone with call button
 * - Empty state with working Add Contact button
 *
 * Changes:
 * - FIXED: Empty state button now uses onAddClick prop callback
 *   instead of document.querySelector DOM hack which is not React
 * - Added onAddClick to props
 *
 * Connected Modules:
 * - Used by EmergencyContactMain.jsx
 *
 * Dependencies:
 * - react-icons/ri: User, phone, edit, delete icons
 */

import {
  RiAddLine,
  RiDeleteBinLine,
  RiEditLine,
  RiPhoneLine,
  RiUserFill,
} from 'react-icons/ri';

const AllEmergencyContactCards = ({
  contacts = [],
  onEdit,
  onDelete,
  onAddClick,
}) => {
  if (contacts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="w-20 h-20 bg-[#6C63FF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <RiUserFill className="text-3xl text-[#6C63FF]" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Contacts Yet
        </h3>
        <p className="text-gray-600 mb-4">
          Add your first emergency contact to get started
        </p>
        <button
          onClick={onAddClick}
          className="px-6 py-2 rounded-xl font-medium transition-all duration-300 bg-[#6C63FF] text-white hover:bg-[#5a52e6] inline-flex items-center focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2"
          aria-label="Add first emergency contact"
        >
          <RiAddLine className="mr-2" aria-hidden="true" />
          Add Contact
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#6C63FF]/10 flex items-center justify-center flex-shrink-0">
                <RiUserFill
                  className="text-xl text-[#6C63FF]"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                <span className="inline-block px-2 py-0.5 bg-[#6C63FF]/10 text-[#6C63FF] text-xs rounded-full mt-1">
                  {contact.relationship}
                </span>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => onEdit(contact)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#6C63FF] hover:bg-[#6C63FF]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2"
                aria-label={`Edit ${contact.name}`}
              >
                <RiEditLine aria-hidden="true" />
              </button>
              <button
                onClick={() => onDelete(contact)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label={`Delete ${contact.name}`}
              >
                <RiDeleteBinLine aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-2 text-gray-600 hover:text-[#6C63FF] transition-colors"
              aria-label={`Call ${contact.name} at ${contact.phone}`}
            >
              <RiPhoneLine className="text-lg" aria-hidden="true" />
              <span className="text-sm">{contact.phone}</span>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllEmergencyContactCards;
