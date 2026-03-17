import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

const RegisterPage = () => {
  const navigate = useNavigate();

  // Refs for focus management
  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const submitButtonRef = useRef(null);

  // State management
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationAttempts, setRegistrationAttempts] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitTimer, setRateLimitTimer] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

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

  // Validation functions
  const validateField = useCallback(
    (name, value, allValues = formData) => {
      // Sanitize input first (basic XSS prevention)
      const sanitizedValue = value.replace(/[<>]/g, '');

      switch (name) {
        case 'fullName':
          if (!sanitizedValue.trim()) {
            return 'Full name is required';
          } else if (sanitizedValue.trim().length < 2) {
            return 'Name must be at least 2 characters';
          } else if (!/^[a-zA-Z\s'-]+$/.test(sanitizedValue)) {
            return 'Name can only contain letters, spaces, hyphens and apostrophes';
          }
          break;

        case 'email':
          if (!sanitizedValue.trim()) {
            return 'Email is required';
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedValue)) {
            return 'Enter a valid email address';
          } else if (sanitizedValue.length > 254) {
            return 'Email is too long';
          }
          break;

        case 'phoneNumber':
          if (!sanitizedValue.trim()) {
            return 'Phone number is required';
          }
          // Remove all non-digits for validation
          const digitsOnly = sanitizedValue.replace(/\D/g, '');
          if (digitsOnly.length < 10) {
            return 'Phone number must have at least 10 digits';
          } else if (digitsOnly.length > 15) {
            return 'Phone number is too long';
          } else if (!/^[\d\s\+\-\(\)]+$/.test(sanitizedValue)) {
            return 'Phone number contains invalid characters';
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

  // Format phone number as user types
  const formatPhoneNumber = useCallback((value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // Format based on length
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  }, []);

  // Handle input changes
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      // Sanitize input
      let processedValue = value.replace(/[<>]/g, '');

      // Format phone number if it's the phone field
      if (name === 'phoneNumber' && processedValue) {
        processedValue = formatPhoneNumber(processedValue);
      }

      setFormData((prev) => ({
        ...prev,
        [name]: processedValue,
      }));

      // Calculate password strength for password field
      if (name === 'password') {
        setPasswordStrength(calculatePasswordStrength(processedValue));
      }

      // Clear field error when user types
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));

      // Real-time validation if field was touched
      if (touchedFields[name]) {
        const fieldError = validateField(name, processedValue);
        if (fieldError) {
          setErrors((prev) => ({
            ...prev,
            [name]: fieldError,
          }));
        }
      }

      // Clear confirm password error if passwords match
      if (name === 'password' && formData.confirmPassword) {
        if (processedValue === formData.confirmPassword) {
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
      formatPhoneNumber,
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

      // Check rate limiting
      if (isRateLimited) {
        setSubmitError(
          'Too many registration attempts. Please wait 30 seconds.'
        );
        return;
      }

      if (registrationAttempts >= 3) {
        setIsRateLimited(true);
        setRateLimitTimer(Date.now());
        setSubmitError(
          'Too many registration attempts. Please wait 30 seconds.'
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
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Prepare data for submission (remove confirmPassword)
          const { confirmPassword, ...submissionData } = formData;

          // Sanitize all data one more time
          const sanitizedData = {
            ...submissionData,
            phoneNumber: submissionData.phoneNumber.replace(/\D/g, ''), // Store as digits only
          };

          console.log('Registration data ready for API:', sanitizedData);

          // Clear sensitive data
          setFormData((prev) => ({
            ...prev,
            password: '',
            confirmPassword: '',
          }));

          // Navigate to verification or dashboard
          navigate('/verify-email', {
            state: { email: formData.email },
            replace: true,
          });
        } catch (error) {
          setRegistrationAttempts((prev) => prev + 1);
          setSubmitError('Registration failed. Please try again.');
        } finally {
          setIsLoading(false);
        }
      } else {
        // Focus first field with error
        const firstErrorField = Object.keys(validationErrors)[0];
        const refMap = {
          fullName: fullNameRef,
          email: emailRef,
          phoneNumber: phoneRef,
          password: passwordRef,
          confirmPassword: confirmPasswordRef,
        };

        if (refMap[firstErrorField]?.current) {
          refMap[firstErrorField].current.focus();
        }
      }
    },
    [formData, validateForm, registrationAttempts, isRateLimited, navigate]
  );

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

  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-8 sm:px-6 lg:px-8 mt-10">
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
            {isLoading && (
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
                  Too many attempts. Please wait 30 seconds before trying again.
                </p>
              </div>
            )}

            <form
              className="space-y-5"
              onSubmit={handleSubmit}
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
                      value={formData.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="John Doe"
                      className={inputClass}
                      disabled={isLoading || isRateLimited}
                      aria-invalid={!!errors.fullName}
                      aria-describedby={
                        errors.fullName ? 'fullName-error' : undefined
                      }
                      autoComplete="name"
                      maxLength={100}
                    />
                  </div>

                  {errors.fullName && (
                    <p
                      id="fullName-error"
                      className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
                      role="alert"
                    >
                      <FiAlertCircle className="h-4 w-4" aria-hidden="true" />
                      {errors.fullName}
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
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="you@example.com"
                      className={inputClass}
                      disabled={isLoading || isRateLimited}
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? 'email-error' : undefined
                      }
                      autoComplete="email"
                      inputMode="email"
                      maxLength={254}
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
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="(555) 555-5555"
                      className={inputClass}
                      disabled={isLoading || isRateLimited}
                      aria-invalid={!!errors.phoneNumber}
                      aria-describedby={
                        errors.phoneNumber ? 'phoneNumber-error' : undefined
                      }
                      autoComplete="tel"
                      inputMode="numeric"
                      maxLength={20}
                    />
                  </div>

                  {errors.phoneNumber && (
                    <p
                      id="phoneNumber-error"
                      className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
                      role="alert"
                    >
                      <FiAlertCircle className="h-4 w-4" aria-hidden="true" />
                      {errors.phoneNumber}
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
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Create a password"
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
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
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
                      <p
                        id="password-strength"
                        className="text-xs text-slate-500"
                      >
                        Use at least 8 characters with uppercase, lowercase, and
                        numbers
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
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Confirm your password"
                    className={inputClass}
                    disabled={isLoading || isRateLimited}
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={
                      errors.confirmPassword
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

              {/* Terms and Privacy */}
              <div className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  disabled={isLoading || isRateLimited}
                  required
                  aria-required="true"
                />
                <label htmlFor="terms" className="text-slate-600">
                  I agree to the{' '}
                  <NavLink
                    to="/terms"
                    className="font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
                    tabIndex={isLoading || isRateLimited ? -1 : 0}
                  >
                    Terms of Service
                  </NavLink>{' '}
                  and{' '}
                  <NavLink
                    to="/privacy"
                    className="font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
                    tabIndex={isLoading || isRateLimited ? -1 : 0}
                  >
                    Privacy Policy
                  </NavLink>
                </label>
              </div>

              {/* Submit Button */}
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
                aria-label="Create your account"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
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
                  ${isLoading || isRateLimited ? 'pointer-events-none opacity-50' : ''}
                `}
                tabIndex={isLoading || isRateLimited ? -1 : 0}
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
  );
};

export default RegisterPage;
