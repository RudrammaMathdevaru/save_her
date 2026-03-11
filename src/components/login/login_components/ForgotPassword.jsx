import React from "react";
import { NavLink } from "react-router-dom";
import { Mail } from "lucide-react";

const ForgotPassword = () => {
  return (
    <section className="min-h-[calc(100vh-220px)] bg-[#f5f7fb] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto flex max-w-7xl justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a]">
              Forgot Password
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Enter your email address to reset your password
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/80 p-5 sm:p-8 shadow-lg backdrop-blur-xl">
            <form className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <Mail className="h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-[#5b5cf0] to-[#6d5df6] px-6 py-3.5 text-sm font-semibold text-white"
              >
                Send Reset Link
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Remember your password?{" "}
              <NavLink
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Back to Login
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;