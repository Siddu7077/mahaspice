import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EventCatMenu from "./components/EventCatMenu";
import ServiceDetailsPage from "./components/CateringServices";
import DeliveryMenu from "./components/Delivery";
import MealBox from "./components/BoxGenie";

const App = () => {
  return (
    <>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/catmenu" element={<EventCatMenu />} />
          <Route path="/delivery" element={<DeliveryMenu />} />
          <Route path="/box" element={<MealBox />} />
          <Route path="/catering-services" element={<ServiceDetailsPage />} />
        </Routes>
      </Router>
      <Footer />
    </>
  );
};

export default App;
