import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./components/AuthSystem";
import LoadingScreen from "./components/LoadingScreen";
import Developers from "./components/Developers";
import {EventProvider} from "./components/EventContext"
// Create a layout component to handle navbar visibility
const Layout = ({ children }) => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/developers';

  return (
    <EventProvider>
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar />}
      {children}
    </div>
    </EventProvider>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isLoading]);

  return (
    <AuthProvider>
      <BrowserRouter>
        {isLoading && <LoadingScreen />}
        <ScrollToTop />
        <Layout>
        
          <Routes>
            <Route path="/developers" element={<Developers />} />
            
            {/* Add other routes here */}
          </Routes>
            {/* <Footer /> */}
          
        </Layout>
        
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;





