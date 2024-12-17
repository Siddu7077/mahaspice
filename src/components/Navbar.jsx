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
  Edit
} from "lucide-react";
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
import AddMenu from "../Admin/AddMenu";
import EditMenuPage from "../Admin/EditMenuPage";
import AdminMenuPage from "../Admin/AdminMenuPage";
import AddCategory from "../Admin/AddCategory";
import AdminEditCategory from "../Admin/AdminEditCategory";
import EditCategoryById from "../Admin/EditCategoryById";
import EventCategoryForm from "../Admin/EventCategoryForm";
import EventDisplayPage from "../Admin/EventDisplayPage";
import EventEditPage from "../Admin/EventEditPage";
import Admin from "../Admin/Admin";
import AddCarousel from "../Admin/AddCarousel";
import SuperFastDelivery from "./SuperFastDelivery";
import AddMealBox from "../Admin/AddMealBox";
import CPDisplay from "../Admin/CPDisplay";
import CPTypesDisplay from "../Admin/CPTypesDisplay";
import AddCP from '../Admin/AddCP';
import AddCPS from "../Admin/AddCPS";


const Navbar = () => {
  const [isNavExpanded, setIsNavExpanded] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Define routes
  const routing = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <About /> },
    { path: "/contact", element: <ContactForm /> },
    { path: "/feedback", element: <FeedbackForm /> },
    { path: "/catmenu", element: <EventCatMenu /> },
    { path: "/delivery", element: <DeliveryMenu /> },
    { path: "/box", element: <MealBox /> },
    { path: "/addmenu", element: <AddMenu /> },
    { path: "/editmenu/:id", element: <EditMenuPage /> },
    { path: "/adminmenu", element: <AdminMenuPage /> },
    { path: "/addcategory", element: <AddCategory /> },
    { path: "/addcarousel", element: <AddCarousel /> },
    { path: "/admincategory", element: <AdminEditCategory /> },
    { path: "/editcategory/:id", element: <EditCategoryById /> },
    { path: "/addevent", element: <EventCategoryForm /> },
    { path: "/admineventdisplay", element: <EventDisplayPage /> },
    { path: "/admineventedit/:id", element: <EventEditPage /> },
    { path: "/admin", element: <Admin /> },
    { path: "/superfastDelivery", element: <SuperFastDelivery /> },
    { path: "/addMealBox", element: <AddMealBox /> },
    { path: "/addcp", element: <AddCP /> },
    { path: "/addcps", element: <AddCPS /> },
    { path: "/displaycp", element: <CPDisplay /> },
    { path: "/displaycps", element: <CPTypesDisplay /> },

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
      path: "/events/:eventType/:serviceType/Menu/:categoryName",
      element: <MenuSelection />
    }
  ]);

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
    { icon: <BiMessageDetail />, label: "Feedback", key: "feedback", path: "/feedback" },
    { icon: <GiMeal />, label: "Custom Order", key: "customorder", path: "/" },
    // { icon: <UserCog />, label: "Admin Dashboard", key: "admin", path: "/admin" },
    { icon: <UserCog />, label: "Superfast Delivery", key: "Superfast Delivery", path: "/superfast-delivery" },
    
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
      {/* Left Sidebar */}
      <div
        className={`${isNavExpanded ? "w-64" : "w-44"
          } h-full transition-all duration-300 bg-white border-r border-green-200`}
      >
        <div className="p-4 flex items-center justify-between">
          <img
            src={logo}
            alt="Logo"
            className={`${isNavExpanded ? "block" : "hidden"} h-30 w-64`}
          />
          <img
            src={logo}
            alt="Logo"
            className={`${isNavExpanded ? "hidden" : "block"} h-30 w-64`}
          />
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
        <header className="flex items-center justify-between p-4 bg-white text-black shadow-md">
          {/* Left Section: Search Bar */}
          <div className="flex items-center space-x-4 ">
            <button onClick={toggleNavbar} className="p-2 text-green-500">
              <AiOutlineMenu className="w-6 h-6" />
            </button>
            <div className="flex items-center relative">
              <AiOutlineSearch
                className="text-green-500 w-6 h-6 cursor-pointer"
                onClick={toggleSearch}
              />
              {isSearchVisible && (
                <input
                  type="text"
                  placeholder="Search..."
                  className="absolute left-8 w-32 top-1/2 transform -translate-y-1/2 border border-green-500 p-2 rounded-lg w-54 text-gray-800 placeholder-gray-500 z-10"
                />
              )}
            </div>
          </div>
          {/* Right Section: User Profile, Theme Toggle, and Navigation */}
          <div className="flex items-center space-x-3">
            {/* Navigation Links */}
            <nav className="flex items-center space-x-4 relative">
              {/* Always visible links */}

              {dropdownConfig.map((item) => (
                <div
                  key={item.key}
                  className="relative bottom-1"
                  onMouseEnter={() => toggleDropdown(item.key)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <span
                    className={`flex text-[16px] items-center justify-center mt-2 space-x-2 ${selectedComponent === item.key
                        ? "text-black"
                        : "text-grey-500 hover:text-grey-600"
                      } cursor-pointer`}
                  >
                    {item.icon}
                    <span
                      className={`${selectedComponent === item.key
                          ? "text-black"
                          : "text-grey-500 hover:text-grey-600"
                        }`}
                    >
                      {item.label}
                    </span>
                    <FaChevronDown className="w-3 h-3" />
                  </span>
                  {openDropdown === item.key && (
                    <ul className=" z-10 absolute top-full text-xs left-0 w-48 bg-white shadow-lg rounded-md border">
                      {renderDropdownItems(item.key)}
                    </ul>
                  )}
                </div>
              ))}
              <div className="flex items-center justify-center space-x-4 text-[16px]">
                <Link
                  to="/catering-services"
                  className={`cursor-pointer ${selectedComponent === "Catering"
                      ? "text-green-600 font-bold"
                      : "text-black hover:text-green-500"
                    }`}
                >
                  Design Your Own Menu
                </Link>
                <Link
                  to="/superfastDelivery"
                  className={`cursor-pointer ${selectedComponent === "Box Genie"
                      ? "text-green-600 font-bold"
                      : "text-black hover:text-green-500"
                    }`}
                >
                  Superfast Delivery
                </Link>
                <Link
                  to="/box"
                  className={`cursor-pointer ${selectedComponent === "Box Genie"
                      ? "text-green-600 font-bold"
                      : "text-black hover:text-green-500"
                    }`}
                >
                  Box Genie
                </Link>
                <Link
                  to="/delivery"
                  className={`cursor-pointer ${selectedComponent === "Home Delivery"
                      ? "text-green-600 font-bold"
                      : "text-black hover:text-green-500"
                    }`}
                >
                  Home Delivery
                </Link>
                <Link
                  to="/catering-services"
                  className={`cursor-pointer ${selectedComponent === "Catering"
                      ? "text-green-600 font-bold"
                      : "text-black hover:text-green-500"
                    }`}
                >
                  Bulk Catering
                </Link>
              </div>
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
        </header>
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-aliceBlue ">{routing}</div>
      </div>
    </div>
  );
};

export default Navbar;
