import React from "react";
import {
  CheckCircle2,
  BadgeAlert,
  UserCheck,
  FileText,
  Smartphone,
  Heart,
} from "lucide-react";

const points = [
  {
    id: 1,
    icon: BadgeAlert,
    title: "Emergency response support",
    text: "Users can quickly activate SOS actions during unsafe situations.",
  },
  {
    id: 2,
    icon: UserCheck,
    title: "Trusted emergency contacts",
    text: "Important people can be added so help reaches the right network fast.",
  },
  {
    id: 3,
    icon: FileText,
    title: "Incident and report awareness",
    text: "Community posts and reports improve awareness about local safety concerns.",
  },
  {
    id: 4,
    icon: Smartphone,
    title: "Simple and user-friendly design",
    text: "The platform is built to be easy to use even in stressful moments.",
  },
  {
    id: 5,
    icon: CheckCircle2,
    title: "Reliable safety-focused features",
    text: "Every section is created around real safety needs and quick access.",
  },
  {
    id: 6,
    icon: Heart,
    title: "Supportive mission-driven platform",
    text: "SafeHer is made to create confidence, trust, and stronger communities.",
  },
];

const WhyChooseSafeHer = () => {
  return (
    <div className="mt-20 grid grid-cols-1 gap-10 lg:grid-cols-2">
      {/* Left */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="inline-block rounded-full bg-red-50 px-4 py-1 text-sm font-semibold text-red-500">
          Why Choose Us
        </p>

        <h3 className="mt-5 text-2xl font-bold text-slate-900 sm:text-3xl">
          More than an app, it is a safety companion
        </h3>

        <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
          SafeHer combines awareness, communication, emergency action, and
          community support in one place. This helps users feel more prepared,
          more informed, and more connected.
        </p>

        <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
          The goal is to reduce fear, improve response speed, and provide a
          platform that women can trust in everyday life.
        </p>

        <div className="mt-8 rounded-2xl bg-gradient-to-r from-[#f5f3ff] to-[#eef2ff] p-5">
          <h4 className="text-lg font-semibold text-slate-900">
            Main purpose of the platform
          </h4>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            SafeHer supports women through emergency tools, safety information,
            and community-driven awareness so they can take action with more
            confidence.
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {points.map((point) => {
          const Icon = point.icon;
          return (
            <div
              key={point.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6C63FF]/10 text-[#6C63FF]">
                <Icon size={22} />
              </div>

              <h4 className="mt-4 text-lg font-semibold text-slate-900">
                {point.title}
              </h4>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {point.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WhyChooseSafeHer;