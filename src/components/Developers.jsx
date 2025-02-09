import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Linkedin, Mail, Globe, ArrowLeft, User2 } from "lucide-react";
import soh from "../assets/sohail.jpeg";
import sid from "../assets/siddesh.jpg"

const Developers = () => {
  const developers = [
    {
      name: "Mudabbir Pasha",
      image:soh,
      // role: "Full Stack Developer",
      company: "WebHostDevs",
      bio: "Full-stack developer with expertise in React, Node.js, and cloud technologies. Passionate about creating scalable web solutions and improving user experiences.",
      linkedin: "https://www.linkedin.com/in/",
      email: "info@webhostdevs.com",
      contributions: [
        "Led the development of MahaSpice's core functionality",
        "Implemented secure payment integration",
        "Optimized website performance and SEO",
      ],
      skills: ["React", "Node.js", "Cloud Computing", "Full Stack Development"],
    },
    {
      name: "Siddeshwar Reddy",
      image:sid,
      // role: "UI/UX Developer",
      company: "WebHostDevs",
      bio: "Experienced developer specializing in modern web technologies and user interface design. Focused on creating responsive and accessible web applications.",
      linkedin: "https://www.linkedin.com/in/",
      email: "info@webhostdevs.com",
      contributions: [
        "Developed responsive UI components",
        "Implemented cart and checkout functionality",
        "Enhanced user authentication system",
      ],
      skills: ["UI/UX", "React", "Full Stack", "Web Development"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back button with improved spacing and hover effect */}
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors mb-8 sm:mb-12 px-3 py-2 hover:bg-blue-50 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-sm sm:text-base">Return to MahaSpice</span>
        </Link>

        {/* Header section with gradient text and responsive spacing */}
        <div className="text-center mb-12 sm:mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6">
            The Creators
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
            Meet the innovative minds behind MahaSpice. Our team of passionate developers and designers crafted this platform to deliver an exceptional experience.
          </p>
        </div>

        {/* Developer cards with enhanced layout and animations */}
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
          {developers.map((dev) => (
            <div
              key={dev.name}
              className="bg-white backdrop-blur-sm bg-opacity-50 rounded-3xl p-8 sm:p-10 hover:shadow-2xl transition-all duration-500 border border-gray-100 group transform hover:-translate-y-2"
            >
              <div className="space-y-8 sm:space-y-10">
                {/* Profile section with responsive layout */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 relative flex-shrink-0">
                    {dev.image ? (
                      <img
                        src={dev.image}
                        alt={dev.name}
                        className="w-full h-full object-cover rounded-2xl shadow-lg ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all"
                      />
                    ) : (
                      <div className="w-full h-full rounded-2xl shadow-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <User2 className="w-14 h-14 text-blue-600" />
                      </div>
                    )}
                    {/* <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-1.5 px-4 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                      {dev.role}
                    </div> */}
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {dev.name}
                    </h2>
                    <div className="flex items-center justify-center sm:justify-start text-gray-600 mt-2">
                      <Globe className="w-5 h-5 mr-2 text-blue-500" />
                      <span className="font-medium">{dev.company}</span>
                    </div>
                    <p className="mt-4 text-gray-600 leading-relaxed text-sm sm:text-base">
                      {dev.bio}
                    </p>
                  </div>
                </div>

                {/* Skills section with gradient badges */}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                    Expertise
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {dev.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-4 py-1.5 rounded-full text-sm sm:text-base font-medium hover:from-blue-100 hover:to-purple-100 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contributions section with enhanced styling */}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                    Key Contributions
                  </h3>
                  <ul className="space-y-3 sm:space-y-4">
                    {dev.contributions.map((contribution, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-600 text-sm sm:text-base">
                          {contribution}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact buttons with improved layout and hover effects */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                  <a
                    href={dev.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-6 sm:px-8 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-sm sm:text-base shadow-md hover:shadow-lg"
                  >
                    <Linkedin className="w-5 h-5 mr-2" />
                    LinkedIn
                  </a>
                  <a
                    href={`mailto:${dev.email}`}
                    className="flex items-center justify-center px-6 sm:px-8 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base shadow-md hover:shadow-lg"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Email
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer section with responsive spacing and gradient button */}
        <div className="mt-12 sm:mt-20 text-center">
          <a
            href="https://webhostdevs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 sm:px-10 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Discover WebHostDevs
          </a>
        </div>
      </div>
    </div>
  );
};

export default Developers;