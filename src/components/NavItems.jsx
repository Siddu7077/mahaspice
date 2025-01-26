import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HomeIcon, 
  UsersIcon, 
  ServerIcon, 
  MailIcon 
} from 'lucide-react';

const navItems = [
  { 
    icon: HomeIcon, 
    label: "Home", 
    key: "home", 
    path: "/" 
  },
  { 
    icon: UsersIcon, 
    label: "About", 
    key: "about", 
    path: "/about" 
  },
  { 
    icon: ServerIcon, 
    label: "Services", 
    key: "services", 
    path: "/services" 
  },
  { 
    icon: MailIcon, 
    label: "Contact", 
    key: "contact", 
    path: "/contact" 
  }
];

const Navigation = ({ selectedComponent }) => {
  return (
    <nav className="mt-4 w-full">
      <div className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            className={`
              flex items-center 
              px-4 py-3 
              rounded-lg 
              transition-all 
              duration-300 
              ${selectedComponent === item.key
                ? "bg-green-600 text-white shadow-md"
                : "hover:bg-green-50 text-green-800"
              }
            `}
          >
            <item.icon 
              className={`
                mr-3 
                ${selectedComponent === item.key 
                  ? "text-white" 
                  : "text-green-600"
                }
              `} 
              size={20} 
            />
            <span 
              className={`
                font-medium 
                ${selectedComponent === item.key 
                  ? "text-white" 
                  : "text-green-800"
                }
              `}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;