import React from "react";
import { NavLink } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

import logo from "../../assets/images/logo.png";   // import logo

const Footer = () => {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Reports", path: "/reports" },
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" },
  ];

  const legalLinks = [
    { name: "About", path: "/about" },
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms of Service", path: "/terms-of-service" },
    { name: "Contact", path: "/contact" },
  ];

  const socialLinks = [
    { icon: <Facebook size={18} />, href: "https://facebook.com", label: "Facebook" },
    { icon: <Twitter size={18} />, href: "https://twitter.com", label: "Twitter" },
    { icon: <Instagram size={18} />, href: "https://instagram.com", label: "Instagram" },
    { icon: <Linkedin size={18} />, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  const linkClass =
    "text-white/80 text-sm transition duration-300 hover:text-white hover:translate-x-1 inline-block";

  return (
    <footer className="relative w-full overflow-hidden bg-gradient-to-r from-[#4f6df5] via-[#5d63f1] to-[#6b5df0] text-white">

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute inset-0 bg-white/[0.03]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-14 pb-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">

          {/* LOGO SECTION */}
          <div>
            <div className="flex items-center gap-3 mb-5">

              {/* Logo image */}
              <img
                src={logo}
                alt="SafeHer Logo"
                className="h-12 w-auto object-contain"
              />

              <h3 className="text-2xl font-bold tracking-tight">SafeHer</h3>
            </div>

            <p className="max-w-xs text-sm leading-7 text-white/80">
              Your Safety, Our Priority. Community-based safety and instant
              emergency response.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="mb-5 text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <NavLink to={link.path} className={linkClass}>
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="mb-5 text-lg font-semibold text-white">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <NavLink to={link.path} className={linkClass}>
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h4 className="mb-5 text-lg font-semibold text-white">
              Connect With Us
            </h4>

            <div className="flex items-center gap-4 flex-wrap">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/90 backdrop-blur-md transition duration-300 hover:scale-110 hover:bg-white/20 hover:text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-white/20" />

        {/* Copyright */}
        <div className="pt-6 text-center text-sm text-white/75">
          © 2024 SafeHer. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;