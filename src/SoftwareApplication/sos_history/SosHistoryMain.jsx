/**
 * File: src/SoftwareApplication/sos_history/SosHistoryMain.jsx
 * Updated: 2026-03-23
 *
 * Purpose:
 * - Main container for SOS history page
 * - Fetches real SOS history from backend MySQL via API
 * - Passes data to SOSCards and SOSHistoryTable
 *
 * Changes:
 * - No changes required - component is working correctly
 * - Audio playback fix isolated to SOSHistoryTable component
 *
 * Connected Modules:
 * - SOSCards.jsx (stats from real data)
 * - SOSHistoryTable.jsx (table from real data)
 * - src/services/sos.service.js (frontend API call)
 *
 * Dependencies:
 * - react: hooks
 * - react-icons/ri: Loading spinner
 */

import { useCallback, useEffect, useState } from 'react';
import { RiLoader4Line } from 'react-icons/ri';
import { getSOSHistory } from '../../services/sos.service.js';
import SOSCards from './sos_history_components/SOSCards';
import SOSHistoryTable from './sos_history_components/SOSHistoryTable';

const SosHistoryMain = () => {
  const [sosHistory, setSosHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const history = await getSOSHistory();
      setSosHistory(history);
    } catch (err) {
      setError(err.message || 'Failed to load SOS history');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <RiLoader4Line
          className="text-4xl text-[#6C63FF] animate-spin"
          aria-label="Loading SOS history"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-8xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            SOS History
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            View your past emergency alerts and their status
          </p>
        </div>

        <SOSCards sosHistory={sosHistory} />

        <div className="mt-6 sm:mt-8">
          <SOSHistoryTable sosHistory={sosHistory} />
        </div>
      </div>
    </div>
  );
};

export default SosHistoryMain;
