import React, { useState } from "react";
import { Link, useRoutes } from "react-router-dom";
import {
  Home,
  Users,
  Settings,
  Search,
  Menu,
  BarChart,
  ShieldCheck,
  Folder,
  UserPlus,
  CopyPlus,
  UserCog,
  Edit, ShoppingCart
} from "lucide-react";
import { Phone } from 'lucide-react';

import { FaRing, FaBuilding, FaUtensils, FaBookOpen, FaChevronDown } from "react-icons/fa";
import { AiOutlineMenu, AiOutlineSearch } from "react-icons/ai";
import { FaServicestack } from "react-icons/fa";
import { MdContactMail } from "react-icons/md";
import { BiMessageDetail } from "react-icons/bi";
import { GiMeal } from "react-icons/gi";
import logo from "../assets/logo-main.png";
import user from "../assets/user.png";

import HomePage from "./HomePage";
import About from "../About";
import ContactForm from "./ContactForm";
import FeedbackForm from "../Feedback";
import EventCatMenu from "./EventCatMenu";
import MealBox from "./BoxGenie";
import DeliveryMenu from "./Delivery";
import EventsPage from "./EventsPage";
import eventCategories from './eventCategories.json';
import Footer from "./Footer";
import MenuPage from "./Menu";
import MenuSelection from "./MenuDetails";
import MenuOrder from "./MenuOrder";
import BulkCatering from "./BulkCatering";
import SuperFastDelivery from "./SuperFastDelivery";
import SectionTwo from "./SectionTwo";
import CartPage from "./CartPage";
import MealOrderForm from "./MealOrderForm";
import RefundCancellation from "./RefundCancellation";
import PrivacyPolicy from "./PrivacyPolicy";
// import Shipping from "./Shipping";
import TermsConditions from "./TermsConditions";
import ReturnPolicy from "./ReturnPolicy";
import CheckOutform from "./CheckOutform";
import ScrollToTop from "./ScrollToTop";

const Navbar = () => {
  const [isNavExpanded, setIsNavExpanded] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Define routes
  const routing = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/superfastDelivery", element: <SuperFastDelivery /> },
    { path: "/about", element: <About /> },
    { path: "/contact", element: <ContactForm /> },
    { path: "/feedback", element: <FeedbackForm /> },
    { path: "/catmenu", element: <EventCatMenu /> },
    { path: "/delivery", element: <DeliveryMenu /> },
    { path: "/catering", element: <BulkCatering /> },
    { path: "/box", element: <MealBox /> },
    // { path: "/sc", element: <SectionTwo /> },
    // { path: "/addmenu", element: <AddMenu /> },
    // { path: "/editmenu/:id", element: <EditMenuPage /> },
    // { path: "/adminmenu", element: <AdminMenuPage /> },
    // { path: "/addcategory", element: <AddCategory /> },
    // { path: "/addcarousel", element: <AddCarousel /> },
    // { path: "/admincategory", element: <AdminEditCategory /> },
    // { path: "/editcategory/:id", element: <EditCategoryById /> },
    // { path: "/addevent", element: <EventCategoryForm /> },
    // { path: "/admineventdisplay", element: <EventDisplayPage /> },
    // { path: "/admineventedit/:id", element: <EventEditPage /> },
    // { path: "/admin", element: <Admin /> },

    // { path: "/addMealBox", element: <AddMealBox /> },
    // { path: "/addcp", element: <AddCP /> },
    // { path: "/addcps", element: <AddCPS /> },
    // { path: "/displaycp", element: <CPDisplay /> },
    // { path: "/displaycps", element: <CPTypesDisplay /> },
    // { path: "/carousel", element: <CarouselDisplay /> },
    { path: "/cart", element: <CartPage /> },
    { path: "/refund-cancellation", element: <RefundCancellation /> },
    { path: "/privacy-policy", element: <PrivacyPolicy /> },
    // { path: "/shipping", element: <Shipping /> },
    { path: "/terms-conditions", element: <TermsConditions /> },
    { path: "/return-policy", element: <ReturnPolicy /> },
    { path: "/checkoutform", element: <CheckOutform /> },



    { path: "/events/:eventType/:serviceType/Menu/:categoryName/order", element: <MenuOrder /> },
    {
      path: "/events/:eventType",
      element: <EventsPage />
    },
    {
      path: "/events/:eventType/:serviceType/Menu",
      element: <MenuPage />
    },
    {
      path: "/superfast",
      element: <MealOrderForm />
    },
    {
      path: "/events/:eventType/:serviceType/Menu/:categoryName",
      element: <MenuSelection />
    }
  ]);

  const handleCall = () => {
    // Multiple approaches to handle call initiation
    try {
        
        window.location.href = 'tel:+919697798888';

        
        const a = document.createElement('a');
        a.href = 'tel:+919697798888';
        a.click();
    } catch (error) {
        
        alert('Call +91 969779 8888');
    }
};


  const toggleNavbar = () => {
    setIsNavExpanded(!isNavExpanded);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const navItems = [
    { icon: <Home />, label: "Home", key: "home", path: "/" },
    { icon: <Users />, label: "About", key: "about", path: "/about" },
    { icon: <FaServicestack />, label: "Services", key: "services", path: "/services" },
    { icon: <MdContactMail />, label: "Contact", key: "contact", path: "/contact" },
    // { icon: <BiMessageDetail />, label: "Feedback", key: "feedback", path: "/feedback" },
    { icon: <GiMeal />, label: "Custom Order", key: "customorder", path: "/" },
    // { icon: <UserCog />, label: "Admin Dashboard", key: "admin", path: "/admin" },
    // { icon: <UserCog />, label: "Superfast Delivery", key: "Superfast Delivery", path: "/superfast-delivery" },

  ];

  const toggleDropdown = (category) => {
    setOpenDropdown(openDropdown === category ? null : category);
  };

  const renderDropdownItems = (category) => {
    return eventCategories[category].map((item, index) => (
      <li
        key={index}
        className="px-4 py-2 hover:bg-green-100 cursor-pointer"
        onClick={() => {
          setSelectedComponent(category);
          setOpenDropdown(null);
        }}
      >
        {item}
      </li>
    ));
  };

  const dropdownConfig = [
    {
      key: "wedding-events",
      icon: '',
      label: "Wedding Events"
    },
    {
      key: "corporate-events",
      icon: '',
      label: "Corporate Events"
    },
    {
      key: "event-catering",
      icon: '',
      label: "Event Catering"
    },

  ];

  return (
    <div className="flex h-screen bg-white text-black ">
      <ScrollToTop />
      {/* Left Sidebar */}
      <div
        className={`${isNavExpanded ? "w-64" : "w-44"
          } h-full transition-all duration-300 bg-white border-r border-green-200`}
      >
        <div className="p-4 flex items-center justify-between"
        >
          <Link
            to="/" >
            <img
              src={logo}
              alt="Logo"
              className={`${isNavExpanded ? "block" : "hidden"} h-30 w-64`}
            />
            <img
              src={logo}
              alt="Logo"
              className={`${isNavExpanded ? "hidden" : "block"} h-30 w-55`}
            />
          </Link>
        </div>
        <nav className="mt-4">
          <div className="mb-4">
            <h3
              className={`px-4 mx-auto mb-2 ${!isNavExpanded && "text-center"
                } text-sm font-bold text-green-800`}
            >
              Navigation
            </h3>
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={`flex ${!isNavExpanded && "justify-center"
                  } ml-4 items-center p-3 cursor-pointer ${selectedComponent === item.key
                    ? "bg-green-500 text-white"
                    : "hover:bg-green-50"
                  }`}
              >
                {item.icon}
                {isNavExpanded && (
                  <span
                    className={`ml-3 ${selectedComponent === item.key
                      ? "text-white"
                      : " text-green-800"
                      }`}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </nav>
      </div>
      {/* Top Navigation and Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header Section */}
        <header className="flex items-center justify-between p-2 bg-white text-black shadow-md">
          {/* Left Section: Menu Button */}
          <div className="flex items-center space-x-2">
            <button onClick={toggleNavbar} className="p-1 text-green-500">
              <AiOutlineMenu className="w-6 h-8" />
            </button>
          </div>

          {/* Right Section: Navigation, Search, Cart, and User Profile */}
          <div className="flex items-center justify-between w-full">
            {/* Navigation Links */}
            <nav className="flex items-center justify-between pl-2 space-x-2">
              <Link
                to="/superfast"
                className={`text-md pr-2 font-extrabold cursor-pointer ${selectedComponent === "Superfast"
                  ? "text-green-600 font-bold"
                  : "text-black hover:text-green-500"
                  }`}
              >
                Superfast Delivery
              </Link>
              <Link
                to="/box"
                className={`text-xs pr-2 cursor-pointer ${selectedComponent === "Box Genie"
                  ? "text-green-600 font-bold"
                  : "text-black hover:text-green-500"
                  }`}
              >
                Box Genie
              </Link>
              <Link
                to="/delivery"
                className={`text-xs pr-2 cursor-pointer ${selectedComponent === "Home Delivery"
                  ? "text-green-600 font-bold"
                  : "text-black hover:text-green-500"
                  }`}
              >
                Home Delivery
              </Link>

              {dropdownConfig.map((item) => (
                <div
                  key={item.key}
                  className="relative pr-2"
                  onMouseEnter={() => toggleDropdown(item.key)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <span
                    className={`flex items-center text-xs space-x-1 ${selectedComponent === item.key
                      ? "text-black"
                      : "text-black hover:text-gray-600"
                      } cursor-pointer`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    <FaChevronDown className="w-2 h-2" />
                  </span>
                  {openDropdown === item.key && (
                    <ul className="z-10 absolute top-full w-60 bg-white shadow-lg rounded-md border">
                      {renderDropdownItems(item.key)}
                    </ul>
                  )}
                </div>
              ))}
              <Link
                to="/catering-services"
                className={`text-xs cursor-pointer ${selectedComponent === "Catering"
                  ? "text-green-600 font-bold"
                  : "text-black hover:text-green-500"
                  }`}
              >
                Design Your Own Menu
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="relative hi flex items-center flex-col">
              {/* <AiOutlineSearch className="text-green-500 w-8 h-16 cursor-pointer" /> */}
              <div className=" hidden relative">
  <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
  <input
    type="text"
    placeholder="Search..."
    className="pl-10 w-36 border border-green-500 p-3  rounded-lg text-xs text-gray-800 placeholder-gray-500 z-10"
  />
</div>

              <div className="flex"  onClick={handleCall}>
              <Phone
                    size={16}
                    strokeWidth={2}
                    className="relative top-2 right-1 text-green-600 cursor-pointer"
                /><h2 className="text-xl text-green-600 cursor-pointer">969779 8888</h2>
              </div>
            </div>


            {/* Cart and User Profile */}
            <div className="flex items-center space-x-4">
              <Link to="/cart">
                <ShoppingCart className="text-black w-6 h-6" />
              </Link>
              <div className="relative">
                <img
                  src={user}
                  alt="User Profile"
                  className="rounded-full w-10 h-10 cursor-pointer"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                />
                {isUserDropdownOpen && (
                  <div className="absolute right-0 z-30 mt-2 w-48 bg-white text-green-800 rounded-lg shadow-lg">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-green-50"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/logout"
                      className="block px-4 py-2 hover:bg-green-50"
                    >
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-aliceBlue">{routing}</div>
      </div>
      <ScrollToTop />

    </div>
  );
};

export default Navbar;
