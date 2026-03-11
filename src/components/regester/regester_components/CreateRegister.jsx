import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s()]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      };

      localStorage.setItem("safeherUser", JSON.stringify(userData));
      navigate("/dashboard");
    }
  };

  const inputClass = (fieldName) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition ${
      errors[fieldName]
        ? "border-red-400 bg-red-50 focus:border-red-500"
        : "border-slate-200 bg-slate-50 focus:border-indigo-400 focus:bg-white"
    }`;

  return (
    <section className="min-h-[calc(100vh-220px)] bg-[#f5f7fb] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto flex max-w-7xl justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-[#0f172a] sm:text-4xl">
              Create Account
            </h1>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Join SafeHer community for a safer tomorrow
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/80 p-5 shadow-lg backdrop-blur-xl sm:p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={inputClass("fullName")}
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={inputClass("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className={inputClass("phone")}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className={inputClass("password")}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className={inputClass("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-[#e6dcff] bg-[#f7f1ff] px-4 py-4">
                <h4 className="text-sm font-semibold text-slate-800">
                  Password Requirements:
                </h4>
                <ul className="mt-2 space-y-1 text-xs text-slate-600">
                  <li>• At least 8 characters long</li>
                  <li>• Mix of letters and numbers recommended</li>
                </ul>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-[#5b5cf0] to-[#6d5df6] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(91,92,240,0.28)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_14px_30px_rgba(91,92,240,0.35)]"
              >
                Create Account
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="font-semibold text-indigo-600 transition hover:text-indigo-800"
              >
                Sign in
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;