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
  Phone,
  Package,
  Truck,Calendar
} from "lucide-react";

import {
  FaRing,
  FaBuilding,
  FaUtensils,
  FaBookOpen,
  FaChevronDown,
} from "react-icons/fa";
import { AiOutlineMenu, AiOutlineSearch } from "react-icons/ai";
import { FaServicestack } from "react-icons/fa";
import { MdContactMail } from "react-icons/md";
import { BiMessageDetail } from "react-icons/bi";
import { GiMeal } from "react-icons/gi";
import logo from "../assets/logo.png";
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
import eventCategories from "./eventCategories.json";
import Footer from "./Footer";
import MenuPage from "./Menu";
import MenuSelection from "./MenuSelection";
import MenuOrder from "./MenuOrder";
import BulkCatering from "./BulkCatering";
import Superfast from "./Superfast";
import SectionTwo from "./SectionTwo";
import CartPage from "./CartPage";
import MealOrderForm from "./MealOrderForm";
import RefundCancellation from "./RefundCancellation";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsConditions from "./TermsConditions";
import ReturnPolicy from "./ReturnPolicy";
import CheckOutform from "./CheckOutform";
import ScrollToTop from "./ScrollToTop";
import AuthSystem from "./AuthSystem";
import ProfilePage from "./ProfilePage";
import UserDropdown from "./UserDropdown";
import DesignMenu from "./DesignMenu";
import SuperfastMeal from "./SuperfastMeal";
import Developers from "./Developers";
import NavbarOffers from "./NavbarOffers";
import Navigation from "./NavItems";
import Offers from "./Offers";

const Navbar = () => {
  const [isNavExpanded, setIsNavExpanded] = useState(true);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Define routes
  const routing = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/superfast", element: <Superfast /> },
    { path: "/developers", element: <Developers /> },
    { path: "/about", element: <About /> },
    { path: "/contact", element: <ContactForm /> },
    { path: "/feedback", element: <FeedbackForm /> },
    { path: "/catmenu", element: <EventCatMenu /> },
    { path: "/delivery", element: <DeliveryMenu /> },
    { path: "/events", element: <BulkCatering /> },
    { path: "/box", element: <MealBox /> },
    { path: "/cart", element: <CartPage /> },
    { path: "/refund-cancellation", element: <RefundCancellation /> },
    { path: "/privacy-policy", element: <PrivacyPolicy /> },
    { path: "/terms-conditions", element: <TermsConditions /> },
    { path: "/return-policy", element: <ReturnPolicy /> },
    { path: "/checkoutform", element: <CheckOutform /> },
    { path: "/offers", element: <Offers /> },
    
    {
      path: "/events/:eventType/:serviceType/Menu/:categoryName/order",
      element: <MenuOrder />,
    },
    { path: "/events/:eventType", element: <EventsPage /> },
    { path: "/events/:eventType/:serviceType/Menu", element: <MenuPage /> },
    { path: "/superfast", element: <MealOrderForm /> },
    { path: "/login", element: <AuthSystem /> },
    { path: "/profile", element: <ProfilePage /> },
    { path: "/superfastmeal", element: <SuperfastMeal /> },
    { path: "/events/personalized-menu", element: <DesignMenu /> },
    {
      path: "/events/:eventType/:serviceType/Menu/:menuType",
      element: <MenuSelection />,
    },
  ]);

  const handleCall = () => {
    try {
      window.location.href = "tel:+919697798888";
    } catch (error) {
      alert("Call +91 969779 8888");
    }
  };

  const toggleNavbar = () => {
    setIsNavExpanded(!isNavExpanded);
  };



  const dropdownConfig = [
    {
      key: "wedding-events",
      // icon: <FaRing size={16} className="mr-2" />,
      label: "Wedding Events",
      items: eventCategories["wedding-events"],
    },
    {
      key: "corporate-events",
      // icon: <FaBuilding size={16} className="mr-2" />,
      label: "Corporate Events",
      items: eventCategories["corporate-events"],
    },
    {
      key: "event-catering",
      // icon: <FaUtensils size={16} className="mr-2" />,
      label: "Event Catering",
      items: eventCategories["event-catering"],
    },
  ];
  const handleDropdownClick = (item) => {
    setSelectedComponent(item);
    setOpenDropdown(null);
  };

  return (
    <div className="flex h-screen bg-white text-black">
      <ScrollToTop />
      
      {/* Left Sidebar - Only visible on md and larger screens */}
      <div className={`${isNavExpanded ? "w-52" : "w-52"} h-full transition-all duration-300 bg-white border-r border-gray-100 hidden md:block`}>
        <div className="p-4 flex items-center justify-between">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className={`${isNavExpanded ? "block" : "hidden"} w-64`}
            />
            <img
              src={logo}
              alt="Logo"
              className={`${isNavExpanded ? "hidden" : "block"} w-64`}
            />
          </Link>
        </div>
        <Navigation />
        <NavbarOffers />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full flex flex-col">
        {/* Construction Notice */}
        <div className="bg-gradient-to-r min-h-[50px] overflow-hidden border-y border-green-100">
          <div className="py-2 relative">
            <div className="animate-bounceText whitespace-nowrap font-roboto absolute left-0 w-full">
              <span className="inline-block text-green-600 font-medium">
                🚧 This page is currently under construction. We appreciate your patience as we work to improve your experience. 🚧
              </span>
            </div>
          </div>
        </div>

        {/* Top Navigation Bar */}
        <header className="flex items-center justify-between p-2 bg-white text-black shadow-md">
          {/* Mobile Logo - Only visible on small screens */}
          <div className="flex md:hidden">
            <Link to="/">
              <img src={logo} alt="Logo" className="h-8" />
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleNavbar}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Menu className="w-6 h-6 text-green-500" />
            </button>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 mx-4 max-w-[650px]">
            <div className="flex w-full">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-l-full outline-none text-gray-800"
              />
              <button className="px-6 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-100">
                <Search className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Right Side Items */}
          <div className="flex items-center space-x-4">
            {/* Phone number - Hidden on mobile */}
            <div className="hidden md:flex items-center" onClick={handleCall}>
              <Phone size={20} strokeWidth={2} className="relative top-1/2 right-1 text-green-600 cursor-pointer" />
              <h2 className="text-xl text-green-600 cursor-pointer">
                040-2222 8888 / 969779 8888
              </h2>
            </div>
            <Link to="/cart">
              <ShoppingCart className="text-black w-6 h-6 hover:text-green-500" />
            </Link>
            <UserDropdown />
          </div>
        </header>

        {/* Categories Navigation - Hidden on mobile */}
        <div className="relative w-full bg-white border-t border-gray-100 hidden md:block">
          {/* Keep your existing categories navigation code */}
          {/* ... */}
        </div>

        {/* Content Area - Add bottom padding on mobile */}
        <div className="flex-1 overflow-y-auto bg-aliceBlue pb-16 md:pb-0">
          {routing}
        </div>

        {/* Mobile Bottom Navigation - Only visible on small screens */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="grid grid-cols-5 gap-1 px-2 py-2">
            <Link to="/" className="flex flex-col items-center justify-center p-2">
              <Home className="w-6 h-6 text-green-600" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link to="/box" className="flex flex-col items-center justify-center p-2">
              <Package className="w-6 h-6 text-green-600" />
              <span className="text-xs mt-1">Box</span>
            </Link>
            <Link to="/delivery" className="flex flex-col items-center justify-center p-2">
              <Truck className="w-6 h-6 text-green-600" />
              <span className="text-xs mt-1">Delivery</span>
            </Link>
            <Link to="/events" className="flex flex-col items-center justify-center p-2">
              <Calendar className="w-6 h-6 text-green-600" />
              <span className="text-xs mt-1">Events</span>
            </Link>
            <button 
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className="flex flex-col items-center justify-center p-2"
            >
              <Search className="w-6 h-6 text-green-600" />
              <span className="text-xs mt-1">Search</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {isSearchVisible && (
          <div className="md:hidden fixed top-0 left-0 right-0 bg-white p-4 shadow-md z-50">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search"
                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-l-full outline-none text-gray-800"
              />
              <button className="px-6 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-100">
                <Search className="h-5 w-5 text-gray-600" />
              </button>
              <button 
                onClick={() => setIsSearchVisible(false)}
                className="ml-2 p-2"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;