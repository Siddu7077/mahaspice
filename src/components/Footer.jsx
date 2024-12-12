import React from 'react';
import { Facebook, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="min-w-screen bg-gray-800 text-white py-4">
      <div className="container mx-auto  flex items-center justify-around ">
        <div className="flex space-x-4 ">
          <a href="#" className="hover:text-green-400"><Facebook /></a>
          <a href="#" className="hover:text-green-400"><Instagram /></a>
          <a href="#" className="hover:text-green-400"><Youtube /></a>
        </div>
        <div className="text-center text-gray-400">
          Copyright ©2024 All rights reserved | by mahaspice.in
        </div>
      </div>
    </footer>
  );
};

export default Footer;