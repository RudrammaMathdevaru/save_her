import React from "react";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import AppRoutes from "./Routes/AppRoutes";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  const hideLayoutRoutes = [
    "/dashboard",
    "/sos",
    "/contacts",
    "/community-posts",
    "/sos-history",
    "/profile",
  ];

  const hideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      <AppRoutes />
      {!hideLayout && <Footer />}
    </>
  );
}

export default App;