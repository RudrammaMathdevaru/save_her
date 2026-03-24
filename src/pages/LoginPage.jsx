/**
 * File: src/pages/LoginPage.jsx
 * Updated: 2026-03-22
 *
 * Purpose:
 * - Enterprise-grade login screen with comprehensive validation
 * - Rate limiting simulation (5 attempts → 30s lockout)
 * - Remember me functionality
 * - Accessibility focused
 * - Integrated with backend API via AuthContext
 *
 * Changes:
 * - Added useAuth hook import and destructuring
 * - Replaced mock API call with real login function
 * - Added error handling with toast via AuthContext
 * - Preserved ALL existing UI/UX and functionality
 *
 * Connected Modules:
 * - AuthHeader.jsx (for consistent auth page header)
 * - useAuth hook (from hooks/useAuth.js)
 * - App.jsx (route configuration)
 *
 * Dependencies:
 * - react-icons/fi (for icons)
 * - react-router-dom (for navigation)
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FiAlertCircle, FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import AuthHeader from '../components/Layout/AuthHeader';
import { useAuth } from '../hooks/useAuth.js';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // Get login function from auth context
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const submitButtonRef = useRef(null);

  // State management
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [submitError, setSubmitError] = useState('');

  // Load saved email if remember me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';

    if (savedRememberMe && savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }

    // Focus email input on mount
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // Handle lockout timer
  useEffect(() => {
    if (isLocked && lockoutTime) {
      const timer = setTimeout(() => {
        setIsLocked(false);
        setLoginAttempts(0);
        setLockoutTime(null);
      }, 30000); // 30 second lockout

      return () => clearTimeout(timer);
    }
  }, [isLocked, lockoutTime]);

  // Memoized validation function
  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'email':
        if (!value.trim()) {
          return 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Enter a valid email address';
        }
        break;

      case 'password':
        if (!value) {
          return 'Password is required';
        } else if (value.length < 8) {
          return 'Password must be at least 8 characters';
        }
        break;

      default:
        return '';
    }
    return '';
  }, []);

  // Handle input changes with real-time validation
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      // Sanitize input (basic XSS prevention)
      const sanitizedValue = value.replace(/[<>]/g, '');

      setFormData((prev) => ({
        ...prev,
        [name]: sanitizedValue,
      }));

      // Clear field error when user types
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));

      // Real-time validation if field was touched
      if (touchedFields[name]) {
        const fieldError = validateField(name, sanitizedValue);
        if (fieldError) {
          setErrors((prev) => ({
            ...prev,
            [name]: fieldError,
          }));
        }
      }

      setSubmitError('');
    },
    [touchedFields, validateField]
  );

  // Handle field blur for validation
  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;

      setTouchedFields((prev) => ({
        ...prev,
        [name]: true,
      }));

      const fieldError = validateField(name, value);
      if (fieldError) {
        setErrors((prev) => ({
          ...prev,
          [name]: fieldError,
        }));
      }
    },
    [validateField]
  );

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);

    // Maintain focus after toggle
    setTimeout(() => {
      if (passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
    }, 0);
  }, []);

  // Handle remember me toggle
  const handleRememberMeChange = useCallback((e) => {
    setRememberMe(e.target.checked);
  }, []);

  // Comprehensive form validation
  const validateForm = useCallback(() => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    return newErrors;
  }, [formData, validateField]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Check if account is locked
      if (isLocked) {
        setSubmitError(`Too many attempts. Please try again in 30 seconds.`);
        return;
      }

      // Check login attempts (simple rate limiting simulation)
      if (loginAttempts >= 5) {
        setIsLocked(true);
        setLockoutTime(new Date());
        setSubmitError(
          `Too many failed attempts. Account locked for 30 seconds.`
        );
        return;
      }

      // Validate all fields
      const validationErrors = validateForm();
      setErrors(validationErrors);

      // Mark all fields as touched
      const allTouched = {};
      Object.keys(formData).forEach((key) => {
        allTouched[key] = true;
      });
      setTouchedFields(allTouched);

      // If validation passes
      if (Object.keys(validationErrors).length === 0) {
        setIsLoading(true);
        setSubmitError('');

        try {
          // Call the login function from AuthContext
          await login(formData.email, formData.password, rememberMe);

          // Navigate to dashboard or redirect to requested page
          const from = location.state?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
        } catch (error) {
          // Increment login attempts on failure
          setLoginAttempts((prev) => prev + 1);
          setSubmitError(
            error.message || 'Invalid email or password. Please try again.'
          );
        } finally {
          setIsLoading(false);
        }
      } else {
        // Focus first field with error
        const firstErrorField = Object.keys(validationErrors)[0];
        if (firstErrorField === 'email' && emailInputRef.current) {
          emailInputRef.current.focus();
        } else if (firstErrorField === 'password' && passwordInputRef.current) {
          passwordInputRef.current.focus();
        }
      }
    },
    [
      formData,
      validateForm,
      rememberMe,
      location.state,
      loginAttempts,
      isLocked,
      navigate,
      login,
    ]
  );

  // Memoized class names
  const inputWrapperClass = useMemo(
    () => (fieldName) => {
      const baseClasses =
        'flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-all duration-200';
      const errorClasses = errors[fieldName]
        ? 'border-red-300 bg-red-50/50 focus-within:border-red-400 focus-within:bg-red-50/70'
        : 'border-slate-200 bg-white/80 focus-within:border-indigo-400 focus-within:bg-white focus-within:shadow-md';
      const disabledClasses = isLoading ? 'opacity-60 pointer-events-none' : '';

      return `${baseClasses} ${errorClasses} ${disabledClasses}`;
    },
    [errors, isLoading]
  );

  const inputClass = useMemo(
    () =>
      'w-full bg-transparent text-base text-slate-800 placeholder:text-slate-400 outline-none disabled:cursor-not-allowed',
    []
  );

  // Get remaining lockout time
  const getLockoutTimeRemaining = useCallback(() => {
    if (!lockoutTime) return 0;
    const elapsed = Date.now() - new Date(lockoutTime).getTime();
    return Math.max(0, Math.ceil((30000 - elapsed) / 1000));
  }, [lockoutTime]);

  return (
    <>
      <AuthHeader />

      <section
        className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-8 sm:px-6 lg:px-8"
        style={{ paddingTop: '80px' }} // 64px header + 16px extra spacing
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
                Welcome Back
              </h1>
              <p className="mt-3 text-base text-slate-600">
                Sign in to continue to SafeHer
              </p>
            </div>

            {/* Main Card */}
            <div className="relative overflow-hidden rounded-2xl bg-white/90 p-6 shadow-xl backdrop-blur-xl sm:p-8">
              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-10">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
                    <p className="text-sm font-medium text-indigo-600">
                      Signing in...
                    </p>
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {submitError && (
                <div
                  className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  role="alert"
                  aria-live="polite"
                >
                  <FiAlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p>{submitError}</p>
                </div>
              )}

              {/* Lockout Warning */}
              {isLocked && (
                <div
                  className="mb-6 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700"
                  role="alert"
                  aria-live="polite"
                >
                  <FiAlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p>
                    Account locked. Try again in {getLockoutTimeRemaining()}{' '}
                    seconds.
                  </p>
                </div>
              )}

              <form
                className="space-y-5"
                onSubmit={handleSubmit}
                noValidate
                aria-label="Login form"
              >
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Email Address
                    <span className="ml-1 text-red-500" aria-hidden="true">
                      *
                    </span>
                    <span className="sr-only">(required)</span>
                  </label>

                  <div className={inputWrapperClass('email')}>
                    <FiMail
                      className="h-5 w-5 text-slate-400"
                      aria-hidden="true"
                    />
                    <input
                      ref={emailInputRef}
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="you@example.com"
                      className={inputClass}
                      disabled={isLoading || isLocked}
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? 'email-error' : undefined
                      }
                      autoComplete="email"
                      inputMode="email"
                    />
                  </div>

                  {errors.email && (
                    <p
                      id="email-error"
                      className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
                      role="alert"
                    >
                      <FiAlertCircle className="h-4 w-4" aria-hidden="true" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Password
                    <span className="ml-1 text-red-500" aria-hidden="true">
                      *
                    </span>
                    <span className="sr-only">(required)</span>
                  </label>

                  <div className={inputWrapperClass('password')}>
                    <FiLock
                      className="h-5 w-5 text-slate-400"
                      aria-hidden="true"
                    />

                    <input
                      ref={passwordInputRef}
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="••••••••"
                      className={inputClass}
                      disabled={isLoading || isLocked}
                      aria-invalid={!!errors.password}
                      aria-describedby={
                        errors.password ? 'password-error' : undefined
                      }
                      autoComplete="current-password"
                    />

                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-slate-400 transition-colors hover:text-indigo-600 focus:outline-none focus:text-indigo-600 disabled:cursor-not-allowed"
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                      disabled={isLoading || isLocked}
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <FiEye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p
                      id="password-error"
                      className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
                      role="alert"
                    >
                      <FiAlertCircle className="h-4 w-4" aria-hidden="true" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      disabled={isLoading || isLocked}
                      aria-label="Remember me on this device"
                    />
                    <span>Remember me</span>
                  </label>

                  <NavLink
                    to="/forgot-password"
                    className={`
                    text-sm font-medium text-indigo-600 
                    hover:text-indigo-700 focus:outline-none focus:ring-2 
                    focus:ring-indigo-500 focus:ring-offset-2 rounded
                    ${
                      isLoading || isLocked
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  `}
                    tabIndex={isLoading || isLocked ? -1 : 0}
                  >
                    Forgot password?
                  </NavLink>
                </div>

                {/* Submit Button */}
                <button
                  ref={submitButtonRef}
                  type="submit"
                  disabled={isLoading || isLocked}
                  className={`
                  w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600
                  px-6 py-3.5 text-sm font-semibold text-white
                  shadow-lg shadow-indigo-500/30
                  transition-all duration-300
                  hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/40
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  disabled:hover:shadow-lg
                `}
                  aria-label="Sign in to your account"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              {/* Register Link */}
              <p className="mt-6 text-center text-sm text-slate-500">
                Don't have an account?{' '}
                <NavLink
                  to="/register"
                  className={`
                  font-semibold text-indigo-600 
                  hover:text-indigo-700 focus:outline-none focus:ring-2 
                  focus:ring-indigo-500 focus:ring-offset-2 rounded
                  ${
                    isLoading || isLocked
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                `}
                  tabIndex={isLoading || isLocked ? -1 : 0}
                >
                  Create account
                </NavLink>
              </p>
            </div>

            {/* Security Badge */}
            <p className="mt-4 text-center text-xs text-slate-500">
              Secured by enterprise-grade encryption
            </p>
          </div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
        `}</style>
      </section>
    </>
  );
};

export default LoginPage;
