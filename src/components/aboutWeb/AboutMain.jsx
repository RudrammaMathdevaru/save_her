/**
 * File: src/components/aboutWeb/AboutMain.jsx
 * Updated: 2026-03-11
 *
 * Purpose:
 * - About section components container with ID for scroll navigation.
 * - Wraps all about-specific components.
 *
 * Changes:
 * - Added id="about" to the container div for scroll targeting.
 */

import AboutSection from './about_web_components/AboutSection';
import AboutStats from './about_web_components/AboutStats';
import WhyChooseSafeHer from './about_web_components/WhyChooseSafeHer';

const AboutMain = () => {
  return (
    <div id="about">
      <AboutSection />
      {/* <AboutStats /> */}
      {/* <WhyChooseSafeHer /> */}
    </div>
  );
};

export default AboutMain;
