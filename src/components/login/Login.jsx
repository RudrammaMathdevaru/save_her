import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      navigate("/dashboard");
    }
  };

  const inputClass =
    "w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none";

  const wrapperClass = (fieldName) =>
    `flex items-center gap-3 rounded-xl border px-4 py-3 transition ${
      errors[fieldName]
        ? "border-red-400 bg-red-50"
        : "border-slate-200 bg-slate-50 focus-within:border-indigo-400 focus-within:bg-white"
    }`;

  return (
    <section className="min-h-[calc(100vh-220px)] bg-[#f5f7fb] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto flex max-w-7xl justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a]">
              Welcome Back
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Sign in to access your SafeHer account
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/80 p-5 sm:p-8 shadow-lg backdrop-blur-xl">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <div className={wrapperClass("email")}>
                  <Mail className="h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={inputClass}
                  />
                </div>

                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <div className={wrapperClass("password")}>
                  <Lock className="h-5 w-5 text-slate-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={inputClass}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-indigo-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <label className="flex items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                  />
                  Remember me
                </label>

                <NavLink
                  to="/forgot-password"
                  className="font-medium text-indigo-500 hover:text-indigo-700"
                >
                  Forgot Password?
                </NavLink>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-[#5b5cf0] to-[#6d5df6] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(91,92,240,0.28)] transition duration-300 hover:scale-[1.01]"
              >
                Sign In
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <NavLink
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Register now
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;