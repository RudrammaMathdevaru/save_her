import React, { useState } from "react";
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
  Phone,
  Pencil,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const EmergencyContacts = () => {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      relation: "Sister",
      phone: "+1 (555) 123-4567",
    },
    {
      id: 2,
      name: "Michael Brown",
      relation: "Father",
      phone: "+1 (555) 987-6543",
    },
    {
      id: 3,
      name: "Emily Davis",
      relation: "Best Friend",
      phone: "+1 (555) 456-7890",
    },
    {
      id: 4,
      name: "Dr. Lisa Chen",
      relation: "Doctor",
      phone: "+1 (555) 234-5678",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedContact, setSelectedContact] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    relation: "",
    phone: "",
  });

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Siren, label: "SOS", path: "/sos" },
    { icon: Users, label: "Emergency Contacts", path: "/contacts", active: true },
    { icon: FileText, label: "Incident Reports", path: "/reports" },
    { icon: MessageSquare, label: "Community Posts", path: "/community-posts" },
    { icon: History, label: "SOS History", path: "/sos-history" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const openAddModal = () => {
    setFormData({
      name: "",
      relation: "",
      phone: "",
    });
    setShowAddModal(true);
  };

  const openEditModal = (contact) => {
    setSelectedContact(contact);
    setFormData({
      name: contact.name,
      relation: contact.relation,
      phone: contact.phone,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (contact) => {
    setSelectedContact(contact);
    setShowDeleteModal(true);
  };

  const closeAllModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedContact(null);
    setFormData({
      name: "",
      relation: "",
      phone: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddContact = () => {
    if (!formData.name || !formData.relation || !formData.phone) return;

    const newContact = {
      id: Date.now(),
      name: formData.name,
      relation: formData.relation,
      phone: formData.phone,
    };

    setContacts((prev) => [...prev, newContact]);
    closeAllModals();
  };

  const handleEditContact = () => {
    if (!formData.name || !formData.relation || !formData.phone) return;

    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === selectedContact.id
          ? {
              ...contact,
              name: formData.name,
              relation: formData.relation,
              phone: formData.phone,
            }
          : contact
      )
    );

    closeAllModals();
  };

  const handleDeleteContact = () => {
    setContacts((prev) =>
      prev.filter((contact) => contact.id !== selectedContact.id)
    );
    closeAllModals();
  };

  return (
    <section className="min-h-screen bg-[#f6f8fc] text-slate-800">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="flex flex-col border-r border-slate-200 bg-white">
          <div className="flex items-center gap-3 border-b border-slate-200 px-4 sm:px-6 py-5">
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
          <div className="border-b border-slate-200 bg-white px-4 sm:px-6 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Emergency Contacts
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Manage your trusted emergency contacts
                </p>
              </div>

              <button
                onClick={openAddModal}
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-gradient-to-r from-[#5b5cf0] to-[#6d5df6] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </button>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-6">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="rounded-2xl border border-white/20 bg-white/70 p-5 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                        <User className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-slate-900">
                          {contact.name}
                        </h3>
                        <span className="mt-1 inline-block rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-500">
                          {contact.relation}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400">
                      <button
                        onClick={() => openEditModal(contact)}
                        className="transition hover:text-indigo-500"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(contact)}
                        className="transition hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 break-all">
                      <Phone className="h-4 w-4 shrink-0" />
                      <span>{contact.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/85 p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                Add Emergency Contact
              </h2>
              <button onClick={closeAllModals} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter contact name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Relationship
                </label>
                <input
                  type="text"
                  name="relation"
                  value={formData.relation}
                  onChange={handleChange}
                  placeholder="e.g., Sister, Friend, Doctor"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={closeAllModals}
                className="w-full rounded-xl border border-indigo-500 px-4 py-3 text-sm font-semibold text-indigo-500 transition hover:bg-indigo-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContact}
                className="w-full rounded-xl bg-gradient-to-r from-[#8f8cf7] to-[#6d5df6] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/85 p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                Edit Contact
              </h2>
              <button onClick={closeAllModals} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Relationship
                </label>
                <input
                  type="text"
                  name="relation"
                  value={formData.relation}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={closeAllModals}
                className="w-full rounded-xl border border-indigo-500 px-4 py-3 text-sm font-semibold text-indigo-500 transition hover:bg-indigo-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditContact}
                className="w-full rounded-xl bg-gradient-to-r from-[#5b5cf0] to-[#6d5df6] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/85 p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                Delete Contact
              </h2>
              <button onClick={closeAllModals} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm leading-6 text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedContact.name}</span>? This
              action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={closeAllModals}
                className="w-full rounded-xl border border-indigo-500 px-4 py-3 text-sm font-semibold text-indigo-500 transition hover:bg-indigo-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteContact}
                className="w-full rounded-xl bg-gradient-to-r from-[#ff5a5a] to-[#ff4747] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EmergencyContacts;