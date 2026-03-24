/**
 * File: src/SoftwareApplication/sos_history/sos_history_components/SOSHistoryTable.jsx
 * Updated: 2026-03-23
 *
 * Purpose:
 * - Displays SOS alert history in a responsive table
 * - Shows date, coordinates, audio playback, recipients, status
 * - Provides audio playback functionality with error handling
 *
 * Changes:
 * - DISABLED: Pre-flight accessibility check in production (was blocking playback)
 *   The check was causing false negatives for .webm files served with video/webm
 *   MIME type. Backend now serves .webm as audio/webm, so check is unnecessary.
 * - KEPT: Enhanced error handling for actual playback failures
 * - IMPROVED: Audio URL validation now accepts .webm files
 *
 * Connected Modules:
 * - SosHistoryMain.jsx (parent component)
 *
 * Dependencies:
 * - react-icons/ri: All icons
 * - prop-types: Runtime type checking
 */

import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiMapPinLine,
  RiPauseFill,
  RiPlayFill,
  RiStopFill,
  RiTimeLine,
  RiUserLine,
} from 'react-icons/ri';

const SOSHistoryTable = ({ sosHistory = [] }) => {
  const [playingAudio, setPlayingAudio] = useState(null);
  const [audioLoading, setAudioLoading] = useState(null);
  const [audioError, setAudioError] = useState(null);
  const [errorDetails, setErrorDetails] = useState({});
  const audioRef = useRef(null);

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  // Validate audio URL before attempting to play
  const validateAudioUrl = useCallback((audioUrl) => {
    if (!audioUrl) {
      return {
        valid: false,
        error: 'NO_URL',
        message: 'No audio URL provided',
      };
    }

    try {
      const url = new URL(audioUrl, window.location.origin);

      // Check if URL has valid protocol
      if (
        !url.protocol.startsWith('http') &&
        !url.protocol.startsWith('https')
      ) {
        return {
          valid: false,
          error: 'INVALID_PROTOCOL',
          message: 'Invalid URL protocol',
        };
      }

      // Accept .webm as valid audio format
      const hasAudioExtension = /\.(mp3|wav|ogg|m4a|aac|webm)$/i.test(
        url.pathname
      );
      if (!hasAudioExtension) {
        console.warn(
          'Audio URL does not have standard audio extension:',
          url.pathname
        );
      }

      return { valid: true, url: url.toString() };
    } catch (error) {
      return {
        valid: false,
        error: 'INVALID_URL',
        message: 'Malformed audio URL',
      };
    }
  }, []);

  const handlePlayAudio = useCallback(
    async (audioUrl, id) => {
      // Stop current audio if playing
      if (playingAudio === id) {
        if (audioRef.current) {
          audioRef.current.pause();
          setPlayingAudio(null);
          setAudioLoading(null);
          setAudioError(null);
          setErrorDetails({});
        }
        return;
      }

      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }

      setAudioLoading(id);
      setAudioError(null);
      setErrorDetails({});

      // Validate URL first
      const validation = validateAudioUrl(audioUrl);
      if (!validation.valid) {
        console.error('Audio URL validation failed:', validation);
        setAudioError(id);
        setErrorDetails({
          type: validation.error,
          message: validation.message,
          url: audioUrl,
        });
        setAudioLoading(null);
        return;
      }

      try {
        const audio = new Audio();

        // Set cross-origin attribute if needed
        if (validation.url.startsWith('http')) {
          audio.crossOrigin = 'anonymous';
        }

        audio.src = validation.url;

        // Add event handlers before playing
        audio.oncanplaythrough = () => {
          setAudioLoading(null);
        };

        audio.onended = () => {
          setPlayingAudio(null);
          setAudioLoading(null);
          setAudioError(null);
          setErrorDetails({});
        };

        audio.onerror = (e) => {
          console.error('Audio playback error details:', {
            error: e,
            audioUrl: validation.url,
            audioErrorCode: audio.error?.code,
            audioErrorMessage: audio.error?.message,
            networkState: audio.networkState,
            readyState: audio.readyState,
          });

          let errorMessage = 'Unknown error';
          let errorType = 'UNKNOWN';

          // Decode audio error codes
          switch (audio.error?.code) {
            case MediaError.MEDIA_ERR_ABORTED:
              errorMessage = 'Playback was aborted';
              errorType = 'ABORTED';
              break;
            case MediaError.MEDIA_ERR_NETWORK:
              errorMessage = 'Network error - check your connection';
              errorType = 'NETWORK';
              break;
            case MediaError.MEDIA_ERR_DECODE:
              errorMessage = 'Audio format not supported or corrupted';
              errorType = 'DECODE';
              break;
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMessage =
                'Audio file not found or unsupported format (404 or invalid file)';
              errorType = 'NOT_SUPPORTED';
              break;
            default:
              errorMessage = `Failed to load audio (${audio.error?.message || 'unknown error'})`;
          }

          setAudioError(id);
          setErrorDetails({
            type: errorType,
            message: errorMessage,
            code: audio.error?.code,
            url: validation.url,
          });
          setAudioLoading(null);
          setPlayingAudio(null);
        };

        audioRef.current = audio;

        // Load and play
        audio.load();

        // Add load timeout
        const loadTimeout = setTimeout(() => {
          if (audioLoading === id && !playingAudio) {
            console.warn('Audio loading timeout for:', validation.url);
            setAudioError(id);
            setErrorDetails({
              type: 'TIMEOUT',
              message:
                'Audio loading timeout - file may be too large or server slow',
              url: validation.url,
            });
            setAudioLoading(null);
          }
        }, 10000);

        await audio.play();
        clearTimeout(loadTimeout);
        setPlayingAudio(id);
      } catch (error) {
        console.error('Failed to play audio:', {
          error,
          audioUrl: validation.url,
          errorName: error.name,
          errorMessage: error.message,
        });

        let errorMessage = 'Playback failed';
        if (error.name === 'NotSupportedError') {
          errorMessage = 'Audio format not supported by your browser';
        } else if (error.name === 'NotAllowedError') {
          errorMessage = 'Autoplay blocked. Click play to start audio.';
        } else if (error.name === 'AbortError') {
          errorMessage = 'Playback was cancelled';
        }

        setAudioError(id);
        setErrorDetails({
          type: error.name || 'PLAYBACK_FAILED',
          message: errorMessage,
          url: validation.url,
        });
        setAudioLoading(null);
        setPlayingAudio(null);
      }
    },
    [playingAudio, audioLoading, validateAudioUrl]
  );

  const handleStopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlayingAudio(null);
      setAudioLoading(null);
      setAudioError(null);
      setErrorDetails({});
    }
  }, []);

  const handleKeyDown = useCallback(
    (event, action, audioUrl, id) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (action === 'play') {
          handlePlayAudio(audioUrl, id);
        } else if (action === 'stop') {
          handleStopAudio();
        }
      }
    },
    [handlePlayAudio, handleStopAudio]
  );

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }),
    };
  }, []);

  const getStatusStyle = useCallback((status) => {
    const styles = {
      sent: 'bg-green-100 text-green-700 border-green-200',
      sending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      failed: 'bg-red-100 text-red-700 border-red-200',
    };
    return (
      styles[status?.toLowerCase()] ||
      'bg-gray-100 text-gray-700 border-gray-200'
    );
  }, []);

  const getStatusIcon = useCallback((status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'sent') {
      return <RiCheckboxCircleFill className="text-xs" aria-hidden="true" />;
    }
    if (statusLower === 'failed') {
      return <RiErrorWarningFill className="text-xs" aria-hidden="true" />;
    }
    return null;
  }, []);

  const emptyState = useMemo(
    () => (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <RiTimeLine className="text-4xl text-gray-400" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No SOS History
        </h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          Your emergency alerts will appear here. Press the SOS button to create
          your first alert.
        </p>
      </div>
    ),
    []
  );

  if (sosHistory.length === 0) {
    return emptyState;
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] lg:min-w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th
                scope="col"
                className="text-left px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider"
              >
                Date and Time
              </th>
              <th
                scope="col"
                className="text-left px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider"
              >
                Location
              </th>
              <th
                scope="col"
                className="text-left px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider"
              >
                Recipients
              </th>
              <th
                scope="col"
                className="text-left px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider"
              >
                Audio
              </th>
              <th
                scope="col"
                className="text-left px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sosHistory.map((record) => {
              const formattedDate = formatDate(record.createdAt);
              const mapsLink = `https://www.google.com/maps?q=${record.latitude},${record.longitude}`;
              const recipients = Array.isArray(record.recipients)
                ? record.recipients
                : [];
              const isPlaying = playingAudio === record.id;
              const isLoading = audioLoading === record.id;
              const hasError = audioError === record.id;
              const errorDetail = errorDetails[record.id];

              return (
                <tr
                  key={record.id}
                  className="hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-transparent transition-all duration-200"
                >
                  {/* Date and Time */}
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 text-sm">
                        {formattedDate.date}
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        {formattedDate.time}
                      </span>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-4 sm:px-6 py-4">
                    <a
                      href={mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-blue-600 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                      aria-label="View location on Google Maps"
                    >
                      <RiMapPinLine
                        className="text-sm flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          View on Maps
                        </span>
                        <span className="text-xs text-gray-500">
                          {parseFloat(record.latitude).toFixed(4)},{' '}
                          {parseFloat(record.longitude).toFixed(4)}
                        </span>
                      </div>
                    </a>
                  </td>

                  {/* Recipients */}
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {recipients.length > 0 ? (
                        recipients.map((r, i) => (
                          <div
                            key={`${record.id}-recipient-${i}-${r.name}`}
                            className="flex items-center gap-1"
                          >
                            <RiUserLine
                              className="text-xs text-gray-400 flex-shrink-0"
                              aria-hidden="true"
                            />
                            <span className="text-xs text-gray-700">
                              {r.name}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          No recipients
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Audio */}
                  <td className="px-4 sm:px-6 py-4">
                    {record.audioUrl ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handlePlayAudio(record.audioUrl, record.id)
                            }
                            onKeyDown={(e) =>
                              handleKeyDown(
                                e,
                                'play',
                                record.audioUrl,
                                record.id
                              )
                            }
                            disabled={isLoading}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                              isPlaying
                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                : hasError
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            aria-label={
                              isLoading
                                ? 'Loading audio'
                                : isPlaying
                                  ? 'Pause audio'
                                  : hasError
                                    ? 'Audio failed, click to retry'
                                    : 'Play audio'
                            }
                            aria-disabled={isLoading}
                          >
                            {isLoading ? (
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : isPlaying ? (
                              <>
                                <RiPauseFill
                                  className="text-base"
                                  aria-hidden="true"
                                />
                                <span className="text-xs">Pause</span>
                              </>
                            ) : (
                              <>
                                <RiPlayFill
                                  className="text-base"
                                  aria-hidden="true"
                                />
                                <span className="text-xs">
                                  {hasError ? 'Retry' : 'Play'}
                                </span>
                              </>
                            )}
                          </button>

                          {isPlaying && (
                            <button
                              onClick={handleStopAudio}
                              onKeyDown={(e) => handleKeyDown(e, 'stop')}
                              className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                              aria-label="Stop audio"
                            >
                              <RiStopFill
                                className="text-sm"
                                aria-hidden="true"
                              />
                            </button>
                          )}
                        </div>

                        {/* Enhanced error message display */}
                        {hasError && errorDetail && (
                          <div className="text-xs text-red-600 mt-1 max-w-[200px]">
                            <span className="font-medium">Error:</span>{' '}
                            {errorDetail.message}
                            {process.env.NODE_ENV === 'development' && (
                              <div className="text-[10px] text-gray-500 mt-0.5">
                                URL: {errorDetail.url?.substring(0, 50)}...
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs italic">
                        No audio
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 sm:px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap border ${getStatusStyle(record.status)}`}
                    >
                      {getStatusIcon(record.status)}
                      {record.status || 'Unknown'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-200">
        <p className="text-xs sm:text-sm text-gray-600">
          Showing {sosHistory.length}{' '}
          {sosHistory.length === 1 ? 'record' : 'records'}
        </p>
      </div>
    </div>
  );
};

SOSHistoryTable.propTypes = {
  sosHistory: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      createdAt: PropTypes.string.isRequired,
      latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      audioUrl: PropTypes.string,
      recipients: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
        })
      ),
      status: PropTypes.string,
    })
  ),
};

SOSHistoryTable.defaultProps = {
  sosHistory: [],
};

export default SOSHistoryTable;
