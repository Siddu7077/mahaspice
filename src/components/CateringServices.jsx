import React from 'react';
import { useParams } from 'react-router-dom';
import cateringData from './catering-services-data.json';

const ServiceDetailsPage = () => {
  const { category } = useParams();

  // Find the specific category data
  const categoryData = cateringData[category];

  if (!categoryData) {
    return <div>Category not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-700 mb-4">
          {categoryData.mainTitle}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {categoryData.mainDescription}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryData.services.map((service, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
          >
            <img 
              src={service.image} 
              alt={service.title} 
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-green-700 mb-4">
                {service.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {service.description}
              </p>
              <div className="mb-4">
                <span className="text-xl font-semibold text-green-600">
                  Starting at INR {service.startingPrice.toLocaleString()}
                </span>
              </div>
              <div>
                <h3 className="font-bold mb-2">Highlights:</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {service.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              </div>
              <button 
                className="mt-6 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
              >
                Inquire Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceDetailsPage;