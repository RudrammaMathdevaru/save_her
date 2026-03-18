/**
 * File: src/components/dashboard/dashboard_components/sos_history/SosHistoryMain.jsx
 * Updated: 2026-03-17
 *
 * Purpose:
 * - Main container component for SOS history section
 * - Combines statistics cards and history table
 * - Manages state for SOS history data and updates
 *
 * Changes:
 * - Added state management for SOS history data
 * - Integrated localStorage for data persistence
 * - Added event listener for real-time updates from SOS button
 * - Improved responsiveness and layout structure
 *
 * Connected Modules:
 * - ./sos_history_components/SOSCards.jsx
 * - ./sos_history_components/SosHistory.jsx
 * - ../sos/SOSButton.jsx (via custom event)
 *
 * Dependencies:
 * - react: For state and effects
 * - No additional npm packages required
 */

import { useEffect, useState } from 'react';
import SosHistoryTable from '../sos_history/sos_history_components/SOSHistoryTable';
import SOSCards from '../sos_history/sos_history_components/SOSCards';

const SosHistoryMain = () => {
  const [sosHistory, setSosHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load SOS history from localStorage
  useEffect(() => {
    const loadSOSHistory = () => {
      try {
        const storedHistory = localStorage.getItem('sosHistory');
        if (storedHistory) {
          setSosHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.error('Error loading SOS history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSOSHistory();

    // Listen for updates from SOS button
    const handleSOSUpdate = (event) => {
      setSosHistory(event.detail);
    };

    window.addEventListener('sosHistoryUpdated', handleSOSUpdate);

    return () => {
      window.removeEventListener('sosHistoryUpdated', handleSOSUpdate);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 lg:p-8 flex justify-center items-center min-h-[400px]">
        <div className="animate-pulse text-gray-500">
          Loading SOS history...
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-8xl ">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            SOS History
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            View your past emergency alerts and their status
          </p>
        </div>

        {/* Statistics Cards */}
        <SOSCards sosHistory={sosHistory} />

        {/* History Table */}
        <div className="mt-6 sm:mt-8">
          <SosHistoryTable sosHistory={sosHistory} />
        </div>
      </div>
    </div>
  );
};

export default SosHistoryMain;
