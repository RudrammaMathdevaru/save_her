/**
 * File: src/pages/HomePage.jsx
 * Updated: 2026-03-11
 *
 * Purpose:
 * - Landing page composing all sections in order: Home → About → Service → Contact
 * - Each section has an ID for scroll navigation
 *
 * Changes:
 * - Restructured to properly compose all landing sections
 * - Removed incorrect AboutPage import
 * - Added ServiceMain and ContactMain sections
 * - Preserved scroll behavior with section IDs
 */

import AboutMain from '../components/aboutWeb/AboutMain';
import ContactMain from '../components/contactweb/ContactMain';
import Home from '../components/home/Home';
import ServiceMain from '../components/serviseWeb/ServiceMain';

const HomePage = () => {
  return (
    <div>
      <Home />
      <AboutMain />
      <ServiceMain />
      <ContactMain />
    </div>
  );
};

export default HomePage;
