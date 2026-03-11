import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Siren,
  FileText,
  MessageSquare,
  History,
  User,
  Bell,
  Phone,
  LogOut,
  MapPin,
  CalendarDays,
  PlusSquare,
  Sparkles,
  X,
} from "lucide-react";

const SafeherDashboard = () => {
  const navigate = useNavigate();

  const [showBellPopup, setShowBellPopup] = useState(false);
  const [showGeneratePopup, setShowGeneratePopup] = useState(false);
  const [generateText, setGenerateText] = useState("");

  const bellPopupRef = useRef(null);
  const generatePopupRef = useRef(null);

  const savedUser = JSON.parse(localStorage.getItem("safeherUser")) || {};

  const displayName =
    savedUser.fullName || savedUser.name || savedUser.email || "User";

  const nameForInitials = savedUser.fullName || savedUser.name || "";

  const userInitials = nameForInitials
    ? nameForInitials
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : savedUser.email
    ? savedUser.email.slice(0, 2).toUpperCase()
    : "U";

  const recentReports = [
    {
      title: "Suspicious Activity Near Central Park",
      desc: "A group of individuals were observed following women in the Central Park area during evening hours. Multiple witnesses reported the incident.",
      location: "Central Park, Downtown",
      date: "2024-01-15",
      status: "approved",
    },
    {
      title: "Poor Lighting on Main Street",
      desc: "Several streetlights are not functioning on Main Street between 5th and 8th Avenue, creating unsafe conditions for pedestrians at night.",
      location: "Main Street, City Center",
      date: "2024-01-14",
      status: "approved",
    },
    {
      title: "Harassment Incident at Metro Station",
      desc: "Verbal harassment reported at the station platform. Security has been notified and additional patrols increased.",
      location: "Metro Station, Line 3",
      date: "2024-01-13",
      status: "approved",
    },
  ];

  const sosHistory = [
    {
      title: "Emergency SOS",
      time: "2026-01-15 14:30",
      location: "Central Park, NYC",
      status: "Resolved",
    },
    {
      title: "Emergency SOS",
      time: "2026-01-10 09:15",
      location: "Downtown Subway",
      status: "Resolved",
    },
  ];

  const contacts = [
    {
      name: "Mom",
      relation: "Family",
      phone: "+918830008274",
    },
    {
      name: "Best Friend",
      relation: "Friend",
      phone: "+919876543210",
    },
  ];

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Siren, label: "SOS", path: "/sos" },
    { icon: Users, label: "Emergency Contacts", path: "/contacts" },
    { icon: FileText, label: "Incident Reports", path: "/reports" },
    { icon: MessageSquare, label: "Community Posts", path: "/community-posts" },
    { icon: History, label: "SOS History", path: "/sos-history" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const quickActions = [
    {
      icon: Siren,
      title: "Activate SOS",
      desc: "Send emergency alert with location & audio",
      color: "text-red-500 bg-red-50",
      link: "Get Started →",
      linkColor: "text-red-500",
      path: "/sos",
    },
    {
      icon: PlusSquare,
      title: "Report Incident",
      desc: "Submit a new safety incident report",
      color: "text-indigo-500 bg-indigo-50",
      link: "Get Started →",
      linkColor: "text-indigo-500",
      path: "/reports",
    },
    {
      icon: Users,
      title: "Add Contact",
      desc: "Add emergency contact for quick access",
      color: "text-green-500 bg-green-50",
      link: "Get Started →",
      linkColor: "text-green-500",
      path: "/contacts",
    },
    {
      icon: MessageSquare,
      title: "Community Posts",
      desc: "Connect with the community for support",
      color: "text-yellow-500 bg-yellow-50",
      link: "Get Started →",
      linkColor: "text-yellow-500",
      path: "/community-posts",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("safeherUser");
    navigate("/login");
  };

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleBellClick = () => {
    setShowBellPopup((prev) => !prev);
    setShowGeneratePopup(false);
  };

  const handleContinueGenerateClick = () => {
    setShowGeneratePopup(true);
    setShowBellPopup(false);
  };

  const handleGenerate = () => {
    console.log("Tell me more:", generateText);
    setShowGeneratePopup(false);
    setGenerateText("");
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        bellPopupRef.current &&
        !bellPopupRef.current.contains(event.target) &&
        generatePopupRef.current &&
        !generatePopupRef.current.contains(event.target)
      ) {
        setShowBellPopup(false);
        setShowGeneratePopup(false);
      }

      if (
        bellPopupRef.current &&
        !bellPopupRef.current.contains(event.target) &&
        !showGeneratePopup
      ) {
        setShowBellPopup(false);
      }

      if (
        generatePopupRef.current &&
        !generatePopupRef.current.contains(event.target) &&
        !showBellPopup
      ) {
        setShowGeneratePopup(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showBellPopup, showGeneratePopup]);

  return (
    <section className="min-h-screen bg-[#f6f8fc] text-slate-800">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="flex flex-col border-r border-slate-200 bg-white">
          <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-5 sm:px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white">
              <LayoutDashboard className="h-5 w-5" />
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
                    className={({ isActive }) =>
                      `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                        isActive
                          ? "bg-gradient-to-r from-[#5b5cf0] to-[#6d5df6] text-white shadow-md"
                          : "text-slate-600 hover:bg-slate-50"
                      }`
                    }
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
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-red-500 transition hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="flex flex-col gap-4 border-b border-slate-200 bg-white px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Welcome back,{" "}
                <span className="font-medium text-indigo-600">
                  {displayName}
                </span>
              </p>
            </div>

            <div className="relative flex items-center gap-4 self-start sm:self-auto">
              <div ref={bellPopupRef} className="relative">
                <button
                  onClick={handleBellClick}
                  className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500" />
                </button>

                {showBellPopup && (
                  <div className="absolute right-0 top-12 z-40">
                    <button
                      onClick={handleContinueGenerateClick}
                      className="relative flex items-center gap-2 rounded-2xl border-2 border-[#6d5df6] bg-white px-5 py-3 font-semibold text-[#8b3dff] shadow-[0_8px_24px_rgba(168,85,247,0.25)]"
                    >
                      <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l-2 border-t-2 border-[#d78cff] bg-white" />
                      <Sparkles className="h-4 w-4" />
                      <span>Continue to Generate</span>
                    </button>
                  </div>
                )}
              </div>

              <div ref={generatePopupRef} className="relative">
                {showGeneratePopup && (
                  <div className="absolute right-0 top-12 z-50 w-[390px] rounded-2xl border border-slate-300 bg-white p-4 shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
                    <div className="mb-3 flex items-center justify-end">
                      <button
                        onClick={() => setShowGeneratePopup(false)}
                        className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <textarea
                      value={generateText}
                      onChange={(e) => setGenerateText(e.target.value)}
                      placeholder="Tell me more (optional)"
                      className="min-h-[130px] w-full resize-none rounded-xl border-2 border-[#6d5df6] px-4 py-4 text-lg text-slate-700 outline-none placeholder:text-slate-400"
                    />

                    <button
                      onClick={handleGenerate}
                      className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#6256ff] to-[#7c4dff] px-4 py-3 text-lg font-semibold text-white transition hover:opacity-95"
                    >
                      Generate
                    </button>
                  </div>
                )}
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white">
                {userInitials}
              </div>
            </div>
          </div>

          <div className="px-4 py-6 sm:px-6">
            <div>
              <h2 className="mb-4 text-lg font-semibold text-slate-900 sm:text-xl">
                Quick Actions
              </h2>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/20 bg-white/70 p-5 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div
                        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${action.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <h3 className="text-lg font-semibold text-slate-900">
                        {action.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {action.desc}
                      </p>

                      <button
                        onClick={() => navigate(action.path)}
                        className={`mt-4 text-sm font-semibold ${action.linkColor}`}
                      >
                        {action.link}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.7fr_0.8fr]">
              <div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                    Recent Reports
                  </h2>

                  <button
                    onClick={() => navigate("/reports")}
                    className="text-sm font-medium text-indigo-500 hover:text-indigo-600"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {recentReports.map((report, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/20 bg-white/70 p-5 shadow-sm backdrop-blur-xl"
                    >
                      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                          {report.title}
                        </h3>

                        <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          {report.status}
                        </span>
                      </div>

                      <p className="text-sm leading-6 text-slate-500">
                        {report.desc}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {report.location}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="h-4 w-4" />
                          {report.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                      SOS History
                    </h2>

                    <button
                      onClick={() => navigate("/sos-history")}
                      className="text-sm font-medium text-indigo-500 hover:text-indigo-600"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-4">
                    {sosHistory.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-white/20 bg-white/70 p-4 shadow-sm backdrop-blur-xl"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {item.title}
                            </h3>
                            <p className="mt-1 text-xs text-slate-400">
                              {item.time}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {item.location}
                            </p>
                          </div>

                          <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                      Emergency Contacts
                    </h2>

                    <button
                      onClick={() => navigate("/contacts")}
                      className="text-sm font-medium text-indigo-500 hover:text-indigo-600"
                    >
                      Manage
                    </button>
                  </div>

                  <div className="rounded-2xl border border-white/20 bg-white/70 p-4 shadow-sm backdrop-blur-xl">
                    <div className="space-y-4">
                      {contacts.map((contact, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-3"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                              <User className="h-4 w-4" />
                            </div>

                            <div className="min-w-0">
                              <h4 className="truncate font-medium text-slate-900">
                                {contact.name}
                              </h4>
                              <p className="text-sm text-slate-500">
                                {contact.relation}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleCall(contact.phone)}
                            className="shrink-0 rounded-lg p-2 text-indigo-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                            title={`Call ${contact.name}`}
                          >
                            <Phone className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default SafeherDashboard;