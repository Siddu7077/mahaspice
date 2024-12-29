import React, { useState } from 'react';
import { Star, Send, Coffee, Truck, Users } from 'lucide-react';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceType: '',
    rating: 0,
    feedback: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  const serviceTypes = [
    { 
      value: 'mealBox', 
      label: 'Meal Box', 
      icon: <Coffee className="text-green-600" size={24} /> 
    },
    { 
      value: 'deliveryBox', 
      label: 'Delivery Box', 
      icon: <Truck className="text-green-600" size={24} /> 
    },
    { 
      value: 'cateringBox', 
      label: 'Catering Service', 
      icon: <Users className="text-green-600" size={24} /> 
    }
  ];

  return (
    <div className="max-h-fit py-2 px-4 sm:px-6 lg:px-8 bg-aliceBlue">

      <div className="relative max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 p-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            Share Your Maha Spices Experience
          </h1>
          <p className="mt-2 text-green-100">
            We value your feedback and are committed to delivering exceptional culinary experiences.
          </p>
        </div>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Personal Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                required
              />
            </div>
          </div>

          {/* Service Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Which Service Did You Experience?
            </label>
            <div className="grid md:grid-cols-3 gap-4">
              {serviceTypes.map((service) => (
                <label 
                  key={service.value} 
                  className={`
                    flex items-center space-x-3 p-4 border rounded-lg cursor-pointer
                    ${formData.serviceType === service.value 
                      ? 'bg-green-100 border-green-500' 
                      : 'bg-white border-gray-300 hover:bg-gray-50'}
                    transition duration-300
                  `}
                >
                  <input
                    type="radio"
                    name="serviceType"
                    value={service.value}
                    checked={formData.serviceType === service.value}
                    onChange={handleChange}
                    className="hidden"
                  />
                  {service.icon}
                  <span className="font-medium text-gray-800">{service.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How Would You Rate Your Experience?
            </label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className={`
                    transition duration-200 transform hover:scale-110
                    ${formData.rating >= star 
                      ? 'text-yellow-500' 
                      : 'text-gray-300'}
                  `}
                >
                  <Star size={40} fill={formData.rating >= star ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Textarea */}
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
              Your Detailed Feedback
            </label>
            <textarea
              id="feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
              placeholder="Share your thoughts about our service, food quality, presentation, and delivery..."
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="
              w-full flex items-center justify-center 
              px-6 py-4 bg-green-600 text-white 
              rounded-lg hover:bg-green-700 
              focus:outline-none focus:ring-2 
              focus:ring-green-500 focus:ring-offset-2
              transition duration-300 group
            "
          >
            <Send className="mr-2 group-hover:animate-pulse" size={20} />
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
