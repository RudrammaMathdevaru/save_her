import React from "react";
import { ShieldCheck, MapPin, BellRing } from "lucide-react";

const cards = [
  {
    icon: ShieldCheck,
    title: "Stay Protected",
    desc: "Access safety tools designed for quick help during emergencies.",
    bg: "bg-indigo-50",
    color: "text-indigo-600",
  },
  {
    icon: MapPin,
    title: "Track Location",
    desc: "Share your live location instantly with trusted emergency contacts.",
    bg: "bg-emerald-50",
    color: "text-emerald-600",
  },
  {
    icon: BellRing,
    title: "Instant Alerts",
    desc: "Send SOS alerts with one tap and notify your support network.",
    bg: "bg-red-50",
    color: "text-red-500",
  },
];

const HomeCards = () => {
  return (
    <section className="bg-[#f8fafc] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="rounded-2xl border border-white/20 bg-white/75 p-6 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${card.bg}`}
              >
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {card.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HomeCards;