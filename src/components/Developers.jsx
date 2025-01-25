import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Linkedin, Mail, Globe, ArrowLeft } from "lucide-react";
import soh from "../assets/sohail.jpeg";

const Developers = () => {
  const developers = [
    {
      name: "XXXXX",
      role: "Full Stack Developer",
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
      name: "XXXXX",
      role: "Full Stack Developer",
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          Return to MahaSpice
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            The Creators
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Meet the innovative minds behind MahaSpice 
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {developers.map((dev) => (
            <div
              key={dev.name}
              className="bg-white backdrop-blur-sm bg-opacity-50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 border border-gray-100"
            >
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-32 h-32 relative flex-shrink-0">
                    <img
                      src={soh}
                      alt={dev.name}
                      className="w-full h-full object-cover rounded-2xl shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-1 px-3 rounded-full text-sm font-medium">
                      {dev.role}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {dev.name}
                    </h2>
                    <div className="flex items-center text-gray-600 mt-2">
                      <Globe className="w-4 h-4 mr-2" />
                      <span className="font-medium">{dev.company}</span>
                    </div>
                    <p className="mt-4 text-gray-600 leading-relaxed">{dev.bio}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {dev.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-4 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Key Contributions
                  </h3>
                  <ul className="space-y-3">
                    {dev.contributions.map((contribution, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mt-2" />
                        <span className="text-gray-600">{contribution}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-4">
                  <a
                    href={dev.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  >
                    <Linkedin className="w-5 h-5 mr-2" />
                    LinkedIn
                  </a>
                  <a
                    href={`mailto:${dev.email}`}
                    className="flex items-center px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Email
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href="https://webhostdevs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
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
