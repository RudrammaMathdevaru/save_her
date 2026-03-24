/**
 * File: src/components/serviseWeb/ServiceMain.jsx
 *
 * Advanced Service Section
 * - Rich UI with icons
 * - Hover animations
 * - More content depth
 * - CTA buttons
 * - Scalable structure using data map
 */

import {
  FaBell,
  FaHeartbeat,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaShieldAlt,
  FaUserFriends,
} from 'react-icons/fa';

const services = [
  {
    icon: <FaBell size={28} />,
    title: 'Emergency SOS',
    description:
      'Trigger instant SOS alerts with one tap. Your live location is shared with trusted contacts and nearby responders in real-time.',
    points: [
      'One-tap activation',
      'Live GPS tracking',
      'Instant alerts to contacts',
    ],
  },
  {
    icon: <FaMapMarkerAlt size={28} />,
    title: 'Real-Time Tracking',
    description:
      'Stay connected with continuous location tracking. Monitor movement and ensure safety during travel or emergencies.',
    points: [
      'Accurate location updates',
      'Route tracking history',
      'Geo-fencing alerts',
    ],
  },
  {
    icon: <FaShieldAlt size={28} />,
    title: 'Safety Monitoring',
    description:
      'Advanced monitoring system that detects unusual activity and sends alerts automatically.',
    points: [
      '24/7 monitoring',
      'Smart alert detection',
      'AI-based risk analysis (future)',
    ],
  },
  {
    icon: <FaUserFriends size={28} />,
    title: 'Community Support',
    description:
      'Connect with a network of verified volunteers and nearby helpers for quick assistance.',
    points: [
      'Verified helpers',
      'Nearby assistance',
      'Community-driven safety',
    ],
  },
  {
    icon: <FaPhoneAlt size={28} />,
    title: 'Quick Call Assistance',
    description:
      'Instantly call emergency contacts or local authorities directly from the platform.',
    points: [
      'Speed dial feature',
      'Emergency numbers',
      'Voice activation (future)',
    ],
  },
  {
    icon: <FaHeartbeat size={28} />,
    title: 'Health Safety Alerts',
    description:
      'Send alerts in case of health emergencies and notify close contacts instantly.',
    points: [
      'Health-trigger alerts',
      'Emergency contact sync',
      'Future wearable integration',
    ],
  },
];

const ServiceMain = () => {
  return (
    <section id="service" className="bg-white py-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">
          Our Safety Services
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-14">
          We provide a complete safety ecosystem designed to protect you in
          real-time. From emergency alerts to community support, everything is
          built to ensure your safety, anytime and anywhere.
        </p>
      </div>

      {/* Service Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <div
            key={index}
            className="group bg-slate-50 rounded-2xl p-8 shadow-sm hover:shadow-xl transition duration-300 transform hover:-translate-y-2"
          >
            {/* Icon */}
            <div className="mb-5 text-indigo-600 group-hover:text-white bg-indigo-100 group-hover:bg-indigo-600 w-14 h-14 flex items-center justify-center rounded-full transition duration-300">
              {service.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-indigo-600 transition">
              {service.title}
            </h3>

            {/* Description */}
            <p className="text-slate-600 mb-4 text-sm leading-relaxed">
              {service.description}
            </p>

            {/* Bullet Points */}
            <ul className="text-sm text-slate-500 space-y-2 mb-6">
              {service.points.map((point, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  {point}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button className="text-indigo-600 font-medium text-sm hover:underline">
              Learn More →
            </button>
          </div>
        ))}
      </div>

      {/* Bottom CTA Section */}
      <div className="mt-20 text-center px-4">
        <h3 className="text-2xl font-semibold text-slate-900 mb-4">
          Your Safety is Our Priority
        </h3>
        <p className="text-slate-600 mb-6 max-w-xl mx-auto">
          Join our platform today and experience a smarter, faster, and more
          reliable way to stay safe. Whether you're traveling, working late, or
          in an emergency, we’ve got your back.
        </p>

        <button className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow hover:bg-indigo-700 transition duration-300">
          Get Started Now
        </button>
      </div>
    </section>
  );
};

export default ServiceMain;
