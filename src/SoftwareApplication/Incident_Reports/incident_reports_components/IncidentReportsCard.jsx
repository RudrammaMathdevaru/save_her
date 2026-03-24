/**
 * File: src/SoftwareApplication/incidentReports/incident_reports_components/IncidentReportsCard.jsx
 * Updated: 2026-02-04
 *
 * Purpose:
 * - Displays grid of incident report cards
 * - Handles rendering of each report with proper styling based on status/severity
 * - Manages delete functionality for each report
 *
 * Changes:
 * - Implemented dynamic card rendering based on report data
 * - Added conditional styling for status and severity badges
 * - Ensured responsive grid layout (1 column on mobile, 2 on desktop)
 * - Added accessibility attributes for cards and interactive elements
 *
 * Connected Modules:
 * - IncidentReportsMain.jsx (parent)
 *
 * Dependencies:
 * - react-icons/ri: For Remix Icon set
 */

import React from 'react';
import { RiCalendarLine, RiDeleteBinLine, RiMapPinLine } from 'react-icons/ri';

const IncidentReportsCard = ({ reports, onDelete }) => {
  if (!reports || reports.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <div className="text-gray-400 mb-2">No incident reports yet</div>
        <p className="text-sm text-gray-500">
          Be the first to submit a safety report for your community.
        </p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category) => {
    return 'bg-gray-100 text-gray-700'; // Consistent gray for categories
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date
        .toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(/\//g, '-');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {reports.map((report) => (
        <article
          key={report.id}
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          {/* Conditional image rendering - only show if image exists */}
          {report.image && (
            <div className="h-40 w-full overflow-hidden">
              <img
                src={report.image}
                alt={report.title}
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
            </div>
          )}

          <div className="p-5">
            {/* Header with ID and Status */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-gray-500">
                    RPT-{report.id?.slice(-4) || '0000'}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {report.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {report.description}
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex-shrink-0">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(report.status)}`}
                >
                  {report.status || 'Pending'}
                </span>
              </div>
            </div>

            {/* Category and Severity Badges */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getCategoryColor(report.category)}`}
              >
                {report.category || 'Uncategorized'}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getSeverityColor(report.severity)}`}
              >
                {report.severity || 'Medium'}
              </span>
            </div>

            {/* Location and Date */}
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <RiMapPinLine
                      className="flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="truncate max-w-[200px] sm:max-w-[300px]">
                      {report.location || 'Location not specified'}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <RiCalendarLine
                      className="flex-shrink-0"
                      aria-hidden="true"
                    />
                    {formatDate(report.date)} at {report.time || '00:00'}
                  </span>
                </div>

                {/* Delete Button - Only show if report has delete permission */}
                {report.canDelete && (
                  <button
                    onClick={() => onDelete(report.id)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                    aria-label={`Delete report ${report.title}`}
                  >
                    <RiDeleteBinLine className="text-lg" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default React.memo(IncidentReportsCard);
