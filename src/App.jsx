/**
 * File: src/App.jsx
 * Updated: 2026-03-16
 *
 * Purpose:
 * - Root application component responsible for layout rendering.
 * - Controls visibility of Navbar and Footer based on current route.
 *
 * Changes:
 * - Introduced a dedicated condition for Footer visibility.
 * - Footer now renders ONLY on the Home route ("/").
 * - Navbar logic preserved exactly as before.
 *
 * Connected Modules:
 * - src/components/Layout/Navbar.jsx
 * - src/components/Layout/Footer.jsx
 * - src/Routes/AppRoutes.jsx
 *
 * Dependencies:
 * - react
 * - react-router-dom (useLocation for route detection)
 */

import { useLocation } from 'react-router-dom';
import Footer from './components/Layout/Footer';
import Navbar from './components/Layout/Navbar';
import AppRoutes from './Routes/AppRoutes';

function App() {
  const location = useLocation();

  /**
   * Routes where layout (Navbar + Footer) should be hidden
   * These are dashboard-specific pages
   */
  const hideLayoutRoutes = [
    '/dashboard',
    '/sos',
    '/contacts',
    '/community-posts',
    '/sos-history',
    '/profile',
  ];

  /**
   * Determines if Navbar should be hidden
   */
  const hideLayout = hideLayoutRoutes.includes(location.pathname);

  /**
   * Footer should appear ONLY on the homepage
   */
  const showFooter = location.pathname === '/';

  return (
    <>
      {!hideLayout && <Navbar />}

      <AppRoutes />

      {showFooter && <Footer />}
    </>
  );
}

export default App;
