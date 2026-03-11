import React from "react";
import { X } from "lucide-react";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/80 p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold">Change Password</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-600">Current Password</label>
            <input
              type="password"
              placeholder="Enter your current password"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">New Password</label>
            <input
              type="password"
              placeholder="Enter your new password"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm your new password"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 border rounded-lg text-slate-600"
          >
            Cancel
          </button>

          <button className="w-full sm:w-auto px-4 py-2.5 text-white rounded-lg bg-gradient-to-r from-[#5b5cf0] to-[#6d5df6]">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;