/**
 * File: save_her/src/SoftwareApplication/dashboard/dashboard_components/SosHistory.jsx
 * Updated: 2026-02-04
 *
 * Purpose:
 * - Displays recent SOS emergency alerts with status
 * - Shows location and timestamp for each alert
 *
 * Changes:
 * - Added sample SOS history data
 * - Implemented consistent card design with status badges
 * - Used red color scheme for SOS icon
 *
 * Connected Modules:
 * - Used in DashboardMain.jsx as part of right column
 *
 * Dependencies:
 * - react-icons/ri for alarm icon
 */

import { RiAlarmWarningLine } from 'react-icons/ri';

const SosHistory = () => {
  const sosHistory = [
    {
      id: 1,
      title: 'Emergency SOS',
      date: '2026-01-15 14:30',
      location: 'Central Park, NYC',
      status: 'Resolved',
      statusColor: 'green',
    },
    {
      id: 2,
      title: 'Emergency SOS',
      date: '2026-01-10 09:15',
      location: 'Downtown Subway',
      status: 'Resolved',
      statusColor: 'green',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900">SOS History</h2>
        <a
          href="/sos-history"
          className="text-sm font-medium text-[#6C63FF] hover:text-[#5a52e6] transition-colors"
        >
          View All
        </a>
      </div>
      <div className="space-y-4">
        {sosHistory.map((sos) => (
          <div
            key={sos.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5"
          >
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <RiAlarmWarningLine className="text-[#FF4D4D]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">{sos.title}</p>
                <p className="text-xs text-gray-500 mt-1">{sos.date}</p>
                <p className="text-xs text-gray-400 mt-1 truncate">
                  {sos.location}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-green-100 text-green-700`}
              >
                {sos.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SosHistory;
