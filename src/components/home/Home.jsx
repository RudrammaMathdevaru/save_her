import React from "react";
import FeelSafer from "./home_components/FeelSafer";
import HeaderBanner from "./home_components/HeaderBanner";
import HomeCards from "./home_components/HomeCards";
import RecentReports from "./home_components/RecentReports";
import ReadyTo from "./home_components/ReadyTo";

const Home = () => {
  return (
    <div>
      <HeaderBanner />
      <HomeCards />
      <FeelSafer />
      <RecentReports />
      <ReadyTo />
    </div>
  );
};
export default Home;