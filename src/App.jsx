import React from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  return (
    <BrowserRouter>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>Mahaspice | Powered by Webhost Devs</title>
        <meta 
          name="description" 
          content="Discover Mahaspice, the ultimate catering service provider powered by Webhost Devs. Premium event catering solutions with a tech-savvy touch." 
        />
        <meta name="keywords" content="Mahaspice, Webhost Devs, Catering Services, Website Development, Tech Solutions" />
        <meta name="author" content="Webhost Devs" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.mahaspice.in/" />
        
        {/* Open Graph Tags for Social Media */}
        <meta property="og:title" content="Mahaspice | Powered by Webhost Devs" />
        <meta property="og:description" content="Mahaspice offers exceptional catering services with the technical expertise of Webhost Devs, ensuring seamless operations and customer satisfaction." />
        <meta property="og:url" content="https://www.mahaspice.in/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Mahaspice | Webhost Devs" />
        <meta property="og:image" content="https://www.mahaspice.in/assets/branding-image.jpg" />

        {/* Twitter Card Meta */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mahaspice | Powered by Webhost Devs" />
        <meta name="twitter:description" content="Discover Mahaspice and Webhost Devs' collaboration for exceptional catering and technology solutions." />
        <meta name="twitter:image" content="https://www.mahaspice.in/assets/branding-image.jpg" />
      </Helmet>

      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {/* Add content dynamically */}
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
