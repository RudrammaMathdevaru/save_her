import React from "react";
import { NavLink } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

const ReadyTo = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#5b5cf0] via-[#6366f1] to-[#6d5df6] pt-16 sm:pt-20 lg:pt-28 pb-0 -mb-px">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-44 w-44 sm:h-60 sm:w-60 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-44 w-44 sm:h-60 sm:w-60 rounded-full bg-violet-300/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07),transparent_55%)]" />
      </div>

      <div className="pointer-events-none absolute left-[15%] top-[22%] h-3 w-3 rounded-full bg-white/40 blur-[2px]" />
      <div className="pointer-events-none absolute right-[18%] top-[30%] h-3 w-3 rounded-full bg-violet-200/50 blur-[2px]" />
      <div className="pointer-events-none absolute left-[30%] bottom-[20%] h-2.5 w-2.5 rounded-full bg-white/30 blur-[2px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-5 sm:mb-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs sm:text-sm font-medium text-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(255,255,255,0.08)]">
            <ShieldCheck className="h-4 w-4" />
            Trusted by women-first communities
            <Sparkles className="h-4 w-4" />
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
            Ready to Feel Safer?
          </h2>

          <p className="mx-auto mt-5 sm:mt-6 max-w-3xl text-base sm:text-xl lg:text-[22px] leading-7 sm:leading-8 text-white/90">
            Join thousands of women who trust SafeHer for their safety and peace
            of mind
          </p>

          <div className="mt-8 sm:mt-10 flex justify-center">
            <NavLink
              to="/register"
              className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl border-2 border-white/70 bg-white/10 px-6 sm:px-12 py-4 sm:py-5 text-base sm:text-lg font-semibold text-white backdrop-blur-xl shadow-[0_12px_35px_rgba(255,255,255,0.10)] transition-all duration-300 hover:scale-[1.05] hover:bg-white hover:text-[#5b5cf0] hover:shadow-[0_18px_45px_rgba(255,255,255,0.18)]"
            >
              Create Your Free Account
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </NavLink>
          </div>

          <div className="mx-auto mt-12 sm:mt-16 w-full max-w-6xl border-t border-white/20" />
        </div>
      </div>
    </section>
  );
};

export default ReadyTo;