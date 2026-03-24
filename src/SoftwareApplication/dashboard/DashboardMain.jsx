/**
 * File: save_her/src/SoftwareApplication/dashboard/DashboardMain.jsx
 * Updated: 2026-02-04
 *
 * Purpose:
 * - Main dashboard layout component
 * - Arranges all dashboard components in responsive grid
 * - 4-column quick actions at top, 3-column layout for reports and history
 *
 * Changes:
 * - Implemented responsive grid layout matching reference design
 * - Combined all components into proper layout structure
 * - Added container with proper padding
 * - Preserved exact spacing and hierarchy from reference
 *
 * Connected Modules:
 * - QuickActions, RecentReports, SosHistory, EmergencyContact
 *
 * Dependencies:
 * - No additional packages required
 */

import EmergencyContact from './dashboard_components/EmergencyContact';
import QuickActions from './dashboard_components/QuickActions';
import RecentReports from './dashboard_components/RecentReports';
import SosHistory from './dashboard_components/SosHistory';

const DashboardMain = () => {
  return (
    <div className="max-w-8xl mx-auto ">
      <QuickActions />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <RecentReports />
        <section>
          <SosHistory />
          <EmergencyContact />
        </section>
      </div>
    </div>
  );
};

export default DashboardMain;
