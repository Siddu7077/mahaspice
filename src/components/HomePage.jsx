import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import GooglePlayIcon from "../assets/google-play.svg";
import AppStoreIcon from "../assets/app-store.svg";
import db from "../assets/dl.jpg";
import CateringCarousel from "./Carousel";
import "./del.css";
import SocialIcons from "./SocialIcons";
import SuperFastDelivery from "./SFD";
import SectionTwo from "./SectionTwo";
import SectionThree from "./SectionThree";
import ScrollToTop from "./ScrollToTop";

const HomePage = () => {
  



  return (
    <div className="bg-aliceBlue text-black font-sans">
      <ScrollToTop />
      <SocialIcons />
      <CateringCarousel />
      <SectionTwo/>
      <SectionThree/>
      

      
    </div>
  );
};

export default HomePage;
