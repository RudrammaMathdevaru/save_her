/**
 * File: save_her/src/SoftwareApplication/dashboard/dashboard_components/EmergencyContact.jsx
 * Updated: 2026-02-04
 *
 * Purpose:
 * - Displays list of emergency contacts with call functionality
 * - Shows contact name and relationship category
 *
 * Changes:
 * - Added sample contact data
 * - Implemented call buttons with tel: links
 * - Used consistent design with avatar and contact info
 *
 * Connected Modules:
 * - Used in DashboardMain.jsx as part of right column
 *
 * Dependencies:
 * - react-icons/ri for user and phone icons
 */

import { RiPhoneLine, RiUserLine } from 'react-icons/ri';

const EmergencyContact = () => {
  const contacts = [
    {
      id: 1,
      name: 'Mom',
      relationship: 'Family',
      phone: '+1 234-567-8901',
    },
    {
      id: 2,
      name: 'Best Friend',
      relationship: 'Friend',
      phone: '+1 234-567-8902',
    },
  ];

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Emergency Contacts
        </h2>
        <a
          href="/contacts"
          className="text-sm font-medium text-[#6C63FF] hover:text-[#5a52e6] transition-colors"
        >
          Manage
        </a>
      </div>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5">
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#6C63FF]/10 rounded-full flex items-center justify-center">
                  <RiUserLine className="text-[#6C63FF]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {contact.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {contact.relationship}
                  </p>
                </div>
              </div>
              <a
                href={`tel:${contact.phone}`}
                className="p-2 text-[#6C63FF] hover:bg-[#6C63FF]/10 rounded-lg transition-colors"
                aria-label={`Call ${contact.name}`}
              >
                <RiPhoneLine className="text-lg" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmergencyContact;
