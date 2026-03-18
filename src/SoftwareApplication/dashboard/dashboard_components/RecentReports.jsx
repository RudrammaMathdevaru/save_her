/**
 * File: save_her/src/SoftwareApplication/dashboard/dashboard_components/RecentReports.jsx
 * Updated: 2026-02-04
 *
 * Purpose:
 * - Displays list of recent incident reports with status, location, and date
 * - Shows 3 most recent reports with "View All" link
 *
 * Changes:
 * - Added sample data structure with proper typing
 * - Implemented status badges with color coding
 * - Added location and date icons
 * - Preserved line-clamp for description truncation
 *
 * Connected Modules:
 * - Used in DashboardMain.jsx as left column component
 *
 * Dependencies:
 * - react-icons/ri for location and calendar icons
 */

import { RiCalendarLine, RiMapPinLine } from 'react-icons/ri';

const RecentReports = () => {
  const reports = [
    {
      id: 1,
      title: 'Suspicious Activity Near Central Park',
      description:
        'A group of individuals were observed following women in the Central Park area during evening hours. Multiple witnesses reported the incident.',
      location: 'Central Park, Downtown',
      date: '2024-01-15',
      status: 'approved',
      statusColor: 'green',
    },
    {
      id: 2,
      title: 'Poor Lighting on Main Street',
      description:
        'Several streetlights are not functioning on Main Street between 5th and 8th Avenue, creating unsafe conditions for pedestrians at night.',
      location: 'Main Street, City Center',
      date: '2024-01-14',
      status: 'approved',
      statusColor: 'green',
    },
    {
      id: 3,
      title: 'Harassment Incident at Metro Station',
      description:
        'Verbal harassment reported at the Metro Station platform. Security has been notified and additional patrols have been deployed.',
      location: 'Metro Station, Line 3',
      date: '2024-01-13',
      status: 'approved',
      statusColor: 'green',
    },
  ];

  const getStatusClasses = (status) => {
    const statusMap = {
      approved: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return statusMap[status] || statusMap.approved;
  };

  return (
    <section className="xl:col-span-2">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
        <a
          href="/my-reports"
          className="text-sm font-medium text-[#6C63FF] hover:text-[#5a52e6] transition-colors"
        >
          View All
        </a>
      </div>
      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {report.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {report.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span className="flex items-center">
                    <RiMapPinLine className="mr-1" />
                    {report.location}
                  </span>
                  <span className="flex items-center">
                    <RiCalendarLine className="mr-1" />
                    {report.date}
                  </span>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusClasses(report.status)}`}
              >
                {report.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentReports;
