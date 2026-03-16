import React from "react";
import { Users, ShieldCheck, MapPin, BellRing } from "lucide-react";

const stats = [
  {
    id: 1,
    icon: Users,
    value: "10K+",
    title: "Community Members",
    description:
      "A growing network of users connected for awareness, safety, and support.",
  },
  {
    id: 2,
    icon: ShieldCheck,
    value: "24/7",
    title: "Safety Focus",
    description:
      "Designed to support safety needs anytime, whether at home, work, or while traveling.",
  },
  {
    id: 3,
    icon: MapPin,
    value: "Live",
    title: "Location Tracking",
    description:
      "Real-time location sharing helps trusted contacts respond more effectively.",
  },
  {
    id: 4,
    icon: BellRing,
    value: "1 Tap",
    title: "SOS Alert",
    description:
      "A simple emergency action flow helps users alert their trusted people quickly.",
  },
];

const AboutStats = () => {
  return (
    <div className="mt-20">
      <div className="mx-auto max-w-3xl text-center">
        <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          SafeHer at a glance
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
          These highlights help users quickly understand the value and purpose
          of the platform.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6C63FF]/10 text-[#6C63FF]">
                <Icon size={26} />
              </div>

              <h4 className="mt-4 text-3xl font-bold text-slate-900">
                {item.value}
              </h4>

              <p className="mt-2 text-lg font-semibold text-slate-800">
                {item.title}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AboutStats;