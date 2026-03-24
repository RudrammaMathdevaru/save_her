/**
 * File: src/SoftwareApplication/sos/sos_components/SOSButton.jsx
 * Updated: 2026-03-23
 *
 * Purpose:
 * - SOS button with audio recording and GPS capture
 * - Opens SOSModal after recording to select recipients
 * - Sends alert to backend via triggerSOS API
 *
 * Changes:
 * - FIXED: Removed <style jsx> which caused React console error
 *   (styled-jsx is Next.js only, not available in Vite/React)
 *   fadeIn animation moved to index.css
 * - Connected to backend via sos.service.js
 * - Added SOSModal integration after recording completes
 * - Removed localStorage SOS history (now saved in MySQL via API)
 * - All existing recording, location, button animation logic preserved
 *
 * Connected Modules:
 * - SOSModal.jsx (recipient selection)
 * - src/services/sos.service.js (API call)
 *
 * Dependencies:
 * - react-icons/ri: All icons
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  RiAlarmWarningFill,
  RiCheckboxCircleFill,
  RiCheckLine,
  RiErrorWarningFill,
  RiInformationLine,
  RiMapPinLine,
  RiRecordCircleFill,
  RiStopFill,
  RiTimeLine,
  RiVolumeUpLine,
} from 'react-icons/ri';
import { triggerSOS } from '../../../services/sos.service.js';
import SOSModal from './SOSModal.jsx';

const SOSButton = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isLocationCaptured, setIsLocationCaptured] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState('idle');
  const [audioBlob, setAudioBlob] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const buttonRef = useRef(null);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString(),
        });
        setIsLocationCaptured(true);
        setLocationError(null);
      },
      (error) => {
        setLocationError(`Location error: ${error.message}`);
        setIsLocationCaptured(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setRecordingStatus('recording');
      setRecordingTime(0);
      setSendError('');
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setRecordingStatus('recorded');

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 60) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);

      getCurrentLocation();
    } catch (error) {
      console.error('Error starting recording:', error);
      setRecordingStatus('error');
      setIsRecording(false);
    }
  }, [getCurrentLocation]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      setRecordingStatus('processing');
    }
  }, [isRecording]);

  // When recording finishes and blob is ready, open the modal
  useEffect(() => {
    if (recordingStatus === 'recorded' && audioBlob) {
      setShowModal(true);
    }
  }, [recordingStatus, audioBlob]);

  // Send SOS to backend
  const handleSendSOS = useCallback(
    async (recipients) => {
      if (!currentLocation) {
        setSendError('Location not captured. Please try again.');
        return;
      }

      setIsSending(true);
      setSendError('');

      try {
        await triggerSOS({
          audioBlob,
          location: currentLocation,
          recipients,
        });

        setShowModal(false);
        setRecordingStatus('completed');

        // Reset after 4 seconds
        setTimeout(() => {
          setRecordingStatus('idle');
          setAudioBlob(null);
          setCurrentLocation(null);
          setIsLocationCaptured(false);
          setRecordingTime(0);
        }, 4000);
      } catch (error) {
        setSendError(error.message || 'Failed to send SOS. Please try again.');
      } finally {
        setIsSending(false);
      }
    },
    [currentLocation, audioBlob]
  );

  const handleSOSClick = useCallback(() => {
    if (!isRecording && recordingStatus === 'idle') {
      startRecording();
    } else if (isRecording) {
      stopRecording();
    }

    setIsButtonPressed(true);
    setTimeout(() => setIsButtonPressed(false), 200);
  }, [isRecording, recordingStatus, startRecording, stopRecording]);

  const handleCloseModal = useCallback(() => {
    if (!isSending) {
      setShowModal(false);
      setRecordingStatus('idle');
      setAudioBlob(null);
    }
  }, [isSending]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getButtonStyles = () => {
    if (isRecording) {
      return {
        bg: 'bg-gradient-to-br from-red-600 via-red-500 to-red-700',
        shadow: 'shadow-2xl shadow-red-500/50',
        border: 'border-red-400',
        glow: 'ring-4 ring-red-400/50 ring-offset-2 ring-offset-red-50',
      };
    }
    if (recordingStatus === 'completed') {
      return {
        bg: 'bg-gradient-to-br from-green-500 via-green-400 to-green-600',
        shadow: 'shadow-2xl shadow-green-500/40',
        border: 'border-green-300',
        glow: 'ring-4 ring-green-400/50 ring-offset-2 ring-offset-green-50',
      };
    }
    if (recordingStatus === 'error') {
      return {
        bg: 'bg-gradient-to-br from-orange-500 via-orange-400 to-red-500',
        shadow: 'shadow-2xl shadow-orange-500/40',
        border: 'border-orange-300',
        glow: 'ring-4 ring-orange-400/50 ring-offset-2 ring-offset-orange-50',
      };
    }
    return {
      bg: 'bg-gradient-to-br from-red-500 via-red-400 to-red-600',
      shadow: 'shadow-2xl shadow-red-500/30 hover:shadow-red-500/50',
      border: 'border-red-300',
      glow: 'hover:ring-4 hover:ring-red-400/30 ring-offset-2 ring-offset-transparent',
    };
  };

  const buttonStyles = getButtonStyles();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-red-800 to-gray-900 mb-3">
              Emergency SOS
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
              {isRecording
                ? 'Recording in progress. Press stop when safe.'
                : recordingStatus === 'completed'
                  ? 'SOS alert sent successfully to your emergency contacts.'
                  : recordingStatus === 'recorded' ||
                      recordingStatus === 'processing'
                    ? 'Recording complete. Opening contact selector...'
                    : 'Your safety is our priority. Press the SOS button in case of emergency.'}
            </p>
          </div>

          {sendError && (
            <div
              className="max-w-md mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center"
              role="alert"
            >
              {sendError}
            </div>
          )}

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            {/* SOS Button Column */}
            <div className="flex-1 flex justify-center items-center min-h-[400px] lg:min-h-[500px]">
              <div className="relative">
                {/* Pulse rings — idle only */}
                {!isRecording && recordingStatus === 'idle' && (
                  <>
                    <div className="absolute -inset-8 sm:-inset-12 rounded-full bg-red-400/10 animate-ping" />
                    <div className="absolute -inset-6 sm:-inset-8 rounded-full bg-red-400/20 animate-pulse" />
                    <div className="absolute -inset-4 sm:-inset-6 rounded-full bg-red-400/30 animate-pulse" />
                  </>
                )}

                {/* Progress circle — recording */}
                {isRecording && (
                  <svg className="absolute -inset-4 sm:-inset-6 w-[calc(100%+3rem)] h-[calc(100%+3rem)] -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 45}%`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - recordingTime / 60)}%`}
                      className="opacity-30"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 45}%`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - recordingTime / 60)}%`}
                      className="opacity-100 transition-all duration-1000 ease-linear"
                      strokeLinecap="round"
                    />
                  </svg>
                )}

                {/* Main SOS Button */}
                <button
                  ref={buttonRef}
                  onClick={handleSOSClick}
                  onMouseEnter={() => setIsButtonHovered(true)}
                  onMouseLeave={() => {
                    setIsButtonHovered(false);
                    setIsButtonPressed(false);
                  }}
                  onMouseDown={() => setIsButtonPressed(true)}
                  onMouseUp={() => setIsButtonPressed(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setIsButtonPressed(true);
                    }
                  }}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setIsButtonPressed(false);
                    }
                  }}
                  disabled={
                    recordingStatus === 'processing' ||
                    recordingStatus === 'recorded' ||
                    recordingStatus === 'completed'
                  }
                  className={`
                    relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full
                    font-bold text-white text-lg sm:text-xl lg:text-2xl
                    transition-all duration-200 ease-out
                    focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-offset-4
                    disabled:opacity-50 disabled:cursor-not-allowed
                    overflow-hidden group
                    ${buttonStyles.bg}
                    ${buttonStyles.shadow}
                    ${buttonStyles.border}
                    ${buttonStyles.glow}
                    border-2
                  `}
                  aria-label={
                    isRecording ? 'Stop SOS recording' : 'Activate SOS alert'
                  }
                  aria-pressed={isRecording}
                  style={{
                    transform: isButtonPressed
                      ? 'scale(0.95) translateY(4px)'
                      : isButtonHovered
                        ? 'scale(1.05) translateY(-2px)'
                        : 'scale(1) translateY(0)',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-full opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full opacity-60" />
                  <div
                    className={`
                      absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent
                      -skew-x-12 transition-transform duration-700
                      ${isButtonHovered ? 'translate-x-full' : '-translate-x-full'}
                    `}
                  />

                  <div className="relative flex flex-col items-center justify-center h-full z-10">
                    {isRecording ? (
                      <>
                        <div className="relative">
                          <RiStopFill className="text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-3 lg:mb-4 animate-pulse" />
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
                          </span>
                        </div>
                        <span className="text-sm sm:text-base lg:text-lg font-bold tracking-wider">
                          STOP RECORDING
                        </span>
                        <span className="text-xs sm:text-sm mt-2 font-mono bg-black/20 px-2 py-1 rounded-full">
                          {formatTime(recordingTime)} / 1:00
                        </span>
                      </>
                    ) : recordingStatus === 'completed' ? (
                      <>
                        <RiCheckboxCircleFill className="text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-3 lg:mb-4" />
                        <span className="text-sm sm:text-base lg:text-lg font-bold tracking-wider">
                          SOS SENT
                        </span>
                        <span className="text-xs sm:text-sm mt-2 bg-black/20 px-2 py-1 rounded-full">
                          Emergency contacts notified
                        </span>
                      </>
                    ) : recordingStatus === 'error' ? (
                      <>
                        <RiErrorWarningFill className="text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-3 lg:mb-4" />
                        <span className="text-sm sm:text-base lg:text-lg font-bold tracking-wider">
                          ERROR
                        </span>
                        <span className="text-xs sm:text-sm mt-2 bg-black/20 px-2 py-1 rounded-full">
                          Tap to retry
                        </span>
                      </>
                    ) : (
                      <>
                        <RiAlarmWarningFill className="text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-3 lg:mb-4 group-hover:animate-bounce" />
                        <span className="text-sm sm:text-base lg:text-lg font-bold tracking-wider">
                          ACTIVATE SOS
                        </span>
                        <span className="text-xs sm:text-sm mt-2 bg-black/20 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          Emergency
                        </span>
                      </>
                    )}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent rounded-b-full pointer-events-none" />
                </button>

                {/* Recording timer below button */}
                {isRecording && (
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <div className="bg-red-50 border border-red-200 rounded-full px-4 py-2 shadow-lg">
                      <div className="flex items-center gap-2">
                        <RiRecordCircleFill
                          className="text-red-500 animate-pulse"
                          aria-hidden="true"
                        />
                        <span className="text-red-600 font-semibold text-sm">
                          Recording: {formatTime(recordingTime)} / 1:00
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Info Panel */}
            <div className="flex-1 w-full lg:max-w-md">
              {currentLocation && (
                <div className="mb-6 bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
                    <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                      <RiMapPinLine aria-hidden="true" />
                      Current Location
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <RiMapPinLine
                          className="text-blue-600 text-xl"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {currentLocation.latitude.toFixed(4)}N,{' '}
                          {currentLocation.longitude.toFixed(4)}E
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Accuracy: +/-{Math.round(currentLocation.accuracy)}m
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {locationError && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-md">
                  <div className="flex items-start gap-3">
                    <RiErrorWarningFill
                      className="text-red-500 text-xl flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-semibold text-red-800 text-sm">
                        Location Error
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        {locationError}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {recordingStatus === 'completed' && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 rounded-lg p-4 shadow-md sos-fade-in">
                  <div className="flex items-start gap-3">
                    <RiCheckLine
                      className="text-green-500 text-xl flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-semibold text-green-800 text-sm">
                        SOS Alert Sent
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Your emergency contacts have been notified via SMS and
                        email.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Panel */}
              <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 sm:px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <RiInformationLine
                        className="text-white text-xl"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-lg">
                        Emergency Protocol
                      </h2>
                      <p className="text-red-100 text-xs">
                        What happens when you activate SOS
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 group hover:bg-red-50 p-3 rounded-lg transition-all duration-200">
                      <div className="bg-green-100 p-2 rounded-lg group-hover:scale-110 transition-transform">
                        <RiMapPinLine
                          className="text-green-600 text-lg"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          Location Tracking
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Your precise GPS coordinates are captured with high
                          accuracy
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 group hover:bg-red-50 p-3 rounded-lg transition-all duration-200">
                      <div className="bg-blue-100 p-2 rounded-lg group-hover:scale-110 transition-transform">
                        <RiVolumeUpLine
                          className="text-blue-600 text-lg"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          Audio Recording
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          60-second audio capture to assess the situation
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 group hover:bg-red-50 p-3 rounded-lg transition-all duration-200">
                      <div className="bg-purple-100 p-2 rounded-lg group-hover:scale-110 transition-transform">
                        <RiAlarmWarningFill
                          className="text-purple-600 text-lg"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          SMS + Email Alert
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          SMS with location link and email with audio sent
                          immediately
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 group hover:bg-red-50 p-3 rounded-lg transition-all duration-200">
                      <div className="bg-amber-100 p-2 rounded-lg group-hover:scale-110 transition-transform">
                        <RiTimeLine
                          className="text-amber-600 text-lg"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          History Log
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          All SOS alerts saved in your history for reference
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <div className="text-xs text-gray-500">Recording</div>
                        <div
                          className={`font-semibold text-sm ${
                            isRecording ? 'text-red-600' : 'text-gray-400'
                          }`}
                        >
                          {isRecording ? 'Active' : 'Standby'}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <div className="text-xs text-gray-500">Location</div>
                        <div
                          className={`font-semibold text-sm ${
                            isLocationCaptured
                              ? 'text-green-600'
                              : 'text-gray-400'
                          }`}
                        >
                          {isLocationCaptured ? 'Locked' : 'Pending'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SOS Modal */}
      <SOSModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSend={handleSendSOS}
        isSending={isSending}
      />
    </>
  );
};

export default SOSButton;
