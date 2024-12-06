import React from "react";
import { Users, CheckCircle, Star, Briefcase } from "lucide-react";

const About = () => {
  const statsData = [
    { 
      icon: <Users size={48} />, 
      value: "158,598", 
      label: "Happy Customers" 
    },
    { 
      icon: <CheckCircle size={48} />, 
      value: "10+ Years", 
      label: "Of Experience" 
    },
    { 
      icon: <Star size={48} />, 
      value: "10,000", 
      label: "Menus/Dishes" 
    },
    { 
      icon: <Briefcase size={48} />, 
      value: "450", 
      label: "Staff Members" 
    }
  ];

  return (
    <div className="bg-aliceBlue text-[#2F1C0B] flex-col min-h-full flex items-center justify-center p-6">
        <h1 className="text-4xl font-bold text-green-500 mb-6 text-center">
              Maha Spice Catering
            </h1>
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left Side - Description */}
          <div className="bg-green-500 p-12 flex flex-col justify-center text-white">
          <h1 className="text-4xl font-bold mb-6 text-center">
              About us
            </h1>
            <p className="text-lg text-center mb-8">
              Delivering culinary excellence across Telangana and Andhra Pradesh. With over half a century of experience, we specialize in creating memorable dining experiences for weddings, galas, and parties.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {statsData.map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-white/20 rounded-xl p-4 text-center"
                >
                  <div className="flex justify-center mb-2">
                    {stat.icon}
                  </div>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Side - Why Choose Us */}
          <div className="p-12 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6 text-green-500 text-center">
              Why Choose Us?
            </h2>
            <p className="text-lg text-center mb-8">
              Every event is special to our team. We craft customized, delectable culinary experiences that transform ordinary moments into extraordinary memories. Our passion for creative cuisine and impeccable service makes us the premier catering provider in Hyderabad.
            </p>
            <div className="text-center">
              <a 
                href="tel:0402222888" 
                className="bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600 transition-colors"
              >
                Contact: 040 2222 8888
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;