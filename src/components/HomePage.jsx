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
      <SocialIcons />
      <CateringCarousel />
      
      <section className="py-2 mt-6">
        <div className="max-w-7xl mx-auto flex justify-evenly items-stretch space-x-4 mb-5">
          {[
            {
              title: "Box Genie",
              image:
                "https://5.imimg.com/data5/SELLER/Default/2023/2/BX/WK/QF/5331327/3cp-meal-tray-natraj.jpg",
              buttonText: "Order Now",
              link: "/box",
            },
            {
              title: "Home Delivery",
              image: db,
              buttonText: "Order Now",
              link: "/delivery",
            },
            {
              title: "Bulk Catering",
              image:
                "https://5.imimg.com/data5/JU/UP/KR/SELLER-87393189/catering-services-500x500.jpg",
              buttonText: "Order Now",
              link: "/catering",
            },
            
          ].map(({ title, image, buttonText, link }) => (
            <div
              key={title}
              className="flex-1 bg-aliceBlue  text-black p-2 rounded-lg transition-transform transform hover:-translate-y-1 flex flex-col"
            >
              <h3 className="text-2xl font-extrabold text-gray-800 border-b-2 border-green-500 pb-2">
                {title}
              </h3>
              <div className="flex items-center justify-center pt-4 pb-4">
                <img
                  src={image}
                  alt={title}
                  className="rounded-md object-cover h-48 w-full"
                />
              </div>
              <Link
                to={link}
                className="bg-black text-center text-white w-[150px] px-6 py-2 rounded-3xl font-medium shadow-md hover:shadow-lg transition-transform transform self-center"
              >
                {buttonText}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="p-5 mx-auto max-w-7xl relative">
      <h2 className="text-3xl font-bold mb-0 text-left text-green-700">
        CATERING FOR ALL OCCASIONS
      </h2>
      
      <div className="relative p-3 m-2">
        <button
          onClick={handlePrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
        >
          <ChevronLeft className="w-6 h-6 text-green-700" />
        </button>

        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / 3)}%)`,
            }}
          >
            {items.map(({ title, description, image }, index) => (
              <div
                key={title}
                className="flex-shrink-0 w-1/3 px-4 p-5"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <div 
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleDropdown(index)}
                    >
                      <h3 className="text-lg font-bold text-green-700">{title}</h3>
                      {openDropdown === index ? (
                        <ChevronUp className="text-green-700" />
                      ) : (
                        <ChevronDown className="text-green-700" />
                      )}
                    </div>
                    
                    {openDropdown === index && (
                      <ul className="list-disc list-inside mt-4 text-sm text-gray-600">
                        {description.map(({ text, link }, descIndex) => (
                          <li key={descIndex}>
                            <Link
                              to={link}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              {text}
                            </Link>
                          </li>
                        ))}
                        <div className="text-right mt-4">
                          <Link
                            to={description[0].link}
                            className="text-sm font-medium text-green-500 hover:text-green-600"
                          >
                            View More
                          </Link>
                        </div>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
        >
          <ChevronRight className="w-6 h-6 text-green-700" />
        </button>
      </div>
    </section>
    </div>
  );
};

export default HomePage;