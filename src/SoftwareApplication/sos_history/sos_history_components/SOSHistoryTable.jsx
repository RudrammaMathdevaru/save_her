/**
 * File: src/components/dashboard/dashboard_components/sos_history/SosHistory.jsx
 * Updated: 2026-03-17
 * 
 * Purpose:
 * - Displays SOS history in a responsive table format
 * - Shows date/time, location, duration, audio playback, and status
 * - Handles audio playback for recorded SOS alerts
 * 
 * Changes:
 * - Made component dynamic to receive SOS history data
 * - Added audio playback functionality
 * - Improved responsive design with horizontal scroll on mobile
 * - Enhanced table styling with better visual hierarchy
 * - Added empty state handling
 * 
 * Connected Modules:
 * - ../SosHistoryMain.jsx (parent component)
 * 
 * Dependencies:
 * - react-icons/ri: For consistent iconography
 * - No additional npm packages required
 */

import React, { useState, useRef } from 'react';
import { 
  RiPlayFill, 
  RiPauseFill, 
  RiStopFill,
  RiVolumeUpFill,
  RiMapPinLine,
  RiTimeLine,
  RiCheckboxCircleFill,
  RiErrorWarningFill
} from 'react-icons/ri';

const SosHistory = ({ sosHistory = [] }) => {
  const [playingAudio, setPlayingAudio] = useState(null);
  const audioRef = useRef(null);

  // Handle audio playback
  const handlePlayAudio = (audioUrl, id) => {
    if (playingAudio === id) {
      // Pause current audio
      if (audioRef.current) {
        audioRef.current.pause();
        setPlayingAudio(null);
      }
    } else {
      // Stop any playing audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      // Play new audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setPlayingAudio(null);
      };
      
      audio.play();
      setPlayingAudio(id);
    }
  };

  // Stop audio playback
  const handleStopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlayingAudio(null);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
      })
    };
  };

  // Get status styling
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (sosHistory.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <RiTimeLine className="text-4xl text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No SOS History</h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          Your emergency alerts will appear here. Press the SOS button to create your first alert.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Table Container - Responsive horizontal scroll */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] lg:min-w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="text-left px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Location
              </th>
              <th className="text-left px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Duration
              </th>
              <th className="text-left px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Audio
              </th>
              <th className="text-left px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sosHistory.map((record) => {
              const formattedDate = formatDate(record.timestamp);
              
              return (
                <tr 
                  key={record.id}
                  className="hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-transparent transition-all duration-200 group"
                >
                  {/* Date & Time */}
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 text-sm sm:text-base">
                        {formattedDate.date}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">
                        {formattedDate.time}
                      </span>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-start gap-2">
                      <RiMapPinLine className="text-gray-400 text-sm sm:text-base flex-shrink-0 mt-1" />
                      <div className="flex flex-col">
                        <span className="text-gray-900 text-sm sm:text-base">
                          {record.location?.address || 'Location captured'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {record.location?.coordinates || 'Coordinates unavailable'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Duration */}
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-2">
                      <RiTimeLine className="text-gray-400 text-sm sm:text-base" />
                      <span className="text-gray-900 text-sm sm:text-base font-mono">
                        {record.audioDuration || '0:00'}
                      </span>
                    </div>
                  </td>

                  {/* Audio */}
                  <td className="px-4 sm:px-6 py-4">
                    {record.audioAvailable ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePlayAudio(record.audioBlob, record.id)}
                          className={`
                            flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg
                            transition-all duration-200 transform hover:scale-105
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                            ${playingAudio === record.id 
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                          `}
                          aria-label={playingAudio === record.id ? 'Pause audio' : 'Play audio'}
                        >
                          {playingAudio === record.id ? (
                            <>
                              <RiPauseFill className="text-base sm:text-lg" />
                              <span className="text-xs sm:text-sm">Pause</span>
                            </>
                          ) : (
                            <>
                              <RiPlayFill className="text-base sm:text-lg" />
                              <span className="text-xs sm:text-sm">Play</span>
                            </>
                          )}
                        </button>
                        
                        {playingAudio === record.id && (
                          <button
                            onClick={handleStopAudio}
                            className="p-1 sm:p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                            aria-label="Stop audio"
                          >
                            <RiStopFill className="text-sm sm:text-base" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs sm:text-sm italic">No audio</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`
                      inline-flex items-center gap-1 px-2 sm:px-3 py-1 
                      rounded-full text-xs font-medium whitespace-nowrap
                      border ${getStatusStyle(record.status)}
                    `}>
                      {record.status === 'Delivered' ? (
                        <RiCheckboxCircleFill className="text-xs sm:text-sm" />
                      ) : record.status === 'Failed' ? (
                        <RiErrorWarningFill className="text-xs sm:text-sm" />
                      ) : null}
                      {record.status || 'Unknown'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-200">
        <p className="text-xs sm:text-sm text-gray-600">
          Showing {sosHistory.length} {sosHistory.length === 1 ? 'record' : 'records'}
        </p>
      </div>
    </div>
  );
};

export default SosHistory;