import React from "react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./components/AuthSystem";

const App = () => {
  return (
    <AuthProvider>
    <BrowserRouter>
      
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {/* Add content dynamically */}
      </div>
      <Footer />
    </BrowserRouter>
    </AuthProvider>
  );
};


export default App;
