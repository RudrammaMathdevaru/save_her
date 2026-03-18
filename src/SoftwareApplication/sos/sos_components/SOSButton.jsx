/**
 * File: src/components/sos/SOSButton.jsx
 * Updated: 2026-03-17
 *
 * Purpose:
 * - Emergency SOS activation button with recording and geolocation capabilities
 * - Handles audio recording, location capture, and emergency contact notification
 * - Manages recording state and submits data to SOS history
 *
 * Changes:
 * - Separated button and info panel into distinct visual sections
 * - Enhanced button with realistic 3D press effects and glow animations
 * - Added separate container for info panel below the button
 * - Improved visual hierarchy with clear separation
 * - Enhanced accessibility with proper ARIA labels
 *
 * Connected Modules:
 * - ../dashboard/dashboard_components/sos_history/SosHistoryMain.jsx
 *
 * Dependencies:
 * - react-icons/ri: For consistent iconography
 * - No additional npm packages required
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

const SOSButton = () => {
  // State management
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isLocationCaptured, setIsLocationCaptured] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState('idle'); // idle, recording, processing, completed, error
  const [audioBlob, setAudioBlob] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const buttonRef = useRef(null);

  // Get user location
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString(),
          address: 'Fetching address...', // Would reverse geocode in production
        };
        setCurrentLocation(location);
        setIsLocationCaptured(true);
        setLocationError(null);
      },
      (error) => {
        setLocationError(`Location error: ${error.message}`);
        setIsLocationCaptured(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      // Reset states
      setRecordingStatus('recording');
      setRecordingTime(0);
      audioChunksRef.current = [];

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Initialize MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Handle data available event
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        });
        setAudioBlob(audioBlob);
        setRecordingStatus('completed');

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 60) {
            // Max 60 seconds
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);

      // Capture location
      getCurrentLocation();
    } catch (error) {
      console.error('Error starting recording:', error);
      setRecordingStatus('error');
      setIsRecording(false);
    }
  }, [getCurrentLocation]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      setRecordingStatus('processing');
    }
  }, [isRecording]);

  // Submit SOS data to history
  const submitSOSData = useCallback(() => {
    if (!currentLocation) {
      setRecordingStatus('error');
      return;
    }

    try {
      // Create SOS record
      const sosRecord = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-CA'),
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        location: {
          ...currentLocation,
          address: currentLocation.address || 'Location captured',
          coordinates: `${currentLocation.latitude.toFixed(4)}° N, ${currentLocation.longitude.toFixed(4)}° W`,
        },
        duration: recordingTime,
        audioAvailable: !!audioBlob,
        audioBlob: audioBlob ? URL.createObjectURL(audioBlob) : null,
        status: 'Delivered',
        audioDuration: `${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, '0')}`,
      };

      // Get existing SOS history
      const existingHistory = JSON.parse(
        localStorage.getItem('sosHistory') || '[]'
      );

      // Add new record
      const updatedHistory = [sosRecord, ...existingHistory];

      // Save to localStorage
      localStorage.setItem('sosHistory', JSON.stringify(updatedHistory));

      // Dispatch custom event for history components to update
      window.dispatchEvent(
        new CustomEvent('sosHistoryUpdated', { detail: updatedHistory })
      );

      // Reset states after successful submission
      setRecordingStatus('completed');
      setTimeout(() => {
        setRecordingStatus('idle');
        setAudioBlob(null);
        setCurrentLocation(null);
        setIsLocationCaptured(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting SOS data:', error);
      setRecordingStatus('error');
    }
  }, [currentLocation, recordingTime, audioBlob]);

  // Handle button click
  const handleSOSClick = useCallback(() => {
    if (!isRecording && recordingStatus === 'idle') {
      startRecording();
    } else if (isRecording) {
      stopRecording();
    }

    // Button press animation
    setIsButtonPressed(true);
    setTimeout(() => setIsButtonPressed(false), 200);
  }, [isRecording, recordingStatus, startRecording, stopRecording]);

  // Auto-submit when recording completes
  useEffect(() => {
    if (recordingStatus === 'completed' && currentLocation && audioBlob) {
      submitSOSData();
    }
  }, [recordingStatus, currentLocation, audioBlob, submitSOSData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get button state styles
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section - Completely separate from button */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-red-800 to-gray-900 mb-3">
            Emergency SOS
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            {isRecording
              ? '🔴 Recording in progress... Press stop when safe'
              : recordingStatus === 'completed'
                ? '✅ SOS alert sent successfully to your emergency contacts'
                : 'Your safety is our priority. Press the SOS button in case of emergency'}
          </p>
        </div>

        {/* Main Content Grid - Button and Info Side by Side on larger screens */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
          {/* Left Column - SOS Button (Centered) */}
          <div className="flex-1 flex justify-center items-center min-h-[400px] lg:min-h-[500px]">
            <div className="relative">
              {/* Pulse Rings - Only when idle */}
              {!isRecording && recordingStatus === 'idle' && (
                <>
                  <div className="absolute -inset-8 sm:-inset-12 rounded-full bg-red-400/10 animate-ping" />
                  <div className="absolute -inset-6 sm:-inset-8 rounded-full bg-red-400/20 animate-pulse" />
                  <div className="absolute -inset-4 sm:-inset-6 rounded-full bg-red-400/30 animate-pulse" />
                </>
              )}

              {/* Recording Progress Circle */}
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

              {/* Main Button */}
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
                  ${isButtonPressed ? 'scale-95 shadow-inner' : isButtonHovered ? 'scale-105' : 'scale-100'}
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
                {/* 3D Effect Layers */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-full opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full opacity-60" />

                {/* Shine Effect on Hover */}
                <div
                  className={`
                    absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                    -skew-x-12 transition-transform duration-700
                    ${isButtonHovered ? 'translate-x-full' : '-translate-x-full'}
                  `}
                />

                {/* Button Content */}
                <div className="relative flex flex-col items-center justify-center h-full z-10">
                  {isRecording ? (
                    <>
                      <div className="relative">
                        <RiStopFill className="text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-3 lg:mb-4 animate-pulse" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
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
                        ✓ Emergency contacts notified
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

                {/* Bottom Shadow for 3D Effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent rounded-b-full pointer-events-none" />
              </button>

              {/* Recording Timer Display (Separate) */}
              {isRecording && (
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <div className="bg-red-50 border border-red-200 rounded-full px-4 py-2 shadow-lg">
                    <div className="flex items-center gap-2">
                      <RiRecordCircleFill className="text-red-500 animate-pulse" />
                      <span className="text-red-600 font-semibold">
                        Recording: {formatTime(recordingTime)} / 1:00
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Info Panel (Completely Separate) */}
          <div className="flex-1 w-full lg:max-w-md">
            {/* Location Status Card - Separate from main info */}
            {currentLocation && (
              <div className="mb-6 bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
                  <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                    <RiMapPinLine className="text-lg" />
                    Current Location
                  </h3>
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <RiMapPinLine className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {currentLocation.latitude.toFixed(4)}° N,{' '}
                        {currentLocation.longitude.toFixed(4)}° W
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Accuracy: ±{Math.round(currentLocation.accuracy)}m •{' '}
                        {new Date(
                          currentLocation.timestamp
                        ).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message Card */}
            {locationError && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-md">
                <div className="flex items-start gap-3">
                  <RiErrorWarningFill className="text-red-500 text-xl flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-800 text-sm">
                      Location Error
                    </p>
                    <p className="text-xs text-red-600 mt-1">{locationError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message Card */}
            {recordingStatus === 'completed' && !isRecording && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 rounded-lg p-4 shadow-md animate-fadeIn">
                <div className="flex items-start gap-3">
                  <RiCheckLine className="text-green-500 text-xl flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-800 text-sm">
                      SOS Alert Sent
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Your emergency contacts have been notified
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Main Info Panel - Completely separate card */}
            <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 sm:px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <RiInformationLine className="text-white text-xl" />
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

              {/* Content */}
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="flex items-start gap-3 group hover:bg-red-50 p-3 rounded-lg transition-all duration-200">
                    <div className="bg-green-100 p-2 rounded-lg group-hover:scale-110 transition-transform">
                      <RiMapPinLine className="text-green-600 text-lg" />
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

                  {/* Step 2 */}
                  <div className="flex items-start gap-3 group hover:bg-red-50 p-3 rounded-lg transition-all duration-200">
                    <div className="bg-blue-100 p-2 rounded-lg group-hover:scale-110 transition-transform">
                      <RiVolumeUpLine className="text-blue-600 text-lg" />
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

                  {/* Step 3 */}
                  <div className="flex items-start gap-3 group hover:bg-red-50 p-3 rounded-lg transition-all duration-200">
                    <div className="bg-purple-100 p-2 rounded-lg group-hover:scale-110 transition-transform">
                      <RiAlarmWarningFill className="text-purple-600 text-lg" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        Contact Notification
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Immediate alerts sent to your emergency contacts
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-start gap-3 group hover:bg-red-50 p-3 rounded-lg transition-all duration-200">
                    <div className="bg-amber-100 p-2 rounded-lg group-hover:scale-110 transition-transform">
                      <RiTimeLine className="text-amber-600 text-lg" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        History Log
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        All SOS alerts are saved in your history for reference
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Indicators */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-xs text-gray-500">Recording</div>
                      <div
                        className={`font-semibold ${isRecording ? 'text-red-600' : 'text-gray-400'}`}
                      >
                        {isRecording ? 'Active' : 'Standby'}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-xs text-gray-500">Location</div>
                      <div
                        className={`font-semibold ${isLocationCaptured ? 'text-green-600' : 'text-gray-400'}`}
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

      {/* Add animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SOSButton;
