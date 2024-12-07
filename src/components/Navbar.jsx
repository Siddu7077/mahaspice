import React, { useState } from "react";
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
} from "lucide-react";
import { FaRing, FaBuilding, FaUtensils, FaBookOpen, FaChevronDown } from "react-icons/fa";
import { AiOutlineMenu, AiOutlineSearch } from "react-icons/ai";
import logo from "../assets/logo.png";
import user from "../assets/user.png";
import HomePage from "./HomePage";
import { FaServicestack } from "react-icons/fa";
import { MdContactMail } from "react-icons/md";
import { BiMessageDetail } from "react-icons/bi";
import { GiMeal } from "react-icons/gi";
import ContactForm from "./ContactForm";
import Footer from "./Footer";
import About from "../About";
import eventCategories from './eventCategories.json';
import FeedbackForm from "../Feedback";
import EventCatMenu from "./EventCatMenu";

const Navbar = () => {
  const [isNavExpanded, setIsNavExpanded] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState("home");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleNavbar = () => {
    setIsNavExpanded(!isNavExpanded);
  };

  const navItems = [
    { icon: <Home />, label: "Home", key: "home" },
    { icon: <Users />, label: "About", key: "about" },
    { icon: <FaServicestack />, label: "Services", key: "services" },
    { icon: <MdContactMail />, label: "Contact", key: "contact" },
    { icon: <BiMessageDetail />, label: "Feedback", key: "feedback" },
    { icon: <GiMeal />, label: "Custom Order", key: "customorder" },
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
      icon: <FaRing className="w-3 h-3" />,
      label: "Wedding Events"
    },
    {
      key: "corporate-events",
      icon: <FaBuilding className="w-3 h-3" />,
      label: "Corporate Events"
    },
    {
      key: "event-catering",
      icon: <FaUtensils className="w-3 h-3" />,
      label: "Event Catering"
    },
    {
      key: "design-menu",
      icon: <FaBookOpen className="w-3 h-3" />,
      label: "Design Your Menu"
    },
    {
      key: "Our Services",
      icon: <FaBookOpen className="w-3 h-3" />,
      label: "Our Services"
    }
  ];

  const renderComponent = () => {
    const components = {
      home: <HomePage />,
      about: <About />,
      services: <div className="p-4">Settings Content</div>,
      contact: <ContactForm />,
      feedback: <FeedbackForm />,
      customorder: <div className="p-4">Custom Order Content</div>,
      
      "wedding-events": <EventCatMenu />,
      "corporate-events": <div className="p-4">corporate-events</div>,
      "event-catering": <div className="p-4">event-catering</div>,
      "design-menu": <div className="p-4">design-menu</div>,
      "Box Genie": <div className="p-4">Box Genie</div>,
      "Home Delivery": <div className="p-4">Home Delivery</div>,
      "Catering": <div className="p-4">Catering</div>,
    };

    return components[selectedComponent] || components.home;
  };

  return (
    <div className="flex h-screen bg-white text-black">
      {/* Left Sidebar */}
      <div
        className={`${
          isNavExpanded ? "w-64" : "w-25"
        } h-full transition-all duration-300 bg-green-50 border-r border-green-200`}
      >
        <div className="p-4 flex items-center justify-between">
          <img
            src={logo}
            alt="Logo"
            className={`${isNavExpanded ? "block" : ""} h-10 w-30`}
          />
        </div>
        <nav className="mt-4">
          <div className="mb-4">
            <h3
              className={`px-4 mx-auto mb-2 ${
                !isNavExpanded && "text-center"
              } text-sm font-bold text-green-800`}
            >
              Navigation
            </h3>
            {navItems.map((item) => (
              <a
                key={item.key}
                onClick={() => setSelectedComponent(item.key)}
                className={`flex ${
                  !isNavExpanded && "justify-center"
                } ml-4 items-center p-3 cursor-pointer ${
                  selectedComponent === item.key
                    ? "bg-green-500 text-white"
                    : "hover:bg-green-50"
                }`}
              >
                {item.icon}
                {isNavExpanded && (
                  <span
                    className={`ml-3 ${
                      selectedComponent === item.key
                        ? "text-white"
                        : " text-green-800"
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </a>
            ))}
          </div>
          <div>
          </div>
        </nav>
      </div>
      {/* Top Navigation and Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 bg-white text-black shadow-md">
          {/* Left Section: Search Bar */}
          <div className="flex items-center space-x-4">
            <button onClick={toggleNavbar} className="p-2 text-green-500">
              <AiOutlineMenu className="w-6 h-6" />
            </button>
            <AiOutlineSearch className="text-green-500 w-6 h-6" />
            <input
              type="text"
              placeholder="Search..."
              className="border border-green-500 p-2 rounded-lg w-54 text-gray-800 placeholder-gray-500"
            />
          </div>
          {/* Right Section: User Profile, Theme Toggle, and Navigation */}
          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-4 relative">
            
              {dropdownConfig.map((item) => (
                <div 
                  key={item.key} 
                  className="relative b-2"
                  onMouseEnter={() => toggleDropdown(item.key)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <a
                    className={`flex text-sm items-center space-x-2 ${
                      selectedComponent === item.key
                        ? "text-green-700"
                        : "text-green-500 hover:text-green-600"
                    } cursor-pointer`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    <FaChevronDown className="w-3 h-3" />
                  </a>
                  {openDropdown === item.key && (
                    <ul className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md border">
                      {renderDropdownItems(item.key)}
                    </ul>
                  )}
                </div>
              ))}
            </nav>
                    {/* User Profile Dropdown */}
            <div className="relative">
              <img
                src={user}
                alt="User Profile"
                className="rounded-full w-10 h-10 cursor-pointer"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              />
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-green-800 rounded-lg shadow-lg">
                  <a
                    href="/profile"
                    className="block px-4 py-2 hover:bg-green-50"
                  >
                    Profile
                  </a>
                  <a
                    href="/logout"
                    className="block px-4 py-2 hover:bg-green-50"
                  >
                    Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-white">
          {renderComponent()}
          
        </div>
      </div>
    </div>
  );
};

export default Navbar;

