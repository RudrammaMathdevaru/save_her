import React from "react";
import { Siren, MapPin, Users, ContactRound } from "lucide-react";

const features = [
  {
    id: 1,
    title: "Instant SOS",
    description:
      "One-tap emergency alert with automatic location sharing and audio recording to your trusted contacts",
    icon: Siren,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    borderGlow: "hover:border-red-200",
  },
  {
    id: 2,
    title: "Live Location",
    description:
      "Real-time GPS tracking shared with emergency contacts during critical situations",
    icon: MapPin,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
    borderGlow: "hover:border-violet-200",
  },
  {
    id: 3,
    title: "Community Reports",
    description:
      "Share and view verified safety incidents in your area to stay informed and alert",
    icon: Users,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    borderGlow: "hover:border-emerald-200",
  },
  {
    id: 4,
    title: "Emergency Contacts",
    description:
      "Manage trusted contacts who receive instant notifications during emergencies",
    icon: ContactRound,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    borderGlow: "hover:border-amber-200",
  },
];

const FeelSafer = () => {
  return (
    <section className="relative overflow-hidden bg-[#f8fafc] py-16 sm:py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-10 h-40 w-40 rounded-full bg-violet-200/20 blur-3xl sm:h-56 sm:w-56" />
        <div className="absolute right-1/4 bottom-10 h-40 w-40 rounded-full bg-blue-200/20 blur-3xl sm:h-56 sm:w-56" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            How SafeHer Protects You
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8 sm:text-xl">
            Comprehensive safety features designed to keep you protected and connected
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 xl:mt-16 xl:grid-cols-4">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className={`group rounded-[24px] sm:rounded-[28px] border border-white/30 bg-white/70 p-6 sm:p-7 lg:p-8 text-center shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-500 ease-in-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)] ${item.borderGlow}`}
              >
                <div
                  className={`mx-auto mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full ${item.iconBg} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <Icon className={`h-8 w-8 sm:h-9 sm:w-9 ${item.iconColor}`} strokeWidth={2.2} />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-4 sm:mt-5 text-base sm:text-lg leading-7 sm:leading-8 text-slate-600">
                  {item.description}
                </p>

                <div className="mt-6 h-[2px] w-0 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-500 group-hover:w-full" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeelSafer;