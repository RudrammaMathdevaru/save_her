/**
 * File: src/components/dashboard/dashboard_components/sos_history/sos_history_components/SOSCards.jsx
 * Updated: 2026-03-17
 *
 * Purpose:
 * - Displays statistics cards for SOS alerts
 * - Shows total alerts, successful deliveries, and failed deliveries
 * - Computes statistics from SOS history data
 *
 * Changes:
 * - Made component dynamic to receive and process SOS history data
 * - Added proper statistics calculation
 * - Improved responsive design with grid layout
 * - Enhanced visual design with gradient backgrounds and hover effects
 *
 * Connected Modules:
 * - ../SosHistoryMain.jsx (parent component)
 *
 * Dependencies:
 * - react-icons/ri: For consistent iconography
 * - No additional npm packages required
 */

import {
  RiAlarmWarningLine,
  RiCheckboxCircleLine,
  RiCheckLine,
  RiCloseLine,
} from 'react-icons/ri';

const SOSCards = ({ sosHistory = [] }) => {
  // Calculate statistics
  const totalAlerts = sosHistory.length;
  const successfulDeliveries = sosHistory.filter(
    (item) => item.status === 'Delivered'
  ).length;
  const failedDeliveries = sosHistory.filter(
    (item) => item.status === 'Failed'
  ).length;
  const withAudio = sosHistory.filter((item) => item.audioAvailable).length;

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
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-current opacity-20" />
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-current opacity-10" />
          </div>

          {/* Content */}
          <div className="relative">
            <div className="flex items-start justify-between mb-3">
              <div
                className={`${card.iconBg} p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}
              >
                <card.icon
                  className={`${card.iconColor} text-xl sm:text-2xl`}
                />
              </div>
              <span className="text-3xl sm:text-4xl font-bold text-gray-800 group-hover:scale-110 transition-transform duration-300">
                {card.value}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
              {card.title}
            </p>

            {/* Progress Bar */}
            {totalAlerts > 0 && card.title !== 'Total SOS Alerts' && (
              <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-${card.color}-500 transition-all duration-500`}
                  style={{ width: `${(card.value / totalAlerts) * 100}%` }}
                />
              </div>
            )}
          </div>

          {/* Hover Glow */}
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
