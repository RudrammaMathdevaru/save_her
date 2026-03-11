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
  Check,
  X,
  ShieldAlert,
  Play,
  Pause,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const SOS_HISTORY_KEY = "safeherSOSHistory";

const defaultSOSHistoryData = [
  {
    id: 1,
    date: "2024-01-15",
    time: "20:45:12",
    location: "Downtown Plaza, Main St",
    coords: "40.7128° N, 74.0060° W",
    duration: "00:45",
    audio: true,
    status: "Delivered",
  },
  {
    id: 2,
    date: "2024-01-10",
    time: "18:30:05",
    location: "Central Park West Entrance",
    coords: "40.7829° N, 73.9654° W",
    duration: "01:00",
    audio: true,
    status: "Delivered",
  },
  {
    id: 3,
    date: "2024-01-05",
    time: "22:15:33",
    location: "Riverside Apartments",
    coords: "40.7580° N, 73.9855° W",
    duration: "00:30",
    audio: true,
    status: "Delivered",
  },
  {
    id: 4,
    date: "2023-12-28",
    time: "19:45:00",
    location: "Oak Street & 5th Avenue",
    coords: "40.7282° N, 73.7949° W",
    duration: "00:52",
    audio: false,
    status: "Failed",
  },
  {
    id: 5,
    date: "2023-12-20",
    time: "21:00:15",
    location: "Shopping Mall Parking",
    coords: "40.6892° N, 74.0445° W",
    duration: "01:00",
    audio: true,
    status: "Delivered",
  },
];

const SOSHistory = () => {
  const navigate = useNavigate();
  const [playingId, setPlayingId] = useState(null);
  const [sosHistoryData, setSOSHistoryData] = useState([]);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Siren, label: "SOS", path: "/sos" },
    { icon: Users, label: "Emergency Contacts", path: "/contacts" },
    { icon: FileText, label: "Incident Reports", path: "/reports" },
    { icon: MessageSquare, label: "Community Posts", path: "/community-posts" },
    { icon: History, label: "SOS History", path: "/sos-history", active: true },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem(SOS_HISTORY_KEY));

    if (savedHistory && savedHistory.length > 0) {
      setSOSHistoryData(savedHistory);
    } else {
      setSOSHistoryData(defaultSOSHistoryData);
      localStorage.setItem(
        SOS_HISTORY_KEY,
        JSON.stringify(defaultSOSHistoryData)
      );
    }
  }, []);

  const delivered = useMemo(
    () => sosHistoryData.filter((x) => x.status === "Delivered").length,
    [sosHistoryData]
  );

  const failed = useMemo(
    () => sosHistoryData.filter((x) => x.status === "Failed").length,
    [sosHistoryData]
  );

  const total = sosHistoryData.length;

  const togglePlay = (id, audio) => {
    if (!audio) return;
    setPlayingId((prev) => (prev === id ? null : id));
  };

  const statusStyle = (status) =>
    status === "Delivered"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-600";

  return (
    <section className="min-h-screen bg-[#f6f8fc] text-slate-800">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="flex flex-col border-r border-slate-200 bg-white">
          <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-5 sm:px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white">
              <BellRing className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">SafeHer</h2>
          </div>

          <nav className="px-3 py-5 space-y-2">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={i}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    item.active
                      ? "bg-gradient-to-r from-[#5b5cf0] to-[#6d5df6] text-white"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto px-4 pb-6">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-red-500 text-sm"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        <main className="px-4 py-6 sm:px-6">
          <h1 className="mb-1 text-2xl font-bold sm:text-3xl">SOS History</h1>
          <p className="mb-6 text-sm text-slate-500">
            View your past emergency alerts and their status
          </p>

          <div className="overflow-x-auto rounded-2xl border border-white/20 bg-white/75 shadow-sm backdrop-blur-xl">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="p-4 text-left">Date & Time</th>
                  <th className="p-4 text-left">Location</th>
                  <th className="p-4 text-left">Duration</th>
                  <th className="p-4 text-left">Audio</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {sosHistoryData.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-4">
                      <div className="font-semibold">{item.date}</div>
                      <div className="text-xs text-slate-500">{item.time}</div>
                    </td>

                    <td className="p-4">
                      <div>{item.location}</div>
                      <div className="text-xs text-slate-500">{item.coords}</div>
                    </td>

                    <td className="p-4">{item.duration}</td>

                    <td className="p-4">
                      {item.audio ? (
                        <button
                          onClick={() => togglePlay(item.id, item.audio)}
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition ${
                            playingId === item.id
                              ? "bg-gradient-to-r from-[#5b5cf0] to-[#6d5df6] text-white"
                              : "bg-slate-100 hover:bg-slate-200"
                          }`}
                        >
                          {playingId === item.id ? (
                            <Pause size={14} />
                          ) : (
                            <Play size={14} />
                          )}
                          {playingId === item.id ? "Pause" : "Play"}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">No audio</span>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {sosHistoryData.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-8 text-center text-sm text-slate-500"
                    >
                      No SOS history found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-white/20 bg-white/75 p-6 text-center shadow-sm backdrop-blur-xl">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Check />
              </div>
              <div className="mt-3 text-3xl font-bold">{delivered}</div>
              <p className="text-sm text-slate-500">Successfully Delivered</p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/75 p-6 text-center shadow-sm backdrop-blur-xl">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-500">
                <X />
              </div>
              <div className="mt-3 text-3xl font-bold">{failed}</div>
              <p className="text-sm text-slate-500">Failed Delivery</p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/75 p-6 text-center shadow-sm backdrop-blur-xl">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
                <ShieldAlert />
              </div>
              <div className="mt-3 text-3xl font-bold">{total}</div>
              <p className="text-sm text-slate-500">Total SOS Alerts</p>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default SOSHistory;