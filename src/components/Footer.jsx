import React from 'react';
import { Facebook, Instagram, Youtube, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="min-w-screen bg-gray-800 text-white py-8">
     <div className="grid grid-cols-1 mt-4 md:grid-cols-2 ">
          {/* Social Media Links */}
{/*           <div className="flex justify-center md:justify-start space-x-6">
            <a href="#" className="hover:text-green-400"><Facebook /></a>
            <a href="#" className="hover:text-green-400"><Instagram /></a>
            <a href="#" className="hover:text-green-400"><Youtube /></a>
          </div> */}
        <div className="text-center mx-auto   text-gray-400">
          Copyright ©2024 All rights reserved | by mahaspice.in
        </div>

        
      </div>
    </footer>
  );
};

export default Footer;
