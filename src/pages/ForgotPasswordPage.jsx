/**
 * File: src/pages/ForgotPasswordPage.jsx
 * Updated: 2026-03-22
 *
 * Purpose:
 * - Enterprise-grade forgot password page with email verification and password reset
 * - Two-step flow: email verification → password reset
 * - Password strength indicator
 * - Rate limiting (5 attempts → 30s cooldown)
 * - Integrated with backend API via auth service
 *
 * Changes:
 * - Added useToast import and hook
 * - Added forgotPassword API call from auth service
 * - Added resetPassword API call from auth service
 * - Replaced mock API calls with real backend integration
 * - Added proper error handling with toast notifications
 * - Preserved ALL existing UI/UX and functionality
 *
 * Connected Modules:
 * - useToast hook (for notifications)
 * - auth.service.js (for API calls)
 *
 * Dependencies:
 * - react-icons/fi: Icons
 * - react-router-dom: Navigation
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShield,
  FiUserCheck,
} from 'react-icons/fi';
import { NavLink, useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast.js';
import * as authService from '../services/auth.service.js';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // Refs for focus management
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const submitButtonRef = useRef(null);

  // Flow state: 'email' or 'reset'
  const [flowStep, setFlowStep] = useState('email');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [resetToken, setResetToken] = useState('');

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetAttempts, setResetAttempts] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitTimer, setRateLimitTimer] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Focus first field on mount
  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  // Focus password field when moving to reset step
  useEffect(() => {
    if (flowStep === 'reset' && passwordRef.current) {
      passwordRef.current.focus();
    }
  }, [flowStep]);

  // Rate limiting timer
  useEffect(() => {
    if (isRateLimited && rateLimitTimer) {
      const timer = setTimeout(() => {
        setIsRateLimited(false);
        setResetAttempts(0);
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

  // Validation functions
  const validateField = useCallback(
    (name, value, allValues = formData) => {
      // Sanitize input first (basic XSS prevention)
      const sanitizedValue = value.replace(/[<>]/g, '');

      switch (name) {
        case 'email':
          if (!sanitizedValue.trim()) {
            return 'Email is required';
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedValue)) {
            return 'Enter a valid email address';
          } else if (sanitizedValue.length > 254) {
            return 'Email is too long';
          }
          break;

        case 'password':
          if (!sanitizedValue) {
            return 'Password is required';
          } else if (sanitizedValue.length < 8) {
            return 'Password must be at least 8 characters';
          } else if (sanitizedValue.length > 128) {
            return 'Password is too long';
          } else if (!/[A-Z]/.test(sanitizedValue)) {
            return 'Password must contain at least one uppercase letter';
          } else if (!/[a-z]/.test(sanitizedValue)) {
            return 'Password must contain at least one lowercase letter';
          } else if (!/\d/.test(sanitizedValue)) {
            return 'Password must contain at least one number';
          }
          break;

        case 'confirmPassword':
          if (!sanitizedValue) {
            return 'Please confirm your password';
          } else if (sanitizedValue !== allValues.password) {
            return 'Passwords do not match';
          }
          break;

        default:
          return '';
      }
      return '';
    },
    [formData]
  );

  // Handle input changes
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      // Sanitize input
      const sanitizedValue = value.replace(/[<>]/g, '');

      setFormData((prev) => ({
        ...prev,
        [name]: sanitizedValue,
      }));

      // Calculate password strength for password field
      if (name === 'password') {
        setPasswordStrength(calculatePasswordStrength(sanitizedValue));
      }

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

      // Clear confirm password error if passwords match
      if (name === 'password' && formData.confirmPassword) {
        if (sanitizedValue === formData.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: '',
          }));
        }
      }

      setSubmitError('');
    },
    [
      touchedFields,
      validateField,
      calculatePasswordStrength,
      formData.confirmPassword,
    ]
  );

  // Handle field blur
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

  // Handle email submission (request password reset)
  const handleEmailSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Check rate limiting
      if (isRateLimited) {
        setSubmitError('Too many attempts. Please wait 30 seconds.');
        return;
      }

      if (resetAttempts >= 5) {
        setIsRateLimited(true);
        setRateLimitTimer(Date.now());
        setSubmitError('Too many attempts. Please wait 30 seconds.');
        return;
      }

      // Validate email
      const emailError = validateField('email', formData.email);

      if (emailError) {
        setErrors({ email: emailError });
        setTouchedFields({ email: true });
        if (emailRef.current) emailRef.current.focus();
        return;
      }

      setIsLoading(true);
      setSubmitError('');

      try {
        // Call the forgot password API
        const response = await authService.forgotPassword(formData.email);

        // Store reset token if returned
        if (response.data?.token) {
          setResetToken(response.data.token);
        }

        setVerifiedEmail(formData.email);
        setFlowStep('reset');
        setResetAttempts((prev) => prev + 1);

        toast.success('Verification successful. Please set your new password.');
      } catch (error) {
        // For security, don't reveal if email exists or not
        // Just show a generic message
        setSubmitError(
          'If an account exists with this email, you will be able to reset your password.'
        );
        toast.info(
          'If an account exists, you can proceed to reset your password.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [formData.email, validateField, resetAttempts, isRateLimited, toast]
  );

  // Handle password reset submission
  const handleResetSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Validate password and confirm password
      const passwordError = validateField('password', formData.password);
      const confirmError = validateField(
        'confirmPassword',
        formData.confirmPassword
      );

      if (passwordError || confirmError) {
        setErrors({
          password: passwordError,
          confirmPassword: confirmError,
        });
        setTouchedFields({
          password: true,
          confirmPassword: true,
        });

        if (passwordError && passwordRef.current) {
          passwordRef.current.focus();
        } else if (confirmError && confirmPasswordRef.current) {
          confirmPasswordRef.current.focus();
        }
        return;
      }

      setIsLoading(true);
      setSubmitError('');

      try {
        // Call the reset password API
        await authService.resetPassword(resetToken, formData.password);

        // Clear sensitive data
        setFormData((prev) => ({
          ...prev,
          password: '',
          confirmPassword: '',
        }));

        setResetSuccess(true);

        toast.success('Password reset successful! Redirecting to login...');

        // Automatically redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', {
            state: {
              message:
                'Password reset successful. Please login with your new password.',
            },
            replace: true,
          });
        }, 3000);
      } catch (error) {
        setSubmitError(
          error.message || 'Failed to reset password. Please try again.'
        );
        toast.error(
          error.message || 'Failed to reset password. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      formData.password,
      formData.confirmPassword,
      validateField,
      navigate,
      resetToken,
      toast,
    ]
  );

  // Go back to email step
  const handleBackToEmail = useCallback(() => {
    setFlowStep('email');
    setErrors({});
    setTouchedFields({});
    setSubmitError('');
    setTimeout(() => {
      if (emailRef.current) emailRef.current.focus();
    }, 0);
  }, []);

  // Memoized class names
  const inputWrapperClass = useMemo(
    () => (fieldName) => {
      const baseClasses =
        'flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-all duration-200';
      const errorClasses = errors[fieldName]
        ? 'border-red-300 bg-red-50/50 focus-within:border-red-400 focus-within:bg-red-50/70'
        : 'border-slate-200 bg-white/80 focus-within:border-indigo-400 focus-within:bg-white focus-within:shadow-md';
      const disabledClasses =
        isLoading || isRateLimited ? 'opacity-60 pointer-events-none' : '';

      return `${baseClasses} ${errorClasses} ${disabledClasses}`;
    },
    [errors, isLoading, isRateLimited]
  );

  const inputClass = useMemo(
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

  // Render email verification step
  const renderEmailStep = () => (
    <>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
          <FiMail className="h-8 w-8 text-indigo-600" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800">
          Reset your password
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Enter your email address to reset your password. If an account exists,
          you'll be able to set a new password.
        </p>
      </div>

      <form
        onSubmit={handleEmailSubmit}
        noValidate
        aria-label="Email verification form"
      >
        <div className="mb-6">
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
            <FiMail className="h-5 w-5 text-slate-400" aria-hidden="true" />
            <input
              ref={emailRef}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="you@example.com"
              className={inputClass}
              disabled={isLoading || isRateLimited}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
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

        <button
          ref={submitButtonRef}
          type="submit"
          disabled={isLoading || isRateLimited}
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
          aria-label="Continue to password reset"
        >
          {isLoading ? 'Verifying...' : 'Continue'}
        </button>
      </form>
    </>
  );

  // Render password reset step
  const renderResetStep = () => (
    <>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <FiUserCheck className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800">
          Set new password
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Create a new password for{' '}
          <span className="font-medium text-indigo-600">{verifiedEmail}</span>
        </p>
      </div>

      <form
        onSubmit={handleResetSubmit}
        noValidate
        aria-label="Password reset form"
      >
        {/* Password Field */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            New Password
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>

          <div className={inputWrapperClass('password')}>
            <FiLock className="h-5 w-5 text-slate-400" aria-hidden="true" />

            <input
              ref={passwordRef}
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Create new password"
              className={inputClass}
              disabled={isLoading || isRateLimited}
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? 'password-error' : 'password-strength'
              }
              autoComplete="new-password"
              maxLength={128}
            />

            <button
              type="button"
              onClick={() => togglePasswordVisibility('password')}
              className="text-slate-400 transition-colors hover:text-indigo-600 focus:outline-none focus:text-indigo-600 disabled:cursor-not-allowed"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={isLoading || isRateLimited}
            >
              {showPassword ? (
                <FiEyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <FiEye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
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
              <p id="password-strength" className="text-xs text-slate-500">
                Use at least 8 characters with uppercase, lowercase, and numbers
              </p>
            </div>
          )}

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

        {/* Confirm Password Field */}
        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Confirm New Password
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>

          <div className={inputWrapperClass('confirmPassword')}>
            <FiLock className="h-5 w-5 text-slate-400" aria-hidden="true" />

            <input
              ref={confirmPasswordRef}
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Confirm new password"
              className={inputClass}
              disabled={isLoading || isRateLimited}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={
                errors.confirmPassword ? 'confirmPassword-error' : undefined
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
              disabled={isLoading || isRateLimited}
            >
              {showConfirmPassword ? (
                <FiEyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <FiEye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Visual feedback when passwords match */}
          {formData.password &&
            formData.confirmPassword &&
            !errors.confirmPassword && (
              <p className="mt-1.5 text-sm text-green-500 flex items-center gap-1">
                <FiCheckCircle className="h-4 w-4" aria-hidden="true" />
                Passwords match
              </p>
            )}

          {errors.confirmPassword && (
            <p
              id="confirmPassword-error"
              className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
              role="alert"
            >
              <FiAlertCircle className="h-4 w-4" aria-hidden="true" />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="submit"
            disabled={isLoading || isRateLimited}
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
            aria-label="Reset password"
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </button>

          <button
            type="button"
            onClick={handleBackToEmail}
            disabled={isLoading || isRateLimited}
            className="w-full flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiArrowLeft className="h-4 w-4" />
            Back to email entry
          </button>
        </div>
      </form>
    </>
  );

  // Render success state
  const renderSuccessState = () => (
    <div className="text-center py-8">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <FiCheckCircle className="h-10 w-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        Password Reset Successful!
      </h2>
      <p className="text-slate-600 mb-6">
        Your password has been reset successfully. You'll be redirected to login
        in a moment.
      </p>
      <NavLink
        to="/login"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Go to Login
      </NavLink>
    </div>
  );

  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-8 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center">
        <div className="w-full">
          {/* Main Card */}
          <div className="relative overflow-hidden rounded-2xl bg-white/90 p-6 shadow-xl backdrop-blur-xl sm:p-8">
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-20">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
                  <p className="text-sm font-medium text-indigo-600">
                    {flowStep === 'email'
                      ? 'Verifying...'
                      : 'Resetting password...'}
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
                  Too many attempts. Please wait 30 seconds before trying again.
                </p>
              </div>
            )}

            {/* Main Content */}
            {resetSuccess
              ? renderSuccessState()
              : flowStep === 'email'
                ? renderEmailStep()
                : renderResetStep()}
          </div>

          {/* Back to Login Link */}
          {!resetSuccess && (
            <p className="mt-6 text-center text-sm text-slate-500">
              Remember your password?{' '}
              <NavLink
                to="/login"
                className={`
                  font-semibold text-indigo-600 
                  hover:text-indigo-700 focus:outline-none focus:ring-2 
                  focus:ring-indigo-500 focus:ring-offset-2 rounded
                  ${isLoading || isRateLimited ? 'pointer-events-none opacity-50' : ''}
                `}
                tabIndex={isLoading || isRateLimited ? -1 : 0}
              >
                Back to login
              </NavLink>
            </p>
          )}
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
  );
};

export default ForgotPasswordPage;
