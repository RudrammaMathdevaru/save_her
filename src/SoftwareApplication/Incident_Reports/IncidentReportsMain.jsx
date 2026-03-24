/**
 * File: src/SoftwareApplication/incidentReports/IncidentReportsMain.jsx
 * Updated: 2026-02-04
 *
 * Purpose:
 * - Main container component for the incident reports page
 * - Manages state for reports and modal visibility
 * - Handles all localStorage operations for CRUD functionality
 *
 * Changes:
 * - Implemented complete incident reports feature with localStorage
 * - Added modal state management for report submission
 * - Integrated child components with proper props
 * - Added error handling for localStorage operations
 *
 * Connected Modules:
 * - IncidentReportsCard.jsx (displays reports grid)
 * - IncidentReportsModal.jsx (form for new reports)
 *
 * Dependencies:
 * - React: Core library
 * - react-icons/ri: For Remix Icon set
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RiAddLine } from 'react-icons/ri';
import IncidentReportsCard from './incident_reports_components/IncidentReportsCard';
import IncidentReportsModal from './incident_reports_components/IncidentReportsModal';

// Local storage key
const STORAGE_KEY = 'incident_reports';

const IncidentReportsMain = () => {
  const [reports, setReports] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load reports from localStorage on mount
  useEffect(() => {
    loadReports();
  }, []);

  // Save reports to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && reports.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
      } catch (error) {
        console.error('Error saving reports to localStorage:', error);
      }
    }
  }, [reports, isLoading]);

  const loadReports = useCallback(() => {
    try {
      const storedReports = localStorage.getItem(STORAGE_KEY);
      if (storedReports) {
        setReports(JSON.parse(storedReports));
      } else {
        // Start with empty array - no mock data
        setReports([]);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      }
    } catch (error) {
      console.error('Error loading reports from localStorage:', error);
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAddReport = useCallback((newReport) => {
    setReports((prevReports) => {
      const updatedReports = [newReport, ...prevReports];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReports));
      } catch (error) {
        console.error('Error saving report:', error);
      }
      return updatedReports;
    });
    setIsModalOpen(false);
  }, []);

  const handleDeleteReport = useCallback((reportId) => {
    if (
      window.confirm(
        'Are you sure you want to delete this report? This action cannot be undone.'
      )
    ) {
      setReports((prevReports) => {
        const updatedReports = prevReports.filter(
          (report) => report.id !== reportId
        );
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReports));
        } catch (error) {
          console.error('Error deleting report:', error);
        }
        return updatedReports;
      });
    }
  }, []);

  // Memoize reports to prevent unnecessary re-renders
  const memoizedReports = useMemo(() => reports, [reports]);

  if (isLoading) {
    return (
      <div className="p-4 lg:p-8 flex justify-center items-center min-h-[400px]">
        <div className="text-gray-500">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Incident Reports
            </h1>
            <p className="text-gray-600 mt-1">
              Report and track safety incidents in your community
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap bg-[#6C63FF] text-white hover:bg-[#5a52e6] shadow-lg shadow-[#6C63FF]/30 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2"
            aria-label="Submit new incident report"
          >
            <RiAddLine className="mr-2 inline-block" aria-hidden="true" />
            Submit Report
          </button>
        </div>

        {/* Reports Grid */}
        <IncidentReportsCard
          reports={memoizedReports}
          onDelete={handleDeleteReport}
        />

        {/* Submit Report Modal */}
        <IncidentReportsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddReport}
        />
      </div>
    </div>
  );
};

export default React.memo(IncidentReportsMain);
