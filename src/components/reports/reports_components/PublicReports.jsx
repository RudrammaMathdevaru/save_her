import React, { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
  Plus,
  X,
  MapPin,
  CalendarDays,
  Clock3,
  Trash2,
  UploadCloud,
  Send,
} from "lucide-react";

const initialReports = [
  {
    id: 1001,
    reportId: "RPT-1001",
    title: "Suspicious Activity Downtown",
    description:
      "Noticed a person following women near the bus station around 8 PM. Stay cautious in this area.",
    category: "Suspicious Activity",
    severity: "High",
    location: "Downtown Bus Station",
    date: "2024-01-15",
    time: "20:00",
    status: "Approved",
    image:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 1002,
    reportId: "RPT-1002",
    title: "Street Harassment Incident",
    description:
      "Group of individuals making inappropriate comments near the park entrance. Reported to authorities.",
    category: "Harassment",
    severity: "Medium",
    location: "Central Park West",
    date: "2024-01-14",
    time: "18:30",
    status: "Pending",
    image: "",
  },
  {
    id: 1003,
    reportId: "RPT-1003",
    title: "Broken Street Lights",
    description:
      "Street lights not working on Oak Street between 5th and 6th avenue. Creates unsafe walking conditions at night.",
    category: "Infrastructure Issue",
    severity: "Medium",
    location: "Oak Street, 5th-6th Ave",
    date: "2024-01-13",
    time: "21:15",
    status: "Approved",
    image: "",
  },
  {
    id: 1004,
    reportId: "RPT-1004",
    title: "Unlit Parking Garage",
    description:
      "Parking garage lights have been out for 3 days. Multiple residents have reported feeling unsafe walking to their vehicles.",
    category: "Infrastructure Issue",
    severity: "High",
    location: "Riverside Parking Garage",
    date: "2024-01-12",
    time: "19:45",
    status: "Pending",
    image: "",
  },
  {
    id: 1005,
    reportId: "RPT-1005",
    title: "Stalking Incident Reported",
    description:
      "A resident reported being followed home from the grocery store. The suspect was last seen wearing a dark hoodie.",
    category: "Suspicious Activity",
    severity: "High",
    location: "Main Street Grocery",
    date: "2024-01-12",
    time: "17:20",
    status: "Approved",
    image: "",
  },
  {
    id: 1006,
    reportId: "RPT-1006",
    title: "Verbal Harassment at Bus Stop",
    description:
      "Multiple complaints about harassment at the Elm Street bus stop during evening hours.",
    category: "Harassment",
    severity: "Low",
    location: "Elm Street Bus Stop",
    date: "2024-01-11",
    time: "18:00",
    status: "Approved",
    image: "",
  },
];

const PublicReports = () => {
  const navigate = useNavigate();

  const [reports, setReports] = useState(initialReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    category: "Suspicious Activity",
    severity: "Medium",
    anonymous: false,
    images: [],
  });

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Emergency Contacts", path: "/contacts" },
    { icon: Siren, label: "SOS", path: "/sos" },
    { icon: FileText, label: "Incident Reports", path: "/reports", active: true },
    { icon: MessageSquare, label: "Community Posts", path: "/community-posts" },
    { icon: History, label: "SOS History", path: "/sos-history" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const text = searchTerm.toLowerCase();
      return (
        report.title.toLowerCase().includes(text) ||
        report.description.toLowerCase().includes(text) ||
        report.location.toLowerCase().includes(text) ||
        report.category.toLowerCase().includes(text)
      );
    });
  }, [reports, searchTerm]);

  const getStatusClass = (status) => {
    return status === "Approved"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";
  };

  const getSeverityClass = (severity) => {
    if (severity === "Low") return "bg-green-100 text-green-700";
    if (severity === "Medium") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const openSubmitModal = () => {
    setOpenModal(true);
  };

  const closeSubmitModal = () => {
    setOpenModal(false);
    setFormData({
      title: "",
      description: "",
      location: "",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      category: "Suspicious Activity",
      severity: "Medium",
      anonymous: false,
      images: [],
    });
  };

  const handleCurrentLocation = () => {
    setFormData((prev) => ({
      ...prev,
      location: "Current Location Captured",
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      images: files.slice(0, 5),
    }));
  };

  const handleSubmitReport = () => {
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.location.trim()
    ) {
      alert("Please fill all required fields");
      return;
    }

    const newReport = {
      id: Date.now(),
      reportId: `RPT-${Math.floor(Math.random() * 9000) + 1000}`,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      severity: formData.severity,
      location: formData.location,
      date: formData.date,
      time: formData.time,
      status: "Pending",
      image: formData.images.length
        ? URL.createObjectURL(formData.images[0])
        : "",
    };

    setReports((prev) => [newReport, ...prev]);
    closeSubmitModal();
  };

  const handleDeletePending = (id) => {
    setReports((prev) => prev.filter((report) => report.id !== id));
  };

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
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  Incident Reports
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Report and track safety incidents in your community
                </p>
              </div>

              <button
                onClick={openSubmitModal}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#5b5cf0] to-[#6d5df6] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Submit Report
              </button>
            </div>
          </div>

          <div className="px-4 py-6 sm:px-6">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search reports by title, location, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#6a63ff] focus:ring-4 focus:ring-[#6a63ff]/10"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  {report.image && (
                    <div className="h-[180px] w-full overflow-hidden">
                      <img
                        src={report.image}
                        alt={report.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-5">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-slate-400">{report.reportId}</p>
                        <h3 className="mt-1 text-xl font-semibold text-slate-900">
                          {report.title}
                        </h3>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>
                    </div>

                    <p className="text-sm leading-7 text-slate-600">
                      {report.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {report.category}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getSeverityClass(
                          report.severity
                        )}`}
                      >
                        {report.severity}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{report.location}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>{report.date}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4" />
                        <span>{report.time}</span>
                      </div>
                    </div>

                    {report.status === "Pending" && (
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleDeletePending(report.id)}
                          className="inline-flex items-center rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredReports.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <h3 className="text-lg font-semibold text-slate-700">
                  No reports found
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search input.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {openModal && (
        <div className="fixed inset-0 z-50 bg-black/45 px-4 py-4 sm:py-6">
          <div className="flex min-h-full items-center justify-center">
            <div className="flex h-[92vh] w-full max-w-[720px] flex-col overflow-hidden rounded-[22px] bg-white shadow-2xl">
              <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
                <h2 className="text-[20px] font-semibold text-slate-900">
                  Submit Incident Report
                </h2>

                <button
                  onClick={closeSubmitModal}
                  className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={100}
                      placeholder="Brief title of the incident"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#6a63ff] focus:ring-4 focus:ring-[#6a63ff]/10"
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      {formData.title.length}/100 characters
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      maxLength={500}
                      placeholder="Provide detailed description of what happened..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#6a63ff] focus:ring-4 focus:ring-[#6a63ff]/10"
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      {formData.description.length}/500 characters
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Where did this incident occur?"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#6a63ff] focus:ring-4 focus:ring-[#6a63ff]/10"
                      />
                      <button
                        type="button"
                        onClick={handleCurrentLocation}
                        className="flex h-[48px] w-[52px] items-center justify-center rounded-xl border border-[#6a63ff] text-[#6a63ff] transition hover:bg-[#f5f3ff]"
                      >
                        <MapPin className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Date
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            date: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#6a63ff] focus:ring-4 focus:ring-[#6a63ff]/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Time
                      </label>
                      <input
                        type="time"
                        value={convertTimeTo24Hour(formData.time)}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            time: convertTimeTo12Hour(e.target.value),
                          }))
                        }
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#6a63ff] focus:ring-4 focus:ring-[#6a63ff]/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#6a63ff] focus:ring-4 focus:ring-[#6a63ff]/10"
                    >
                      <option>Suspicious Activity</option>
                      <option>Harassment</option>
                      <option>Infrastructure Issue</option>
                      <option>Stalking</option>
                      <option>Unsafe Area</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-medium text-slate-700">
                      Severity Level
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Low", "Medium", "High"].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              severity: level,
                            }))
                          }
                          className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                            formData.severity === level
                              ? level === "Low"
                                ? "border-green-500 bg-green-50 text-green-700"
                                : level === "Medium"
                                ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                                : "border-red-500 bg-red-50 text-red-700"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Upload Images (Optional)
                    </label>
                    <p className="mb-3 text-xs text-slate-400">
                      Maximum 5 images, 5MB each
                    </p>

                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center transition hover:border-[#6a63ff] hover:bg-[#f8f7ff]">
                      <UploadCloud className="mb-3 h-8 w-8 text-slate-400" />
                      <span className="text-sm text-slate-500">
                        Click to upload images
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="rounded-xl bg-slate-50 px-4 py-3">
                    <label className="flex items-center gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={formData.anonymous}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            anonymous: e.target.checked,
                          }))
                        }
                      />
                      Submit this report anonymously
                    </label>
                  </div>
                </div>
              </div>

              <div className="shrink-0 border-t border-slate-200 bg-white px-6 py-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={closeSubmitModal}
                    className="w-full rounded-xl border border-[#6a63ff] px-5 py-3 text-sm font-semibold text-[#6a63ff] transition hover:bg-[#f5f3ff]"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSubmitReport}
                    className="w-full rounded-xl bg-gradient-to-r from-[#8f87f8] to-[#a9a3f6] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
                  >
                    <span className="inline-flex items-center justify-center">
                      <Send className="mr-2 h-4 w-4" />
                      Submit Report
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const convertTimeTo12Hour = (time24) => {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":");
  const hourNum = parseInt(hours, 10);
  const suffix = hourNum >= 12 ? "PM" : "AM";
  const hour12 = hourNum % 12 || 12;
  return `${String(hour12).padStart(2, "0")}:${minutes} ${suffix}`;
};

const convertTimeTo24Hour = (time12) => {
  if (!time12) return "";
  const [time, modifier] = time12.split(" ");
  if (!time || !modifier) return "";
  let [hours, minutes] = time.split(":");
  let hourNum = parseInt(hours, 10);

  if (modifier === "PM" && hourNum < 12) hourNum += 12;
  if (modifier === "AM" && hourNum === 12) hourNum = 0;

  return `${String(hourNum).padStart(2, "0")}:${minutes}`;
};

export default PublicReports;