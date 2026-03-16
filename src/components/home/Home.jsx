/**
 * File: src/components/home/Home.jsx
 * Updated: 2026-03-11
 *
 * Purpose:
 * - Home section components container with ID for scroll navigation.
 * - Wraps all home-specific components with proper section ID.
 *
 * Changes:
 * - Added id="home" to the container div for scroll targeting.
 * - Preserved all existing component imports and structure.
 */

import FeelSafer from './home_components/FeelSafer';
import HeaderBanner from './home_components/HeaderBanner';
import HomeCards from './home_components/HomeCards';
import ReadyTo from './home_components/ReadyTo';
import RecentReports from './home_components/RecentReports';

const Home = () => {
  return (
    <div id="home">
      <HeaderBanner />
      <HomeCards />
      <FeelSafer />
      <RecentReports />
      <ReadyTo />
    </div>
  );
};

export default Home;
