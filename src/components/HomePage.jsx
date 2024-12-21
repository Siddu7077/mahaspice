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

const items = [
  {
    title: "Wedding Catering",
    description: [
      { text: "Engagement", link: "/events/wedding-catering" },
      { text: "Haldhi", link: "/events/wedding-catering" },
      { text: "Pelli koduku & Pelli Kuthuru", link: "/wedding-catering" },
      { text: "Vratham", link: "/events/wedding-catering" },
    ],
    image: "https://static01.nyt.com/images/2023/05/14/multimedia/FAT-INDIAN-WEDDINGS-01-hptq/FAT-INDIAN-WEDDINGS-01-hptq-articleLarge.jpg?quality=75&auto=webp&disable=upscale",
  },
  {
    title: "Corporate Events",
    description: [
      { text: "Corporate Meeting", link: "/events/corporate-events" },
      { text: "Get together", link: "/events/corporate-events" },
      { text: "Celebrations", link: "/events/corporate-events" },
      { text: "Birthday Parties", link: "/events/corporate-events" },
    ],
    image: "https://shahipakwaan.in/wp-content/uploads/2023/02/business-people-taking-snacks-from-buffet-table_1262-1701-1.png",
  },
  {
    title: "Event Caterers",
    description: [
      { text: "Birthday", link: "/events/event-caterers" },
      { text: "House warming", link: "/events/event-caterers" },
      { text: "Cardel", link: "/events/event-caterers" },
      { text: "Festivals", link: "/events/event-caterers" },
    ],
    image: "https://www.shutterstock.com/image-photo/big-family-celebrating-diwali-indian-600nw-2334107349.jpg",
  },
  {
    title: "Design your own Menu",
    description: [
      { text: "Corporate Meetings", link: "/events/personalized-menu" },
      { text: "Birthdays", link: "/events/personalized-menu" },
      { text: "Marriage", link: "/events/personalized-menu" },
      { text: "Reception", link: "/events/personalized-menu" },
    ],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxa7JfqO3EaPKyw7DOlOFIADBQ8Y-FP7MfLw&s",
  },
];



const HomePage = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  // const [openDropdown, setOpenDropdown] = useState(null);
  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };
  const totalSlides = items.length - 2;
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === totalSlides ? 0 : prevIndex + 1
      );
    }, 3000);
  
    return () => clearInterval(timer);
  }, [totalSlides]);
  

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? totalSlides : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === totalSlides ? 0 : prevIndex + 1
    );
  };



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
