import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Siren,
  FileText,
  MessageSquare,
  History,
  User,
  LogOut,
  BellRing,
  Mic,
  MapPin,
  CircleAlert,
  CheckCircle2,
  X,
  RotateCcw,
  BadgeCheck,
  CalendarClock,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import sosImage from "../../../assets/images/sos.png";

const TOTAL_SECONDS = 60;
const SOS_HISTORY_KEY = "safeherSOSHistory";

const SOS = () => {
  const navigate = useNavigate();

  const [isRecording, setIsRecording] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [alertDetails, setAlertDetails] = useState({
    dateTime: "",
    location: "13.072100, 77.792200",
    duration: "00:00",
    status: "Delivered",
  });

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Siren, label: "SOS", path: "/sos", active: true },
    { icon: Users, label: "Emergency Contacts", path: "/contacts" },
    { icon: FileText, label: "Incident Reports", path: "/reports" },
    { icon: MessageSquare, label: "Community Posts", path: "/community-posts" },
    { icon: History, label: "SOS History", path: "/sos-history" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  useEffect(() => {
    if (!isRecording) return;

    if (secondsLeft <= 0) {
      submitSOS(TOTAL_SECONDS);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRecording, secondsLeft]);

  const formatDuration = (secondsUsed) => {
    const mins = String(Math.floor(secondsUsed / 60)).padStart(2, "0");
    const secs = String(secondsUsed % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString();
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const saveToSOSHistory = (usedSeconds) => {
    const existingHistory =
      JSON.parse(localStorage.getItem(SOS_HISTORY_KEY)) || [];

    const newHistoryItem = {
      id: Date.now(),
      date: getCurrentDate(),
      time: getCurrentTime(),
      location: "Current Emergency Location",
      coords: "13.072100° N, 77.792200° E",
      duration: formatDuration(usedSeconds),
      audio: true,
      status: "Delivered",
    };

    const updatedHistory = [newHistoryItem, ...existingHistory];
    localStorage.setItem(SOS_HISTORY_KEY, JSON.stringify(updatedHistory));
  };

  const submitSOS = (usedSeconds) => {
    setIsRecording(false);
    setIsSubmitted(true);

    const details = {
      dateTime: getCurrentDateTime(),
      location: "13.072100, 77.792200",
      duration: formatDuration(usedSeconds),
      status: "Delivered",
    };

    setAlertDetails(details);
    saveToSOSHistory(usedSeconds);
  };

  const startSOS = () => {
    setIsSubmitted(false);
    setSecondsLeft(TOTAL_SECONDS);
    setIsRecording(true);
  };

  const stopAndSubmit = () => {
    const usedSeconds = TOTAL_SECONDS - secondsLeft;
    submitSOS(usedSeconds);
  };

  const cancelSOS = () => {
    setIsRecording(false);
    setIsSubmitted(false);
    setSecondsLeft(TOTAL_SECONDS);
  };

  const sendAnotherAlert = () => {
    setIsSubmitted(false);
    setSecondsLeft(TOTAL_SECONDS);
    setIsRecording(false);
  };

  const progressPercent = useMemo(() => {
    return ((TOTAL_SECONDS - secondsLeft) / TOTAL_SECONDS) * 100;
  }, [secondsLeft]);

  const formattedTime = useMemo(() => {
    const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const secs = String(secondsLeft % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  }, [secondsLeft]);

  return (
    <section className="min-h-screen bg-[#f6f8fc] text-slate-800">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="flex flex-col border-r border-slate-200 bg-white">
          <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-5 sm:px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white">
              <BellRing className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">SafeHer</h2>
          </div>

          <nav className="px-3 py-5">
            <div className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={index}
                    to={item.path}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                      item.active
                        ? "bg-gradient-to-r from-[#5b5cf0] to-[#6d5df6] text-white shadow-md"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </nav>

          <div className="mt-auto px-4 pb-6 pt-10">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-sm font-medium text-red-500 transition hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Emergency SOS
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {isRecording
                ? "Emergency recording in progress..."
                : isSubmitted
                ? "Emergency alert sent successfully"
                : "Activate emergency alert with location & audio recording"}
            </p>
          </div>

          <div className="flex items-center justify-center px-4 py-6 sm:px-6 md:py-10">
            <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
              {!isRecording && !isSubmitted && (
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                    Emergency SOS
                  </h2>

                  <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                    Press the button below to activate emergency alert. Your
                    location and audio will be recorded and sent to your
                    emergency contacts.
                  </p>

                  <div className="mt-8 flex justify-center sm:mt-10">
                    <button
                      type="button"
                      onClick={startSOS}
                      className="transition duration-300 hover:scale-[1.03]"
                    >
                      <img
                        src={sosImage}
                        alt="Activate SOS"
                        className="h-[200px] w-[200px] object-contain sm:h-[260px] sm:w-[260px] lg:h-[300px] lg:w-[300px]"
                      />
                    </button>
                  </div>

                  <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-5 text-left sm:mt-10 sm:p-6">
                    <div className="mb-4 flex items-center gap-2 text-red-500">
                      <CircleAlert className="h-5 w-5 shrink-0" />
                      <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                        What happens when you activate SOS?
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                        <span>Your current location is captured automatically</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                        <span>Audio recording starts for up to 60 seconds</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                        <span>Emergency contacts are notified immediately</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                        <span>Alert is logged in your SOS history</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isRecording && (
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
                    <Mic className="h-8 w-8" />
                  </div>

                  <h2 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">
                    Recording Emergency Alert
                  </h2>

                  <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                    Speak clearly. Recording will stop automatically at 60
                    seconds.
                  </p>

                  <div className="mt-8 text-4xl font-extrabold tracking-wider text-red-500 sm:text-5xl">
                    {formattedTime}
                  </div>

                  <div className="mx-auto mt-6 h-3 w-full max-w-xl overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-1000"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-green-100 bg-green-50 p-5 text-left">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-green-700">
                          Location Captured
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          13.072100, 77.792200
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-center gap-3">
                    {[28, 48, 34, 52, 40].map((h, index) => (
                      <div
                        key={index}
                        className="w-2 animate-pulse rounded-full bg-red-400"
                        style={{
                          height: `${h}px`,
                          animationDelay: `${index * 120}ms`,
                        }}
                      />
                    ))}
                  </div>

                  <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                      onClick={stopAndSubmit}
                      className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]"
                    >
                      <CircleAlert className="mr-2 h-4 w-4" />
                      Stop & Submit
                    </button>

                    <button
                      onClick={cancelSOS}
                      className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {!isRecording && isSubmitted && (
                <div className="mx-auto max-w-xl text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>

                  <h2 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">
                    SOS Alert Sent Successfully!
                  </h2>

                  <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
                    Your emergency contacts have been notified with your location
                    and audio recording.
                  </p>

                  <div className="mt-8 rounded-2xl bg-slate-50 p-5 text-left sm:p-6">
                    <h3 className="mb-4 text-sm font-semibold text-slate-900">
                      Alert Details
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarClock className="h-4 w-4" />
                          <span>Date & Time:</span>
                        </div>
                        <span className="text-sm font-medium text-slate-900">
                          {alertDetails.dateTime}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="h-4 w-4" />
                          <span>Location:</span>
                        </div>
                        <span className="text-sm font-medium text-slate-900">
                          {alertDetails.location}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mic className="h-4 w-4" />
                          <span>Recording Duration:</span>
                        </div>
                        <span className="text-sm font-medium text-slate-900">
                          {alertDetails.duration}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <BadgeCheck className="h-4 w-4" />
                          <span>Status:</span>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          <span className="h-2 w-2 rounded-full bg-green-500" />
                          {alertDetails.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#5b5cf0] to-[#6d5df6] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Back to Dashboard
                    </button>

                    <button
                      onClick={sendAnotherAlert}
                      className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Send Another Alert
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default SOS;