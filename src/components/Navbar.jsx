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
  Edit,
  ShoppingCart,
  Phone
} from "lucide-react";

import { FaRing, FaBuilding, FaUtensils, FaBookOpen, FaChevronDown } from "react-icons/fa";
import { AiOutlineMenu, AiOutlineSearch } from "react-icons/ai";
import { FaServicestack } from "react-icons/fa";
import { MdContactMail } from "react-icons/md";
import { BiMessageDetail } from "react-icons/bi";
import { GiMeal } from "react-icons/gi";
import logo from "../assets/logo-main.png";
import user from "../assets/user.png";

// Import all your components
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
import MenuSelection from "./MenuSelection";
import MenuOrder from "./MenuOrder";
import BulkCatering from "./BulkCatering";
import SuperFastDelivery from "./SuperFastDelivery";
import SectionTwo from "./SectionTwo";
import CartPage from "./CartPage";
import MealOrderForm from "./MealOrderForm";
import RefundCancellation from "./RefundCancellation";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsConditions from "./TermsConditions";
import ReturnPolicy from "./ReturnPolicy";
import CheckOutform from "./CheckOutform";
import ScrollToTop from "./ScrollToTop";

const Navbar = () => {
  const [isNavExpanded, setIsNavExpanded] = useState(true);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
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
    { path: "/cart", element: <CartPage /> },
    { path: "/refund-cancellation", element: <RefundCancellation /> },
    { path: "/privacy-policy", element: <PrivacyPolicy /> },
    { path: "/terms-conditions", element: <TermsConditions /> },
    { path: "/return-policy", element: <ReturnPolicy /> },
    { path: "/checkoutform", element: <CheckOutform /> },
    { path: "/events/:eventType/:serviceType/Menu/:categoryName/order", element: <MenuOrder /> },
    { path: "/events/:eventType", element: <EventsPage /> },
    { path: "/events/:eventType/:serviceType/Menu", element: <MenuPage /> },
    { path: "/superfast", element: <MealOrderForm /> },
    { path: "/events/:eventType/:serviceType/Menu/:menuType", element: <MenuSelection /> }
  ]);

  const handleCall = () => {
    try {
      window.location.href = 'tel:+919697798888';
    } catch (error) {
      alert('Call +91 969779 8888');
    }
  };

  const toggleNavbar = () => {
    setIsNavExpanded(!isNavExpanded);
  };

  const navItems = [
    { icon: <Home />, label: "Home", key: "home", path: "/" },
    { icon: <Users />, label: "About", key: "about", path: "/about" },
    { icon: <FaServicestack />, label: "Services", key: "services", path: "/services" },
    { icon: <MdContactMail />, label: "Contact", key: "contact", path: "/contact" },
    { icon: <GiMeal />, label: "Custom Order", key: "customorder", path: "/" },
  ];

  const dropdownConfig = [
    {
      key: "wedding-events",
      icon: <FaRing size={16} className="mr-2" />,
      label: "Wedding Events",
      items: eventCategories["wedding-events"]
    },
    {
      key: "corporate-events",
      icon: <FaBuilding size={16} className="mr-2" />,
      label: "Corporate Events",
      items: eventCategories["corporate-events"]
    },
    {
      key: "event-catering",
      icon: <FaUtensils size={16} className="mr-2" />,
      label: "Event Catering",
      items: eventCategories["event-catering"]
    }
  ];
  const handleDropdownClick = (item) => {
    setSelectedComponent(item);
    setOpenDropdown(null);
  };

  return (
    <div className="flex h-screen bg-white text-black">
      <ScrollToTop />
      {/* Left Sidebar */}
      <div className={`${isNavExpanded ? "w-64" : "w-44"} h-full transition-all duration-300 bg-white border-r border-gray-100`}>
        <div className="p-4 flex items-center justify-between">
          <Link to="/">
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
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={`flex ${!isNavExpanded && "justify-center"} ml-4 items-center p-3 cursor-pointer ${
                  selectedComponent === item.key ? "bg-green-500 text-white" : "hover:bg-green-50"
                }`}
              >
                {item.icon}
                {isNavExpanded && (
                  <span className={`ml-3 ${selectedComponent === item.key ? "text-white" : "text-green-800"}`}>
                    {item.label}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full flex flex-col">
        {/* Top Navigation Bar */}
        <header className="flex items-center justify-between p-2 bg-white text-black shadow-md">
          <div className="flex items-center space-x-4">
            <button onClick={toggleNavbar} className="p-2 hover:bg-gray-100 rounded-full">
              <AiOutlineMenu className="w-6 h-6 text-green-500" />
            </button>
          </div>

          <div className="flex flex-1 mx-4 max-w-[650px]">
            <div className="flex w-full">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-l-full outline-none text-gray-800"
              />
              <button className="px-6 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-100">
                <AiOutlineSearch className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center" onClick={handleCall}>
              <Phone size={20} strokeWidth={2} className="relative top-1 right-1 text-green-600 cursor-pointer" />
              <h2 className="text-xl text-green-600 cursor-pointer">969779 8888</h2>
            </div>
            <Link to="/cart">
              <ShoppingCart className="text-black w-6 h-6 hover:text-green-500" />
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
                  <Link to="/profile" className="block px-4 py-2 hover:bg-green-50">
                    Profile
                  </Link>
                  <Link to="/logout" className="block px-4 py-2 hover:bg-green-50">
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Categories Navigation */}
        <div className="w-full bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-center items-center overflow-x-auto scrollbar-hide">
              <div className="flex space-x-3 py-2 whitespace-nowrap">
                <Link
                  to="/superfast"
                  className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                    selectedComponent === "Superfast" ? "bg-green-600 text-white" : "bg-gray-100 text-black hover:bg-gray-200"
                  }`}
                >
                  Superfast Delivery
                </Link>
                
                <Link
                  to="/box"
                  className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                    selectedComponent === "Box Genie" ? "bg-green-600 text-white" : "bg-gray-100 text-black hover:bg-gray-200"
                  }`}
                >
                  Box Genie
                </Link>
                
                <Link
                  to="/delivery"
                  className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                    selectedComponent === "Home Delivery" ? "bg-green-600 text-white" : "bg-gray-100 text-black hover:bg-gray-200"
                  }`}
                >
                  Home Delivery
                </Link>

                {dropdownConfig.map((category) => (
              <div
                key={category.key}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(category.key)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <div
                  className={`flex items-center px-3 py-1.5 rounded-lg cursor-pointer ${
                    selectedComponent === category.key 
                      ? "bg-green-600 text-white" 
                      : "bg-gray-100 text-black hover:bg-gray-200"
                  }`}
                >
                  {category.icon}
                  <span>{category.label}</span>
                  <FaChevronDown className="ml-1 w-3 h-3" />
                </div>
                
                <div 
                  className={`absolute left-0 top-full mt-1 w-60 bg-white shadow-lg rounded-md border z-50 transition-opacity duration-150 ${
                    openDropdown === category.key 
                      ? "opacity-100 visible" 
                      : "opacity-0 invisible"
                  }`}
                >
                  {category.items.map((item, index) => (
                    <Link
                      key={index}
                      to={`/events/${category.key}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block px-4 py-2 hover:bg-green-50 text-gray-800 transition-colors duration-150"
                      onClick={() => {
                        setSelectedComponent(item);
                        setOpenDropdown(null);
                      }}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            ))}


                <Link
                  to="/catering-services"
                  className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                    selectedComponent === "Catering" ? "bg-green-600 text-white" : "bg-gray-100 text-black hover:bg-gray-200"
                  }`}
                >
                  Design Your Own Menu
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-aliceBlue">
          {routing}
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
};

export default Navbar;