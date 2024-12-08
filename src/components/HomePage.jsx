import React from "react";
import GooglePlayIcon from "../assets/google-play.svg";
import AppStoreIcon from "../assets/app-store.svg";
import dl from "../assets/dl.png";
import db from "../assets/dl.jpg";
import dlb from "../assets/dlb.png";
import Carousel from './Carousel';
import "./del.css";
import CateringServices from "./CateringServices";
const HomePage = () => {
  return (
    <div className="bg-aliceBlue text-black font-sans ">
      {/* <div className="flex">
        <section className="py-7 p-8">
          <div className="max-w-3xl p-1  text-center">
            <h1 className="text-5xl font-extrabold mb-4 text-gray-800">
              Elevate Your Dining Experience
            </h1>
            <p className="text-lg mb-8 text-green-600 font-medium">
              Seamless Catering • Personalized Menus • Instant Bookings
            </p>

            <div>
              <h3 className="text-2xl font-extrabold  text-gray-800">
                Download Our App{" "}
              </h3>
              <div className="flex justify-center space-x-4">
                <a
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={GooglePlayIcon}
                    alt="Google Play"
                    className="w-100 h-44 hover:opacity-80 transition"
                  />
                </a>
                <a
                  href="https://www.apple.com/app-store/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={AppStoreIcon}
                    alt="App Store"
                    className="w-100 h-44 hover:opacity-80 transition"
                  />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center ">
          <img src={dl} alt="Description" className="object-contain  " />
        </section>
      </div> */}
      <Carousel />
      {/* Rest of the component remains the same */}
      <section className="py-10">
        <div className="max-w-1/2 mx-4 flex justify-evenly items-stretch space-x-4 h-[450px]">
          {[
            {
              title: "Box Genie",
              image: "https://5.imimg.com/data5/SELLER/Default/2023/2/BX/WK/QF/5331327/3cp-meal-tray-natraj.jpg",
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
              image: "https://5.imimg.com/data5/JU/UP/KR/SELLER-87393189/catering-services-500x500.jpg",
              buttonText: "Order Now",
              link: "/catering",
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
              <a
                href={link}
                className="bg-black text-center text-white w-[150px] px-6 py-2 rounded-3xl font-medium shadow-md hover:shadow-lg transition-transform transform self-center"
              >
                {buttonText}
              </a>
            </div>
          ))}
        </div>
      </section>


      <section className="p-10 max-h-[900px]">
        <h2 className="text-3xl font-bold mb-12  text-left text-green-700">
          CATERING FOR ALL OF VARIETIES
        </h2>
        <div className="max-w-[110%]  mx-auto">
          <div className="flex space-x-4 no-scrollbar pb-4 overflow-x-auto">
            {[
              {
                title: "Wedding Catering",
                description: [
                  { text: "Engagement", link: "/wedding-catering" },
                  { text: "Haldhi", link: "/wedding-catering" },
                  { text: "Pelli koduku & Pelli Kuthuru", link: "/wedding-catering" },
                  { text: "Vratham", link: "/wedding-catering" }
                ],
                image: "https://static01.nyt.com/images/2023/05/14/multimedia/FAT-INDIAN-WEDDINGS-01-hptq/FAT-INDIAN-WEDDINGS-01-hptq-articleLarge.jpg?quality=75&auto=webp&disable=upscale",
              },
              {
                title: "Corporate Events",
                description: [
                  { text: "Corporate Meeting", link: "/corporate-events" },
                  { text: "Get together", link: "/corporate-events" },
                  { text: "Celebrations", link: "/corporate-events" },
                  { text: "Birthday Parties", link: "/corporate-events" }
                ],
                image: "https://shahipakwaan.in/wp-content/uploads/2023/02/business-people-taking-snacks-from-buffet-table_1262-1701-1.png",
              },
              {
                title: "Event Caterers",
                description: [
                  { text: "Birthday", link: "/event-caterers" },
                  { text: "House warming", link: "/event-caterers" },
                  { text: "Cardel", link: "/event-caterers" },
                  { text: "Festivals", link: "/event-caterers" }
                ],
                image: "https://www.shutterstock.com/image-photo/big-family-celebrating-diwali-indian-600nw-2334107349.jpg",
              },
              {
                title: "Design your own Menu",
                description: [
                  { text: "Corporate Meetings", link: "/personalized-menu" },
                  { text: "Birthdays", link: "/personalized-menu" },
                  { text: "Marriage", link: "/personalized-menu" },
                  { text: "Reception", link: "/personalized-menu" }
                ],
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxa7JfqO3EaPKyw7DOlOFIADBQ8Y-FP7MfLw&s",
              }
            ].map(({ title, description, image }) => (
              <div
                key={title}
                className="flex-shrink-0 min-w-[22%] h-[90%]  bg-white  rounded-lg shadow-md hover:shadow-lg transition"
              >
                <img
                  src={image}
                  alt={title}
                  className="w-full h-48 object-cover  mb-4"
                />
                <div className="pl-5 pt-2" >
                  <h3 className="text-lg font-bold text-green-700">{title}</h3>
                  <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
                    {description.map(({ text, link }, index) => (
                      <li key={index}>
                        <a
                          href={link}
                          className="text-gray-600 transition"
                        >
                          {text}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <div className="text-right mt-4 pr-4 pb-4">
                    <a
                      href={`/catmenu`}
                      className="text-sm font-medium text-green-500 hover:text-green-600 transition"
                    >
                      View More
                    </a>
                  </div>
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