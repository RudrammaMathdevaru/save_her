import React, { useEffect, useRef, useState } from "react";
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
  Camera,
  UploadCloud,
  Save,
  XCircle,
  Lock,
  Bell,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Home,
  X,
} from "lucide-react";
import ChangePasswordModal from "./ChangePasswordModal";

const defaultProfile = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  bio: "",
  emergencyPhone: "",
  visibility: false,
  locationSharing: true,
  emailNotifications: true,
  photo: "",
};

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [openPassword, setOpenPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Emergency Contacts", path: "/contacts" },
    { icon: Siren, label: "SOS", path: "/sos" },
    { icon: FileText, label: "Incident Reports", path: "/reports" },
    { icon: MessageSquare, label: "Community Posts", path: "/community-posts" },
    { icon: History, label: "SOS History", path: "/sos-history" },
    { icon: User, label: "Profile", path: "/profile", active: true },
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem("safeherUser");

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      const mergedProfile = {
        ...defaultProfile,
        ...parsedUser,
      };
      setProfile(mergedProfile);
    } else {
      setProfile(defaultProfile);
    }
  }, []);

  const handleSave = () => {
    const formattedProfile = {
      ...profile,
      fullName: profile.fullName
        ? profile.fullName
            .split(" ")
            .filter(Boolean)
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ")
        : "",
    };

    localStorage.setItem("safeherUser", JSON.stringify(formattedProfile));
    setProfile(formattedProfile);
    setShowSuccessModal(true);
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate("/dashboard");
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setProfile((prev) => ({
      ...prev,
      photo: imageUrl,
    }));
  };

  const toggleSwitch = (field) => {
    setProfile((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const initials = profile.fullName
    ? profile.fullName
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-[#eef4ff] px-4 py-3.5 text-sm text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#6a63ff] focus:ring-4 focus:ring-[#6a63ff]/10";

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
              type="button"
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-sm font-medium text-red-500 transition hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />

          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                My Profile
              </h1>
              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Manage your personal details, contact information and privacy settings.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <XCircle className="h-4 w-4" />
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#5b5cf0] to-[#6d5df6] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:scale-[1.01]"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[340px_1fr]">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="h-24 bg-gradient-to-r from-[#5b5cf0] via-[#6a63ff] to-[#8b5cf6]" />

                <div className="px-6 pb-6">
                  <div className="-mt-12 flex flex-col items-center text-center">
                    <button
                      type="button"
                      onClick={openFilePicker}
                      className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#e9e8fb] shadow-lg sm:h-28 sm:w-28"
                    >
                      {profile.photo ? (
                        <img
                          src={profile.photo}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-[#5b5cf0]">
                          {initials}
                        </span>
                      )}

                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/25">
                        <Camera className="h-5 w-5 text-white opacity-0 transition group-hover:opacity-100" />
                      </div>
                    </button>

                    <h2 className="mt-4 text-2xl font-bold text-slate-900">
                      {profile.fullName || "Your Name"}
                    </h2>

                    <p className="mt-1 break-all text-sm text-slate-500">
                      {profile.email || "yourmail@example.com"}
                    </p>

                    <div className="mt-5 flex w-full flex-col gap-3">
                      <button
                        type="button"
                        onClick={openFilePicker}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-[#6a63ff] hover:bg-[#f5f3ff] hover:text-[#6a63ff]"
                      >
                        <UploadCloud className="h-4 w-4" />
                        Change Photo
                      </button>

                      <button
                        type="button"
                        onClick={() => setOpenPassword(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                      >
                        <Lock className="h-4 w-4" />
                        Change Password
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4 border-t border-slate-200 pt-6">
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                      <Mail className="h-4 w-4 text-[#6a63ff]" />
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500">Email</p>
                        <p className="truncate text-sm font-medium text-slate-800">
                          {profile.email || "Not added"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                      <Phone className="h-4 w-4 text-[#6a63ff]" />
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500">Phone</p>
                        <p className="truncate text-sm font-medium text-slate-800">
                          {profile.phone || "Not added"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                      <MapPin className="h-4 w-4 text-[#6a63ff]" />
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500">Location</p>
                        <p className="truncate text-sm font-medium text-slate-800">
                          {profile.location || "Not added"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eeebff] text-[#5b5cf0]">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Personal Information
                    </h3>
                    <p className="text-sm text-slate-500">
                      Update your basic account details
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                      className={inputClass}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className={inputClass}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className={inputClass}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Location
                    </label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className={inputClass}
                      placeholder="Enter your location"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Bio
                  </label>
                  <textarea
                    rows={5}
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="Write something about yourself"
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1f1] text-[#ef4444]">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Emergency Contact
                    </h3>
                    <p className="text-sm text-slate-500">
                      Add the number to be contacted during emergencies
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="text"
                    value={profile.emergencyPhone}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        emergencyPhone: e.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="Enter emergency contact number"
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eefaf0] text-[#16a34a]">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Privacy Settings
                    </h3>
                    <p className="text-sm text-slate-500">
                      Control your visibility and notification preferences
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <ToggleCard
                    title="Profile Visibility"
                    desc="Make your profile visible to other community members"
                    enabled={profile.visibility}
                    onToggle={() => toggleSwitch("visibility")}
                  />

                  <ToggleCard
                    title="Location Sharing"
                    desc="Share your location during SOS alerts"
                    enabled={profile.locationSharing}
                    onToggle={() => toggleSwitch("locationSharing")}
                  />

                  <ToggleCard
                    title="Email Notifications"
                    desc="Get updates about reports, alerts and community activity"
                    enabled={profile.emailNotifications}
                    onToggle={() => toggleSwitch("emailNotifications")}
                  />
                </div>
              </div>
            </div>
          </div>

          <ChangePasswordModal
            isOpen={openPassword}
            onClose={() => setOpenPassword(false)}
          />
        </main>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <h2 className="mt-6 text-3xl font-bold text-slate-900">
              Profile Updated Successfully
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
              Your profile information has been saved successfully and is ready
              to use across your SafeHer dashboard.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <X className="mr-2 h-4 w-4" />
                Stay Here
              </button>

              <button
                type="button"
                onClick={handleSuccessClose}
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#5b5cf0] to-[#6d5df6] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01]"
              >
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const ToggleCard = ({ title, desc, enabled, onToggle }) => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{desc}</p>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          enabled ? "bg-[#5b5cf0]" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
};

export default Profile;