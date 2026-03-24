/**
 * File: src/components/Layout/AuthHeader.jsx
 * Updated: 2026-03-17
 *
 * Purpose:
 * - Minimal header for authentication pages
 * - Displays logo + back to home
 *
 * Why:
 * - Avoid distraction during login/register
 * - Improve UX focus
 *
 * Connected Modules:
 * - LoginPage.jsx
 * - RegisterPage.jsx
 * - ForgotPasswordPage.jsx
 *
 * Dependencies:
 * - react-router-dom (for navigation)
 * - react-icons/fi (for shield icon)
 */

import { useNavigate } from 'react-router-dom';

const AuthHeader = () => {
  const navigate = useNavigate();

  return (
    <header
      style={{
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
        }}
      >
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              navigate('/');
            }
          }}
          aria-label="Go to homepage"
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '60px', // controls logo space
            }}
          >
            <img
              src="/save har.jpg"
              alt="safeher"
              style={{
                height: '100%',
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          </span>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#6366f1',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '6px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f3f4f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
          }}
          aria-label="Back to website homepage"
        >
          ← Back to Website
        </button>
      </div>
    </header>
  );
};

export default AuthHeader;
