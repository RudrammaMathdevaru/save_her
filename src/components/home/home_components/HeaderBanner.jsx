import React from "react";
import { NavLink } from "react-router-dom";
import { ArrowRight, BellRing, MapPin } from "lucide-react";

import backgroundImage from "../../../assets/images/backgrond1.jpg";
import logoImage from "../../../assets/images/logo.png";
import safetyImage from "../../../assets/images/safety imge.png";

const HeaderBanner = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#020617] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#020b4a]/90 via-[#05114d]/85 to-[#020617]/90" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(59,130,246,0.18),transparent_25%),radial-gradient(circle_at_75%_30%,rgba(139,92,246,0.18),transparent_25%),radial-gradient(circle_at_50%_80%,rgba(34,211,238,0.12),transparent_25%)]" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-0 h-full w-[1px] bg-cyan-300/15" />
        <div className="absolute left-[30%] top-0 h-full w-[1px] bg-cyan-300/10" />
        <div className="absolute left-[55%] top-0 h-full w-[1px] bg-cyan-300/10" />
        <div className="absolute left-0 top-[70%] h-[1px] w-full bg-cyan-300/10" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1440px] items-center px-4 sm:px-6 lg:px-12">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="pb-8 pt-24 lg:pb-0 lg:pt-10">
            <div className="mb-6 sm:mb-8">
              <img
                src={logoImage}
                alt="SafeHer Logo"
                className="h-14 sm:h-20 lg:h-24"
              />
            </div>

            <div className="max-w-[640px]">
              <h1 className="text-[34px] font-extrabold leading-tight text-white sm:text-[46px] lg:text-[56px] xl:text-[64px]">
                Your Safety,
                <br />
                Our Priority.
              </h1>
            </div>

            <div className="mt-5 max-w-[620px] sm:mt-6">
              <p className="text-[15px] leading-relaxed text-white/90 sm:text-[18px] lg:text-[20px]">
                Join our community-based safety platform. Report incidents,
                activate instant SOS alerts, and help create safer spaces for
                everyone. Together, we build a network of protection and
                support.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <NavLink
                to="/register"
                className="group inline-flex h-[52px] w-full min-w-[200px] items-center justify-center rounded-xl bg-gradient-to-r from-[#6366f1] to-[#a855f7] px-6 text-[16px] font-semibold text-white shadow-lg transition hover:scale-[1.03] sm:h-[54px] sm:w-auto"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
              </NavLink>

              <NavLink
                to="/login"
                className="inline-flex h-[52px] w-full min-w-[150px] items-center justify-center rounded-xl border border-white/40 bg-white/5 px-6 text-[16px] font-semibold text-white backdrop-blur-md transition hover:bg-white hover:text-[#1d4ed8] sm:h-[54px] sm:w-auto"
              >
                Sign In
              </NavLink>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute top-1/2 h-[220px] w-[220px] -translate-y-1/2 rounded-full bg-violet-500/20 blur-3xl sm:h-[260px] sm:w-[260px]" />

            <div className="relative w-full max-w-[460px] rounded-[18px] border border-white/20 bg-white/10 p-3 shadow-xl backdrop-blur-xl sm:p-4">
              <div className="relative overflow-hidden rounded-[14px] bg-[#f5f3ff] p-4 sm:p-6">
                <img
                  src={safetyImage}
                  alt="SafeHer Banner"
                  className="mx-auto w-[180px] sm:w-[230px] lg:w-[260px]"
                />

                <div className="absolute left-4 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#8b5cf6] text-white shadow-lg sm:left-5 sm:top-8 sm:h-12 sm:w-12">
                  <BellRing className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>

                <div className="absolute right-4 top-7 flex h-10 w-10 items-center justify-center rounded-full bg-[#a855f7] text-white shadow-lg sm:right-5 sm:top-10 sm:h-12 sm:w-12">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#020617] to-transparent sm:h-32" />
    </section>
  );
};

export default HeaderBanner;