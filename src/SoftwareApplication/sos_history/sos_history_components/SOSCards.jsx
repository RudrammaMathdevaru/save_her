/**
 * File: src/SoftwareApplication/sos_history/sos_history_components/SOSCards.jsx
 * Updated: 2026-03-23
 *
 * Purpose:
 * - Displays statistics cards for SOS alerts
 * - Computes stats from real MySQL API data
 *
 * Changes:
 * - No changes required - component is working correctly
 * - Audio playback fix isolated to SOSHistoryTable component
 *
 * Connected Modules:
 * - SosHistoryMain.jsx (parent)
 *
 * Dependencies:
 * - react-icons/ri: All icons
 */

import {
  RiAlarmWarningLine,
  RiCheckboxCircleLine,
  RiCheckLine,
  RiCloseLine,
} from 'react-icons/ri';

const SOSCards = ({ sosHistory = [] }) => {
  const totalAlerts = sosHistory.length;

  // DB status values are lowercase: 'sent', 'failed', 'sending'
  const successfulDeliveries = sosHistory.filter(
    (item) => item.status === 'sent'
  ).length;

  const failedDeliveries = sosHistory.filter(
    (item) => item.status === 'failed'
  ).length;

  // audioUrl exists when audio was recorded and saved
  const withAudio = sosHistory.filter((item) => !!item.audioUrl).length;

  const cards = [
    {
      title: 'Successfully Delivered',
      value: successfulDeliveries,
      icon: RiCheckLine,
      color: 'green',
      bgColor: 'from-green-50 to-emerald-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
    },
    {
      title: 'Failed Delivery',
      value: failedDeliveries,
      icon: RiCloseLine,
      color: 'red',
      bgColor: 'from-red-50 to-orange-50',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200',
    },
    {
      title: 'Total SOS Alerts',
      value: totalAlerts,
      icon: RiAlarmWarningLine,
      color: 'purple',
      bgColor: 'from-purple-50 to-indigo-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
    },
    {
      title: 'With Audio Recordings',
      value: withAudio,
      icon: RiCheckboxCircleLine,
      color: 'blue',
      bgColor: 'from-blue-50 to-cyan-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`
            group relative bg-gradient-to-br ${card.bgColor}
            rounded-xl sm:rounded-2xl p-5 sm:p-6
            border ${card.borderColor}
            shadow-sm hover:shadow-xl
            transition-all duration-300 transform hover:-translate-y-1
            overflow-hidden
          `}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-current opacity-20" />
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-current opacity-10" />
          </div>

          <div className="relative">
            <div className="flex items-start justify-between mb-3">
              <div
                className={`${card.iconBg} p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}
              >
                <card.icon
                  className={`${card.iconColor} text-xl sm:text-2xl`}
                  aria-hidden="true"
                />
              </div>
              <span className="text-3xl sm:text-4xl font-bold text-gray-800 group-hover:scale-110 transition-transform duration-300">
                {card.value}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
              {card.title}
            </p>

            {totalAlerts > 0 && card.title !== 'Total SOS Alerts' && (
              <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-${card.color}-500 transition-all duration-500`}
                  style={{
                    width: `${(card.value / totalAlerts) * 100}%`,
                  }}
                />
              </div>
            )}
          </div>

          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div
              className={`absolute inset-0 rounded-xl bg-${card.color}-500/5 blur-xl`}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SOSCards;
