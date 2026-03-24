/**
 * File: save_her/src/SoftwareApplication/dashboard/dashboard_components/QuickActions.jsx
 * Updated: 2026-02-04
 * 
 * Purpose:
 * - Displays 4 quick action cards for main dashboard functions
 * - Each card has icon, title, description, and color-coded action button
 * 
 * Changes:
 * - Added React Icons for all action cards
 * - Implemented responsive grid layout (1-col mobile, 2-col tablet, 4-col desktop)
 * - Added hover effects and transitions matching reference design
 * - Preserved original color scheme (#FF4D4D, #6C63FF, #10B981, #F59E0B)
 * 
 * Connected Modules:
 * - Used in DashboardMain.jsx as main navigation hub
 * 
 * Dependencies:
 * - react-icons/ri for all icons (Remix Icon library)
 */

import React from 'react';
import { 
  RiAlarmWarningLine, 
  RiFileAddLine, 
  RiUserAddLine, 
  RiCommunityLine,
  RiArrowRightLine 
} from 'react-icons/ri';

const QuickActions = () => {
  const actions = [
    {
      id: 1,
      title: 'Activate SOS',
      description: 'Send emergency alert with location & audio',
      icon: RiAlarmWarningLine,
      color: '#FF4D4D',
      bgColor: 'bg-red-50',
      link: '/sos'
    },
    {
      id: 2,
      title: 'Report Incident',
      description: 'Submit a new safety incident report',
      icon: RiFileAddLine,
      color: '#6C63FF',
      bgColor: 'bg-purple-50',
      link: '/incident-reports'
    },
    {
      id: 3,
      title: 'Add Contact',
      description: 'Add emergency contact for quick access',
      icon: RiUserAddLine,
      color: '#10B981',
      bgColor: 'bg-green-50',
      link: '/contacts'
    },
    {
      id: 4,
      title: 'Community Posts',
      description: 'Connect with the community for support',
      icon: RiCommunityLine,
      color: '#F59E0B',
      bgColor: 'bg-yellow-50',
      link: '/community'
    }
  ];

  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <a
              key={action.id}
              href={action.link}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-full p-6 hover:scale-[1.02]"
            >
              <div className="flex flex-col h-full">
                <div className={`w-14 h-14 ${action.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                  <IconComponent className="text-2xl" style={{ color: action.color }} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed flex-1">{action.description}</p>
                <div className="flex items-center text-sm font-medium mt-4" style={{ color: action.color }}>
                  <span>Get Started</span>
                  <RiArrowRightLine className="ml-1" />
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActions;