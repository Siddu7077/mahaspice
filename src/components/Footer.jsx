// src/components/Footer.jsx
import React from 'react';
import { Facebook, Instagram, Youtube, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Social Media Links */}
          <div className="flex justify-center md:justify-start space-x-6">
            <a href="#" className="hover:text-green-400"><Facebook /></a>
            <a href="#" className="hover:text-green-400"><Instagram /></a>
            <a href="#" className="hover:text-green-400"><Youtube /></a>
          </div>

          {/* Newsletter Subscription */}
          <div className="flex items-center justify-center md:justify-end">
            <div className="flex">
              <input
                type="email"
                placeholder="Subscribe to newsletter"
                className="px-4 py-2 rounded-l-md focus:outline-none text-gray-800"
              />
              <button className="bg-green-600 px-4 py-2 rounded-r-md hover:bg-green-700">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 text-gray-400">
          Copyright ©2024 All rights reserved | by mahaspice.in
        </div>
      </div>
    </footer>
  );
};

export default Footer;