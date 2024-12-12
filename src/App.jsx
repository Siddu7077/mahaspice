import React from "react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import CallButton from "./components/Call";

const App = () => {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <div className="flex flex-col min-h-screen">

        <Navbar />
      </div>
      <CallButton />
      <Footer />
    </BrowserRouter>
  );
};

export default App;