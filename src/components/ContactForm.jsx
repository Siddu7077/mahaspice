import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="pt-5 h-full relative  bg-aliceBlue ">

      <div className="max-w-5xl  mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-5">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 inline-block text-transparent bg-clip-text">Contact Us</h1>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-bold mb-5 text-gray-800">Contact Information</h2>

            <div className="space-y-1">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <MapPin className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Visit Us</h3>
                  <p className="text-gray-600 mt-1">Address: Office: Plot No: 332, & 333, Diamond hills, OPP. Care Hospitals, Hitech City, Old Mumbai Highway, Hyderabad-500 032</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Phone className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Call Us</h3>
                  <p className="text-gray-600 mt-1">040-2222 8888 / 969779 8888</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Mail className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Email Us</h3>
                  <p className="text-gray-600 mt-1">info@gsrhospitality.com</p>
                </div>
              </div>


            </div>


            {/* Embedded Map */}
            <div className="mt-8 h-48 bg-gray-200 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3846625.181386243!2d74.27449407466067!3d16.464461020536127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93ef09ed90b7%3A0x894bf16f752d763f!2sMaha%20Spice%20Caterers-best%20caterers%20in%20Hyderabad%2Cbest%20catering%20services%20in%20Hyderabad!5e1!3m2!1sen!2sin!4v1733045814538!5m2!1sen!2sin"
                width="100%"
                height="60%"
                allowFullScreen=""
                loading="lazy"
                title="Location Map"
                className="w-full h-full object-cover rounded-lg"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-2">Send us a Message</h2>

            <form action="https://formspree.io/f/xyzyjbdw" method="POST" className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
              >
                Send Message
                <Send className="ml-2" size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
