import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from 'lucide-react';
import GooglePlayIcon from "../assets/google-play.svg";
import AppStoreIcon from "../assets/app-store.svg";
import db from "../assets/dl.jpg";
import CateringCarousel from "./Carousel";
import "./del.css";
import SocialIcons from "./SocialIcons";
import SuperFastDelivery from "./SFD";

const HomePage = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <div className="bg-aliceBlue text-black font-sans">
      <SocialIcons />
      <CateringCarousel />
      
      <section className="py-10">
        <div className="max-w-1/2 mx-4 flex justify-evenly items-stretch space-x-4 h-[450px]">
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
              link: "/catering-services",
            },
            
          ].map(({ title, image, buttonText, link }) => (
            <div
              key={title}
              className="flex-1 bg-aliceBlue text-black p-6 rounded-lg transition-transform transform hover:-translate-y-1 flex flex-col"
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

      <section className="p-10 max-h-[900px]">
        <h2 className="text-3xl font-bold mb-12 text-left text-green-700">
          CATERING FOR ALL OF VARIETIES
        </h2>
        <div className="max-w-[100%] mx-auto">
          <div className="flex space-x-4 no-scrollbar pb-4 overflow-x-auto">
            {[
              {
                title: "Wedding Catering",
                description: [
                  { text: "Engagement", link: "/events/wedding-catering" },
                  { text: "Haldhi", link: "/events/wedding-catering" },
                  {
                    text: "Pelli koduku & Pelli Kuthuru",
                    link: "/wedding-catering",
                  },
                  { text: "Vratham", link: "/events/wedding-catering" },
                ],
                image:
                  "https://static01.nyt.com/images/2023/05/14/multimedia/FAT-INDIAN-WEDDINGS-01-hptq/FAT-INDIAN-WEDDINGS-01-hptq-articleLarge.jpg?quality=75&auto=webp&disable=upscale",
              },
              {
                title: "Corporate Events",
                description: [
                  { text: "Corporate Meeting", link: "/events/corporate-events" },
                  { text: "Get together", link: "/events/corporate-events" },
                  { text: "Celebrations", link: "/events/corporate-events" },
                  { text: "Birthday Parties", link: "/events/corporate-events" },
                ],
                image:
                  "https://shahipakwaan.in/wp-content/uploads/2023/02/business-people-taking-snacks-from-buffet-table_1262-1701-1.png",
              },
              {
                title: "Event Caterers",
                description: [
                  { text: "Birthday", link: "/events/event-caterers" },
                  { text: "House warming", link: "/events/event-caterers" },
                  { text: "Cardel", link: "/events/event-caterers" },
                  { text: "Festivals", link: "/events/event-caterers" },
                ],
                image:
                  "https://www.shutterstock.com/image-photo/big-family-celebrating-diwali-indian-600nw-2334107349.jpg",
              },
              {
                title: "Design your own Menu",
                description: [
                  { text: "Corporate Meetings", link: "/events/personalized-menu" },
                  { text: "Birthdays", link: "/events/personalized-menu" },
                  { text: "Marriage", link: "/events/personalized-menu" },
                  { text: "Reception", link: "/events/personalized-menu" },
                ],
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxa7JfqO3EaPKyw7DOlOFIADBQ8Y-FP7MfLw&s",
              },
            ].map(({ title, description, image }, index) => (
              <div
                key={title}
                className="flex-shrink-0 max-w-[350px] min-w-[22%] h-[90%] bg-white rounded-lg shadow-md transition overflow-hidden"
              >
                <img
                  src={image}
                  alt={title}
                  className="w-full h-48 object-cover mb-4"
                />
                <div className="pl-5 pt-2">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleDropdown(index)}
                  >
                    <h3 className="text-lg font-bold text-green-700 mb-4">{title}</h3>
                    {openDropdown === index ? (
                      <ChevronUp className="mr-4 text-green-700" />
                    ) : (
                      <ChevronDown className="mr-4 text-green-700" />
                    )}
                  </div>
                  
                  {openDropdown === index && (
                    <ul className="list-disc list-inside mt-2 text-sm text-gray-600 transition-all duration-300 ease-in-out">
                      {description.map(({ text, link }, descIndex) => (
                        <li key={descIndex}>
                          <Link
                            to={link}
                            className="text-gray-600 transition hover:text-gray-800"
                          >
                            {text}
                          </Link>
                          
                        </li>
                        
                      ))}
                      <div className="text-right mt-4 pr-4 pb-4">
                    <Link
                      to={description[0].link}
                      className="text-sm font-medium text-green-500 hover:text-green-600 transition"
                    >
                      View More
                    </Link>
                  </div>
                    </ul>
                    
                  )}
                  
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;