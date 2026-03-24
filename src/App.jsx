/**
 * File: src/App.jsx
 * Updated: 2026-03-17
 *
 * Purpose:
 * - Root layout controller
 * - Separates Website (public) from Software Application (dashboard)
 *
 * Changes:
 * - Added conditional rendering for software application routes
 * - Clean separation: website gets navbar/footer, software app gets sidebar/topbar
 *
 * Connected Modules:
 * - Navbar.jsx (website)
 * - Footer.jsx (website)
 * - AppRoutes.jsx (website routes)
 * - SoftwareApplicationRoutes.jsx (software app routes with layout)
 */

import { useLocation } from 'react-router-dom';
import Footer from './components/Layout/Footer';
import Navbar from './components/Layout/Navbar';
import AppRoutes from './Routes/AppRoutes';
import SoftwareApplicationRoutes from './SoftwareApplication/routes_for_software_application/SoftwareApplicationRoutes';

function App() {
  const location = useLocation();

  /**
   * Software Application Routes
   * These routes will show the SideBar + TopBar layout
   */
  const softwareAppRoutes = [
    '/dashboard',
    '/sos',
    '/contacts',
    '/community-posts',
    '/sos-history',
    '/profile',
    '/incident-reports',
  ];

  /**
   * Check if current route is a software application route
   */
  const isSoftwareAppRoute = softwareAppRoutes.includes(location.pathname);

  /**
   * Auth pages (no navbar, but also not software app)
   */
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(
    location.pathname
  );

  /**
   * Show footer only on homepage
   */
  const showFooter = location.pathname === '/';

  return (
    <>
      {isSoftwareAppRoute ? (
        /* Software Application Layout (Dashboard) */
        <SoftwareApplicationRoutes />
      ) : (
        /* Website Layout */
        <>
          {/* Hide navbar on auth pages */}
          {!isAuthPage && <Navbar />}

          {/* Website Routes */}
          <AppRoutes />

          {/* Footer only on homepage */}
          {showFooter && <Footer />}
        </>
      )}
    </>
  );
}

export default App;
