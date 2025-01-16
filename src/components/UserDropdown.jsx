import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, LogIn, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from './AuthSystem'; // Import your auth context

const UserDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-2 focus:outline-none"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="relative w-10 h-10 rounded-full bg-green-100 flex items-center justify-center overflow-hidden border-2 border-green-200 hover:border-green-300 transition-colors">
          {user ? (
            <User className="w-6 h-6 text-green-600" />
          ) : (
            <User className="w-6 h-6 text-green-600" />
          )}
        </div>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 transform origin-top transition-all duration-200 ease-in-out">
          {user ? (
            <>
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.phone}</p>
              </div>
              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-green-50 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <UserCircle className="w-4 h-4 mr-2" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-green-50 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-green-50 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDropdown;