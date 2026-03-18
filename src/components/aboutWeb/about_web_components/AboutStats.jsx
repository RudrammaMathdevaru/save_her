/**
 * File: src/components/about/AboutStats.jsx
 * Updated: 2024-02-04
 *
 * Purpose:
 * - Displays platform statistics and key features in a responsive card grid
 * - Shows 4 key metrics with icons, values, and descriptions
 *
 * Changes:
 * - Added proper container with max-width and auto margins to prevent overflow
 * - Improved responsive grid breakpoints for better screen coverage
 * - Added width constraints to cards to prevent overflow
 * - Made icon container responsive on smallest screens
 * - Added overflow-hidden to prevent any content spillage
 * - Preserved all existing styling, animations, and functionality
 *
 * Connected Modules:
 * - Used in about page/section to display platform stats
 *
 * Dependencies:
 * - lucide-react: For consistent icon set (already in use)
 * - No additional npm packages required
 */

import { BellRing, MapPin, ShieldCheck, Users } from 'lucide-react';

const stats = [
  {
    id: 1,
    icon: Users,
    value: '10K+',
    title: 'Community Members',
    description:
      'A growing network of users connected for awareness, safety, and support.',
  },
  {
    id: 2,
    icon: ShieldCheck,
    value: '24/7',
    title: 'Safety Focus',
    description:
      'Designed to support safety needs anytime, whether at home, work, or while traveling.',
  },
  {
    id: 3,
    icon: MapPin,
    value: 'Live',
    title: 'Location Tracking',
    description:
      'Real-time location sharing helps trusted contacts respond more effectively.',
  },
  {
    id: 4,
    icon: BellRing,
    value: '1 Tap',
    title: 'SOS Alert',
    description:
      'A simple emergency action flow helps users alert their trusted people quickly.',
  },
];

const AboutStats = () => {
  return (
    <div className="w-full overflow-hidden mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            SafeHer at a glance
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            These highlights help users quickly understand the value and purpose
            of the platform.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="w-full rounded-3xl border border-slate-200 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6C63FF]/10 text-[#6C63FF] sm:h-14 sm:w-14">
                  <Icon size={20} className="sm:h-[26px] sm:w-[26px]" />
                </div>

                <h4 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                  {item.value}
                </h4>

                <p className="mt-2 text-base font-semibold text-slate-800 sm:text-lg">
                  {item.title}
                </p>

                <p className="mt-3 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AboutStats;
