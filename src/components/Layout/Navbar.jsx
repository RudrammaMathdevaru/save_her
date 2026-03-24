/**
 * File: src/components/Layout/Navbar.jsx
 * Updated: 2026-03-11
 *
 * Purpose:
 * - Modern, clean fixed navbar with smooth animations
 * - Handles scroll navigation for landing sections (Home, About, Service, Contact)
 * - Route navigation for Login button
 * - Fully responsive with hamburger menu for mobile/tablet
 *
 * Changes:
 * - Removed Reports link from navigation
 * - Simplified navLinks to only include scroll-based sections
 * - Removed route-based conditional rendering from DesktopLinks and MobileMenu
 * - Preserved all scroll functionality, animations, and styling
 *
 * Dependencies:
 * - react-router-dom (NavLink, useNavigate, useLocation)
 * - react-icons: ^5.0.0 (FaBars, FaTimes, FiLogIn, FiShield)
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { FiLogIn } from 'react-icons/fi';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Section IDs for scroll navigation
  const sectionIds = {
    home: 'home',
    about: 'about',
    service: 'service',
    contact: 'contact',
  };

  /* Elevate navbar on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close menu on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Smooth scroll to section */
  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80; // Approximate navbar height
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: 'smooth',
      });
      setIsOpen(false); // Close mobile menu after navigation
    }
  }, []);

  /* Handle navigation click */
  const handleNavClick = useCallback(
    (e, item) => {
      e.preventDefault();

      // All navLinks now are scroll-based sections
      if (location.pathname === '/') {
        // Already on home page, just scroll
        scrollToSection(item.sectionId);
      } else {
        // Navigate to home page first, then scroll after navigation
        navigate('/', { state: { scrollTo: item.sectionId } });
      }
    },
    [navigate, location.pathname, scrollToSection]
  );

  /* Handle scroll after navigation to home page */
  useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollTo) {
      // Small delay to ensure DOM is rendered
      setTimeout(() => {
        scrollToSection(location.state.scrollTo);
        // Clear the state to prevent re-scrolling on subsequent renders
        navigate('/', { replace: true, state: {} });
      }, 100);
    }
  }, [location, navigate, scrollToSection]);

  // All links are now scroll-based sections - Reports removed
  const navLinks = [
    { name: 'Home', path: '/', sectionId: sectionIds.home },
    { name: 'About', path: '/', sectionId: sectionIds.about },
    { name: 'Service', path: '/', sectionId: sectionIds.service },
    { name: 'Contact', path: '/', sectionId: sectionIds.contact },
  ];

  return (
    <nav
      ref={menuRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: '#ffffff',
        borderBottom: scrolled ? '1px solid #f1f5f9' : '1px solid transparent',
        boxShadow: scrolled
          ? '0 4px 24px 0 rgba(99,102,241,0.07)'
          : '0 1px 0 0 rgba(0,0,0,0.03)',
        transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* ── Main bar ─────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px',
          padding: '0 clamp(20px, 4vw, 48px)',
          maxWidth: '1440px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Logo */}
        <NavLink
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '70px', // controls logo space
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
        </NavLink>

        {/* Desktop links - all scroll-based now */}
        <DesktopLinks
          navLinks={navLinks}
          handleNavClick={handleNavClick}
          location={location}
        />

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            border: 'none',
            background: isOpen ? '#eef2ff' : '#f8fafc',
            color: isOpen ? '#6366f1' : '#64748b',
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
            flexShrink: 0,
          }}
          className="mobile-toggle"
        >
          {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </div>

      {/* ── Mobile drawer ────────────────────────────────────── */}
      <MobileMenu
        isOpen={isOpen}
        navLinks={navLinks}
        close={() => setIsOpen(false)}
        handleNavClick={handleNavClick}
        location={location}
      />

      {/* Responsive style tag */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        @media (max-width: 767px) {
          .mobile-toggle { display: flex !important; }
          .desktop-links { display: none !important; }
        }

        /* Nav link hover underline effect */
        .nav-link-item {
          position: relative;
          text-decoration: none;
          font-size: 14.5px;
          font-weight: 500;
          color: #64748b;
          padding: 4px 0;
          transition: color 0.22s ease;
          letter-spacing: 0.01em;
          cursor: pointer;
        }
        .nav-link-item::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          border-radius: 2px;
          background: #6366f1;
          transition: width 0.25s cubic-bezier(.4,0,.2,1);
        }
        .nav-link-item:hover { color: #6366f1; }
        .nav-link-item:hover::after { width: 100%; }
        .nav-link-item.active { color: #6366f1; font-weight: 600; }
        .nav-link-item.active::after { width: 100%; }

        /* Login button */
        .login-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 22px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          border: none;
          background: linear-gradient(135deg, #6366f1, #818cf8);
          color: #fff;
          box-shadow: 0 3px 14px rgba(99,102,241,0.28);
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
          letter-spacing: 0.01em;
        }
        .login-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99,102,241,0.38);
          background: linear-gradient(135deg, #4f46e5, #6366f1);
        }
        .login-btn:active { transform: translateY(0px); box-shadow: 0 2px 8px rgba(99,102,241,0.25); }
        .login-btn.active-login { background: linear-gradient(135deg, #4338ca, #4f46e5); }

        /* Mobile link items */
        .mobile-link {
          display: block;
          padding: 13px 16px;
          border-radius: 12px;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          color: #475569;
          transition: background 0.18s, color 0.18s, padding-left 0.18s;
          letter-spacing: 0.01em;
          cursor: pointer;
        }
        .mobile-link:hover { background: #f1f5f9; color: #6366f1; padding-left: 22px; }
        .mobile-link.active { background: #eef2ff; color: #6366f1; font-weight: 600; }

        /* Mobile login */
        .mobile-login {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 16px;
          border-radius: 12px;
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
          background: linear-gradient(135deg, #6366f1, #818cf8);
          color: #fff;
          margin-top: 4px;
          transition: opacity 0.2s, transform 0.2s;
          box-shadow: 0 3px 14px rgba(99,102,241,0.25);
        }
        .mobile-login:hover { opacity: 0.92; transform: translateY(-1px); }
        .mobile-login:active { transform: translateY(0); }
      `}</style>
    </nav>
  );
};

/* ── Desktop links component ─────────────────────────────── */
const DesktopLinks = ({ navLinks, handleNavClick, location }) => {
  return (
    <div
      className="desktop-links"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '36px',
      }}
    >
      {navLinks.map((item) => {
        // Check if this section is currently active (visible in viewport)
        const isActive =
          location.pathname === '/' &&
          document.getElementById(item.sectionId) &&
          window.scrollY >=
            document.getElementById(item.sectionId)?.offsetTop - 100;

        return (
          <a
            key={item.name}
            href={`/#${item.sectionId}`}
            onClick={(e) => handleNavClick(e, item)}
            className={`nav-link-item${isActive ? ' active' : ''}`}
          >
            {item.name}
          </a>
        );
      })}

      <NavLink
        to="/login"
        className={({ isActive }) =>
          `login-btn${isActive ? ' active-login' : ''}`
        }
      >
        <FiLogIn size={15} style={{ strokeWidth: 2.5 }} />
        Login
      </NavLink>
    </div>
  );
};

/* ── Mobile menu component ───────────────────────────────── */
const MobileMenu = ({ isOpen, navLinks, close, handleNavClick, location }) => (
  <div
    style={{
      overflow: 'hidden',
      maxHeight: isOpen ? '420px' : '0px',
      opacity: isOpen ? 1 : 0,
      transition:
        'max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.28s ease',
      background: '#ffffff',
      borderTop: isOpen ? '1px solid #f1f5f9' : '1px solid transparent',
    }}
  >
    <div
      style={{
        padding: '12px 16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      {navLinks.map((item) => {
        // Check if this section is currently active (visible in viewport)
        const isActive =
          location.pathname === '/' &&
          document.getElementById(item.sectionId) &&
          window.scrollY >=
            document.getElementById(item.sectionId)?.offsetTop - 100;

        return (
          <a
            key={item.name}
            href={`/#${item.sectionId}`}
            onClick={(e) => {
              handleNavClick(e, item);
              close();
            }}
            className={`mobile-link${isActive ? ' active' : ''}`}
          >
            {item.name}
          </a>
        );
      })}

      <NavLink to="/login" onClick={close} className="mobile-login">
        <FiLogIn size={16} style={{ strokeWidth: 2.5 }} />
        Login
      </NavLink>
    </div>
  </div>
);

export default Navbar;
