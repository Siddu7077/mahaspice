import React, { useState } from "react";
import { Link, useRoutes, useNavigate } from "react-router-dom";
import { useEvents } from "./EventContext";
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
  Truck,
  Calendar,
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
  const navigate = useNavigate();
  const [isNavExpanded, setIsNavExpanded] = useState(true);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { eventCategories, dropdownConfig, isLoading, error } = useEvents();

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
      alert("Call +91 9697798888");
    }
  };

  const toggleNavbar = () => {
    setIsNavExpanded(!isNavExpanded);
  };

  // const dropdownConfig = [
  //   {
  //     key: "wedding-events",
  //     // icon: <FaRing size={16} className="mr-2" />,
  //     label: "Wedding Events",
  //     items: eventCategories["wedding-events"],
  //     path: "/events/wedding-catering"
  //   },
  //   {
  //     key: "corporate-events",
  //     // icon: <FaBuilding size={16} className="mr-2" />,
  //     label: "Corporate Events",
  //     items: eventCategories["corporate-events"],
  //     path: "/events/corporate-events"

  //   },
  //   {
  //     key: "event-catering",
  //     // icon: <FaUtensils size={16} className="mr-2" />,
  //     label: "Event Catering",
  //     items: eventCategories["event-catering"],
  //     path: "/events/event-caterers"
  //   },
  // ];
  const handleDropdownClick = (item) => {
    setSelectedComponent(item);
    setOpenDropdown(null);
  };

  const handleCategoryClick = (category) => {
    if (category.path) {
      navigate(category.path);
    }
  };

  return (
    <div className="flex h-screen bg-white text-black">
      <ScrollToTop />

      {/* Left Sidebar - Hidden on mobile */}
      <div
        className={`${
          isNavExpanded ? "w-52" : "w-52"
        } h-full transition-all duration-300 bg-white border-r border-gray-100 hidden md:block`}
      >
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
                🚧 This page is currently under construction. We appreciate your
                patience as we work to improve your experience. 🚧
              </span>
            </div>
          </div>
        </div>

        {/* Top Navigation Bar */}
        <header className="flex items-center justify-between p-2 bg-white text-black shadow-md">
          {/* Mobile Logo */}
          <div className="md:hidden">
            <Link to="/">
              <img src={logo} alt="Logo" className="h-8" />
            </Link>
          </div>

          {/* Desktop Menu Button */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleNavbar}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <AiOutlineMenu className="w-6 h-6 text-green-500" />
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
                <AiOutlineSearch className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Right Side Items */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center" onClick={handleCall}>
              <Phone
                size={20}
                strokeWidth={2}
                className="relative top-1/2 right-1 text-green-600 cursor-pointer"
              />
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

        {/* Categories Navigation - Scrollable on mobile */}
        <div className="sticky top-0 w-full bg-white border-t border-gray-100 z-30">
          <div className="max-w-7xl h-10 mx-auto px-4">
            <div className="flex items-center lg:text-sm justify-between">
              <Link
                to="/superfast"
                className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer whitespace-nowrap ${
                  selectedComponent === "Superfast"
                    ? "bg-green-600 text-white"
                    : "text-black"
                }`}
              >
                Superfast Delivery
              </Link>

              <Link
                to="/box"
                className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer whitespace-nowrap ${
                  selectedComponent === "Box Genie"
                    ? "bg-green-600 text-white"
                    : "text-black"
                }`}
              >
                Box Genie
              </Link>

              <Link
                to="/delivery"
                className={`px-3 sm:hidden lg:block md:block py-1.5 rounded-lg font-semibold cursor-pointer whitespace-nowrap ${
                  selectedComponent === "Home Delivery"
                    ? "bg-green-600 text-white"
                    : "text-black"
                }`}
              >
                Home Delivery
              </Link>

              {dropdownConfig.map((category) => (
                <div
                  key={category.key}
                  className="relative group sm:hidden lg:block md:block"
                  onMouseEnter={() => setOpenDropdown(category.key)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <div
                    onClick={() => handleCategoryClick(category)}
                    className={`flex items-center px-3 py-1.5 rounded-lg font-semibold cursor-pointer whitespace-nowrap ${
                      selectedComponent === category.key
                        ? "bg-green-600 text-white"
                        : "text-black"
                    }`}
                  >
                    {category.icon}
                    <span>{category.label}</span>
                    <FaChevronDown className="ml-1 w-3 h-3" />
                  </div>

                  <div
                    className={`absolute left-0 w-60 bg-white shadow-lg rounded-md border z-50 transition-all duration-150 ${
                      openDropdown === category.key
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-2 pointer-events-none"
                    }`}
                    style={{
                      top: "calc(100% + 0.5rem)",
                    }}
                  >
                    <div className="relative bottom-3 max-h-64 overflow-auto bg-white rounded-md py-1">
                      {category.items.map((item, index) => {
                        // Function to create URL-friendly slugs
                        const createUrlSlug = (text) => {
                          return text
                            .toLowerCase()
                            .replace(/\s+/g, "-") // Replace spaces with hyphens
                            .replace(/[^\w-]+/g, ""); // Remove special characters
                        };

                        // Construct the URL path
                        const itemSlug = createUrlSlug(item);
                        const fullPath = `${category.path}/${itemSlug}/Menu`;

                        return (
                          <Link
                            key={index}
                            to={fullPath}
                            className="block px-4 py-2 hover:bg-green-50 text-gray-800 transition-colors duration-150"
                            onClick={() => {
                              setSelectedComponent(item);
                              setOpenDropdown(null);
                            }}
                          >
                            {item}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}

              <Link
                to="events/personalized-menu"
                className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer whitespace-nowrap ${
                  selectedComponent === "Catering"
                    ? "bg-green-600 text-white"
                    : "text-black"
                }`}
              >
                Design Your Own Menu
              </Link>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-aliceBlue pb-16 md:pb-0 relative z-10">
          {routing}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="grid grid-cols-4 gap-1 px-2 py-2">
            <Link
              to="/"
              className="flex flex-col items-center justify-center p-2"
            >
              <Home className="w-6 h-6 text-green-600" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link
              to="/box"
              className="flex flex-col items-center justify-center p-2"
            >
              <Package className="w-6 h-6 text-green-600" />
              <span className="text-xs mt-1">Box</span>
            </Link>
            <Link
              to="/delivery"
              className="flex flex-col items-center justify-center p-2"
            >
              <Truck className="w-6 h-6 text-green-600" />
              <span className="text-xs mt-1">Delivery</span>
            </Link>
            <Link
              to="/events"
              className="flex flex-col items-center justify-center p-2"
            >
              <Calendar className="w-6 h-6 text-green-600" />
              <span className="text-xs mt-1">Events</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
