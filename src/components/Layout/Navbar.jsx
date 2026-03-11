import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Reports", path: "/reports" },
  ];

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive ? "text-indigo-600" : "text-slate-700 hover:text-indigo-600"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `px-4 py-3 rounded-xl border text-sm font-medium transition ${
      isActive
        ? "bg-indigo-50 border-indigo-300 text-indigo-600"
        : "bg-white border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300"
    }`;

  return (
    <>
      <nav className="fixed left-0 top-0 z-50 w-full px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[26px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
            <div className="flex h-20 items-center justify-between px-5 sm:px-7 lg:px-10">
              {/* Logo */}
              <NavLink
                to="/"
                className="flex shrink-0 items-center gap-4 no-underline"
              >
                <img
                  src={logo}
                  alt="SafeHer Logo"
                  className="h-12 w-12 object-contain"
                />
                <h1 className="text-[26px] font-bold tracking-tight text-indigo-600">
                  SafeHer
                </h1>
              </NavLink>

              {/* Desktop Menu */}
              <div className="hidden items-center gap-8 md:flex">
                {navLinks.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === "/"}
                    className={navLinkClass}
                  >
                    {item.name}
                  </NavLink>
                ))}

                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `rounded-2xl border px-7 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "border-indigo-400 bg-indigo-50 text-indigo-600"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`
                  }
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `rounded-2xl px-7 py-3 text-sm font-semibold text-white shadow-md transition ${
                      isActive
                        ? "bg-indigo-700"
                        : "bg-gradient-to-r from-[#5b5cf0] to-[#6d5df6] hover:opacity-95"
                    }`
                  }
                >
                  Register
                </NavLink>
              </div>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-xl border border-slate-300 bg-white p-2 text-slate-700 md:hidden"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            <div
              className={`overflow-hidden transition-all duration-300 md:hidden ${
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="border-t border-slate-200 bg-white px-5 pb-5 pt-3">
                <div className="flex flex-col gap-3">
                  {navLinks.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      end={item.path === "/"}
                      onClick={() => setIsOpen(false)}
                      className={mobileNavLinkClass}
                    >
                      {item.name}
                    </NavLink>
                  ))}

                  <NavLink
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `rounded-xl border px-4 py-3 text-center text-sm font-medium transition ${
                        isActive
                          ? "border-indigo-300 bg-indigo-50 text-indigo-600"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`
                    }
                  >
                    Login
                  </NavLink>

                  <NavLink
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `rounded-xl px-4 py-3 text-center text-sm font-medium text-white transition ${
                        isActive
                          ? "bg-indigo-700"
                          : "bg-gradient-to-r from-[#5b5cf0] to-[#6d5df6] hover:opacity-95"
                      }`
                    }
                  >
                    Register
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="h-28" />
    </>
  );
};

export default Navbar;