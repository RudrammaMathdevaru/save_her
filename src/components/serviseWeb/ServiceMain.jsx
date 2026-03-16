/**
 * File: src/components/serviseWeb/ServiceMain.jsx
 * Updated: 2026-03-11
 *
 * Purpose:
 * - Service section components container with ID for scroll navigation.
 * - Wraps all service-specific components.
 *
 * Changes:
 * - Added id="service" to the container div for scroll targeting.
 * - Assuming service components exist in the directory structure.
 */

import React from 'react';

// Import service components (adjust paths based on your actual files)
// These are placeholders - replace with your actual service components
const ServiceMain = () => {
  return (
    <div id="service">
      {/* Your service components go here */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service cards will be rendered by your actual components */}
            <div className="p-6 bg-slate-50 rounded-xl">
              <h3 className="text-xl font-semibold text-indigo-600 mb-3">Emergency SOS</h3>
              <p className="text-slate-600">Instant alert system with location tracking</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl">
              <h3 className="text-xl font-semibold text-indigo-600 mb-3">Safety Monitoring</h3>
              <p className="text-slate-600">24/7 real-time safety tracking and alerts</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl">
              <h3 className="text-xl font-semibold text-indigo-600 mb-3">Community Support</h3>
              <p className="text-slate-600">Connect with verified safety volunteers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceMain;