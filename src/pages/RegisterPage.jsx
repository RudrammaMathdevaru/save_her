/**
 * File: src/pages/RegisterPage.jsx
 * Updated: 2026-03-22
 *
 * Purpose:
 * - Enterprise-grade registration page with comprehensive validation
 * - Phone number strictly 10 digits, numbers only, no spaces or formatting
 * - Password strength indicator
 * - Rate limiting (3 attempts → 30s cooldown)
 * - Formik + Yup for robust form management
 * - Integrated with backend API via AuthContext
 *
 * Changes:
 * - Added useAuth hook import and destructuring
 * - Replaced mock API call with real register function
 * - Changed navigation from /verify-email to /dashboard on success
 * - Added error handling with toast via AuthContext
 * - REMOVED phone number formatting function (strict raw digits only)
 * - Updated phone input to accept ONLY numeric digits (no spaces, parentheses, dashes)
 * - Phone field now shows exactly the 10 digits with no visual formatting
 * - Preserved ALL other existing UI/UX and functionality
 *
 * Connected Modules:
 * - AuthHeader.jsx
 * - useAuth hook (from hooks/useAuth.js)
 * - App.jsx (route configuration)
 *
 * Dependencies:
 * - formik: Enterprise form management
 * - yup: Schema validation
 * - react-icons/fi: Icons
 * - react-router-dom: Navigation
 */

import { useFormik } from 'formik';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiPhone,
  FiShield,
  FiUser,
} from 'react-icons/fi';
import { NavLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import AuthHeader from '../components/Layout/AuthHeader';
import { useAuth } from '../hooks/useAuth.js';

// Validation Schema using Yup
const RegistrationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .matches(
      /^[a-zA-Z\s'-]+$/,
      'Name can only contain letters, spaces, hyphens and apostrophes'
    )
    .transform((value) => value.replace(/[<>]/g, '')), // Sanitize XSS

  email: Yup.string()
    .required('Email is required')
    .email('Enter a valid email address')
    .max(254, 'Email is too long')
    .lowercase()
    .transform((value) => value.replace(/[<>]/g, '')), // Sanitize XSS

  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits (numbers only, no spaces or special characters)')
    .transform((value) => {
      // Remove all non-digits and take first 10 digits
      const digits = value.replace(/\D/g, '');
      return digits.slice(0, 10);
    }),

  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/\d/, 'Must contain at least one number')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Must contain at least one special character'
    )
    .transform((value) => value.replace(/[<>]/g, '')), // Sanitize XSS

  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .transform((value) => value.replace(/[<>]/g, '')), // Sanitize XSS

  terms: Yup.boolean()
    .required('You must accept the terms and conditions')
    .oneOf([true], 'You must accept the terms and conditions'),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth(); // Get register function from auth context

  // Refs for focus management
  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const submitButtonRef = useRef(null);

  // Local state (not form-related)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitTimer, setRateLimitTimer] = useState(null);
  const [registrationAttempts, setRegistrationAttempts] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [submitError, setSubmitError] = useState('');

  // Formik setup
  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
    validationSchema: RegistrationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      // Check rate limiting
      if (isRateLimited) {
        setSubmitError(
          'Too many registration attempts. Please wait 30 seconds.'
        );
        setSubmitting(false);
        return;
      }

      if (registrationAttempts >= 3) {
        setIsRateLimited(true);
        setRateLimitTimer(Date.now());
        setSubmitError(
          'Too many registration attempts. Please wait 30 seconds.'
        );
        setSubmitting(false);
        return;
      }

      try {
        // Prepare data for submission (remove confirmPassword and terms)
        const { confirmPassword, terms, ...submissionData } = values;

        // Call the register function from AuthContext
        await register(submissionData);

        // Reset form sensitive data
        resetForm();

        // Navigate to dashboard on successful registration
        navigate('/dashboard', { replace: true });
      } catch (error) {
        setRegistrationAttempts((prev) => prev + 1);
        setSubmitError(
          error.message || 'Registration failed. Please try again.'
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Focus first field on mount
  useEffect(() => {
    if (fullNameRef.current) {
      fullNameRef.current.focus();
    }
  }, []);

  // Rate limiting timer
  useEffect(() => {
    if (isRateLimited && rateLimitTimer) {
      const timer = setTimeout(() => {
        setIsRateLimited(false);
        setRegistrationAttempts(0);
        setRateLimitTimer(null);
      }, 30000); // 30 second cooldown

      return () => clearTimeout(timer);
    }
  }, [isRateLimited, rateLimitTimer]);

  // Password strength calculator
  const calculatePasswordStrength = useCallback((password) => {
    if (!password) return 0;

    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 25;
    else if (password.length >= 6) strength += 15;

    // Contains number
    if (/\d/.test(password)) strength += 25;

    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 15;

    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 15;

    // Contains special character
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 20;

    return Math.min(100, strength);
  }, []);

  // Update password strength when password changes
  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(formik.values.password));
  }, [formik.values.password, calculatePasswordStrength]);

  // Handle phone change with strict numeric validation
  const handlePhoneChange = useCallback(
    (e) => {
      const rawValue = e.target.value;
      // Remove all non-digits, allow only numbers
      const digitsOnly = rawValue.replace(/\D/g, '');
      // Take only first 10 digits
      const truncatedDigits = digitsOnly.slice(0, 10);

      // Set the raw digits as the actual value (Yup will handle validation)
      formik.setFieldValue('phoneNumber', truncatedDigits);
    },
    [formik]
  );

  // Toggle password visibility
  const togglePasswordVisibility = useCallback((field) => {
    if (field === 'password') {
      setShowPassword((prev) => !prev);
      setTimeout(() => {
        if (passwordRef.current) {
          passwordRef.current.focus();
        }
      }, 0);
    } else {
      setShowConfirmPassword((prev) => !prev);
      setTimeout(() => {
        if (confirmPasswordRef.current) {
          confirmPasswordRef.current.focus();
        }
      }, 0);
    }
  }, []);

  // Memoized class names
  const inputWrapperClass = useCallback(
    (fieldName) => {
      const baseClasses =
        'flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-all duration-200';
      const errorClasses =
        formik.touched[fieldName] && formik.errors[fieldName]
          ? 'border-red-300 bg-red-50/50 focus-within:border-red-400 focus-within:bg-red-50/70'
          : 'border-slate-200 bg-white/80 focus-within:border-indigo-400 focus-within:bg-white focus-within:shadow-md';
      const disabledClasses =
        formik.isSubmitting || isRateLimited
          ? 'opacity-60 pointer-events-none'
          : '';

      return `${baseClasses} ${errorClasses} ${disabledClasses}`;
    },
    [formik.touched, formik.errors, formik.isSubmitting, isRateLimited]
  );

  const inputClass = useCallback(
    () =>
      'w-full bg-transparent text-base text-slate-800 placeholder:text-slate-400 outline-none disabled:cursor-not-allowed',
    []
  );

  // Password strength indicator color and text
  const getPasswordStrengthInfo = useCallback(() => {
    if (passwordStrength === 0) return { color: 'bg-slate-200', text: '' };
    if (passwordStrength < 40) return { color: 'bg-red-500', text: 'Weak' };
    if (passwordStrength < 70)
      return { color: 'bg-yellow-500', text: 'Medium' };
    if (passwordStrength < 90) return { color: 'bg-green-500', text: 'Strong' };
    return { color: 'bg-indigo-500', text: 'Very Strong' };
  }, [passwordStrength]);

  const strengthInfo = getPasswordStrengthInfo();

  return (
    <>
      <AuthHeader />

      <section
        className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-8 sm:px-6 lg:px-8"
        style={{ paddingTop: '80px' }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl items-center justify-center">
          <div className="w-full">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
                Create Account
              </h1>
              <p className="mt-3 text-base text-slate-600">
                Join SafeHer to access emergency services and community support
              </p>
            </div>

            {/* Main Card */}
            <div className="relative overflow-hidden rounded-2xl bg-white/90 p-6 shadow-xl backdrop-blur-xl sm:p-8">
              {/* Loading Overlay */}
              {formik.isSubmitting && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-20">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
                    <p className="text-sm font-medium text-indigo-600">
                      Creating account...
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

              {/* Rate Limit Warning */}
              {isRateLimited && (
                <div
                  className="mb-6 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700"
                  role="alert"
                  aria-live="polite"
                >
                  <FiShield className="h-5 w-5 flex-shrink-0" />
                  <p>
                    Too many attempts. Please wait 30 seconds before trying
                    again.
                  </p>
                </div>
              )}

              <form
                className="space-y-5"
                onSubmit={formik.handleSubmit}
                noValidate
                aria-label="Registration form"
              >
                {/* Row 1: Full Name and Email */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* Full Name Field */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Full Name
                      <span className="ml-1 text-red-500" aria-hidden="true">
                        *
                      </span>
                      <span className="sr-only">(required)</span>
                    </label>

                    <div className={inputWrapperClass('fullName')}>
                      <FiUser
                        className="h-5 w-5 text-slate-400"
                        aria-hidden="true"
                      />
                      <input
                        ref={fullNameRef}
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="John Doe"
                        className={inputClass()}
                        disabled={formik.isSubmitting || isRateLimited}
                        aria-invalid={
                          formik.touched.fullName && !!formik.errors.fullName
                        }
                        aria-describedby={
                          formik.touched.fullName && formik.errors.fullName
                            ? 'fullName-error'
                            : undefined
                        }
                        autoComplete="name"
                        maxLength={100}
                      />
                    </div>

                    {formik.touched.fullName && formik.errors.fullName && (
                      <p
                        id="fullName-error"
                        className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
                        role="alert"
                      >
                        <FiAlertCircle className="h-4 w-4" aria-hidden="true" />
                        {formik.errors.fullName}
                      </p>
                    )}
                  </div>

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
                        ref={emailRef}
                        type="email"
                        id="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="you@example.com"
                        className={inputClass()}
                        disabled={formik.isSubmitting || isRateLimited}
                        aria-invalid={
                          formik.touched.email && !!formik.errors.email
                        }
                        aria-describedby={
                          formik.touched.email && formik.errors.email
                            ? 'email-error'
                            : undefined
                        }
                        autoComplete="email"
                        inputMode="email"
                        maxLength={254}
                      />
                    </div>

                    {formik.touched.email && formik.errors.email && (
                      <p
                        id="email-error"
                        className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
                        role="alert"
                      >
                        <FiAlertCircle className="h-4 w-4" aria-hidden="true" />
                        {formik.errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 2: Phone and Password */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* Phone Number Field */}
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Phone Number
                      <span className="ml-1 text-red-500" aria-hidden="true">
                        *
                      </span>
                      <span className="sr-only">(required)</span>
                    </label>

                    <div className={inputWrapperClass('phoneNumber')}>
                      <FiPhone
                        className="h-5 w-5 text-slate-400"
                        aria-hidden="true"
                      />
                      <input
                        ref={phoneRef}
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formik.values.phoneNumber}
                        onChange={handlePhoneChange}
                        onBlur={formik.handleBlur}
                        placeholder="1234567890"
                        className={inputClass()}
                        disabled={formik.isSubmitting || isRateLimited}
                        aria-invalid={
                          formik.touched.phoneNumber &&
                          !!formik.errors.phoneNumber
                        }
                        aria-describedby={
                          formik.touched.phoneNumber &&
                          formik.errors.phoneNumber
                            ? 'phoneNumber-error'
                            : undefined
                        }
                        autoComplete="tel"
                        inputMode="numeric"
                        pattern="\d*"
                        maxLength={10}
                      />
                    </div>

                    {formik.touched.phoneNumber &&
                      formik.errors.phoneNumber && (
                        <p
                          id="phoneNumber-error"
                          className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
                          role="alert"
                        >
                          <FiAlertCircle
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                          {formik.errors.phoneNumber}
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
                        ref={passwordRef}
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Create a password"
                        className={inputClass()}
                        disabled={formik.isSubmitting || isRateLimited}
                        aria-invalid={
                          formik.touched.password && !!formik.errors.password
                        }
                        aria-describedby={
                          formik.touched.password && formik.errors.password
                            ? 'password-error'
                            : 'password-strength'
                        }
                        autoComplete="new-password"
                        maxLength={128}
                      />

                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('password')}
                        className="text-slate-400 transition-colors hover:text-indigo-600 focus:outline-none focus:text-indigo-600 disabled:cursor-not-allowed"
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                        disabled={formik.isSubmitting || isRateLimited}
                      >
                        {showPassword ? (
                          <FiEyeOff className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <FiEye className="h-5 w-5" aria-hidden="true" />
                        )}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {formik.values.password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${strengthInfo.color} transition-all duration-300`}
                              style={{ width: `${passwordStrength}%` }}
                              role="progressbar"
                              aria-valuenow={passwordStrength}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            />
                          </div>
                          {strengthInfo.text && (
                            <span className="text-xs font-medium text-slate-600">
                              {strengthInfo.text}
                            </span>
                          )}
                        </div>
                        <p
                          id="password-strength"
                          className="text-xs text-slate-500"
                        >
                          Use at least 8 characters with uppercase, lowercase,
                          number, and special character
                        </p>
                      </div>
                    )}

                    {formik.touched.password && formik.errors.password && (
                      <p
                        id="password-error"
                        className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
                        role="alert"
                      >
                        <FiAlertCircle className="h-4 w-4" aria-hidden="true" />
                        {formik.errors.password}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 3: Confirm Password (Full Width) */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Confirm Password
                    <span className="ml-1 text-red-500" aria-hidden="true">
                      *
                    </span>
                    <span className="sr-only">(required)</span>
                  </label>

                  <div className={inputWrapperClass('confirmPassword')}>
                    <FiLock
                      className="h-5 w-5 text-slate-400"
                      aria-hidden="true"
                    />

                    <input
                      ref={confirmPasswordRef}
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Confirm your password"
                      className={inputClass()}
                      disabled={formik.isSubmitting || isRateLimited}
                      aria-invalid={
                        formik.touched.confirmPassword &&
                        !!formik.errors.confirmPassword
                      }
                      aria-describedby={
                        formik.touched.confirmPassword &&
                        formik.errors.confirmPassword
                          ? 'confirmPassword-error'
                          : undefined
                      }
                      autoComplete="new-password"
                      maxLength={128}
                    />

                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="text-slate-400 transition-colors hover:text-indigo-600 focus:outline-none focus:text-indigo-600 disabled:cursor-not-allowed"
                      aria-label={
                        showConfirmPassword ? 'Hide password' : 'Show password'
                      }
                      disabled={formik.isSubmitting || isRateLimited}
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <FiEye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>

                  {/* Visual feedback when passwords match */}
                  {formik.values.password &&
                    formik.values.confirmPassword &&
                    !formik.errors.confirmPassword && (
                      <p className="mt-1.5 text-sm text-green-500 flex items-center gap-1">
                        <FiCheckCircle className="h-4 w-4" aria-hidden="true" />
                        Passwords match
                      </p>
                    )}

                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <p
                        id="confirmPassword-error"
                        className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
                        role="alert"
                      >
                        <FiAlertCircle className="h-4 w-4" aria-hidden="true" />
                        {formik.errors.confirmPassword}
                      </p>
                    )}
                </div>

                {/* Terms and Privacy */}
                <div className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={formik.values.terms}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    disabled={formik.isSubmitting || isRateLimited}
                    aria-invalid={formik.touched.terms && !!formik.errors.terms}
                    aria-describedby={
                      formik.touched.terms && formik.errors.terms
                        ? 'terms-error'
                        : undefined
                    }
                  />
                  <label htmlFor="terms" className="text-slate-600">
                    I agree to the{' '}
                    <NavLink
                      to="/terms"
                      className="font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
                      tabIndex={formik.isSubmitting || isRateLimited ? -1 : 0}
                    >
                      Terms of Service
                    </NavLink>{' '}
                    and{' '}
                    <NavLink
                      to="/privacy"
                      className="font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
                      tabIndex={formik.isSubmitting || isRateLimited ? -1 : 0}
                    >
                      Privacy Policy
                    </NavLink>
                  </label>
                </div>

                {formik.touched.terms && formik.errors.terms && (
                  <p
                    id="terms-error"
                    className="text-sm text-red-500 flex items-center gap-1"
                    role="alert"
                  >
                    <FiAlertCircle className="h-4 w-4" aria-hidden="true" />
                    {formik.errors.terms}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  ref={submitButtonRef}
                  type="submit"
                  disabled={formik.isSubmitting || isRateLimited}
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
                  aria-label="Create your account"
                >
                  {formik.isSubmitting
                    ? 'Creating Account...'
                    : 'Create Account'}
                </button>
              </form>

              {/* Login Link */}
              <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{' '}
                <NavLink
                  to="/login"
                  className={`
                    font-semibold text-indigo-600 
                    hover:text-indigo-700 focus:outline-none focus:ring-2 
                    focus:ring-indigo-500 focus:ring-offset-2 rounded
                    ${
                      formik.isSubmitting || isRateLimited
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  `}
                  tabIndex={formik.isSubmitting || isRateLimited ? -1 : 0}
                >
                  Sign in
                </NavLink>
              </p>
            </div>

            {/* Security Badge */}
            <p className="mt-4 text-center text-xs text-slate-500 flex items-center justify-center gap-1">
              <FiShield className="h-3 w-3" />
              Your data is encrypted and secure
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

export default RegisterPage;