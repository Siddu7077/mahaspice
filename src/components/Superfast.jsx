import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import SuperfastMeal from './SuperfastMeal';
import SuperfastDeliveryMenu from './SuperfastDelbox';

const DynamicServices = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await fetch('https://mahaspice.desoftimp.com/ms3/get_sections.php');
      const data = await response.json();
      if (data.success) {
        setSections(data.sections.sort((a, b) => a.position - b.position));
      }
    } catch (err) {
      console.error('Failed to fetch sections:', err);
    }
  };

  const ServiceContent = ({ service }) => {
    const serviceComponents = {
      'Box Genie': <SuperfastMeal />,
      'Home Delivery': <SuperfastDeliveryMenu />
    };

    return serviceComponents[service.title] || (
      <div className="bg-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">{service.title}</h2>
        <p className="text-gray-600 mb-4">{service.description}</p>
        <div className="text-xl text-blue-600 font-semibold">Coming Soon...</div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {sections.map((section) => (
         <div
  key={section.id}
  className="group bg-white shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl h-[450px] flex flex-col"
  onClick={() => setSelectedService(section)}
>
  {/* Image container with fixed height */}
  <div className="relative flex-shrink-0 h-2/4">
    <img
      src={`https://mahaspice.desoftimp.com/ms3/${section.img_address}`}
      alt={section.title}
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
  </div>

  {/* Content container with scrollable text */}
  <div className="p-4 flex-grow overflow-y-auto">
    <h3 className="text-black text-lg font-bold mb-2">{section.title}</h3>
    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
      {section.sub_description}
    </p>

    {/* Bullet points in vertical layout */}
    {section.bullet_points && (
      <div className="text-xs text-gray-500 space-y-2">
        {section.bullet_points.split('\n').map((point, i) => (
          point && (
            <div key={i} className="flex items-start">
              <ChevronRight className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <span className="line-clamp-2">{point}</span>
            </div>
          )
        ))}
      </div>
    )}
  </div>
</div>

        ))}
      </div>

      {selectedService && (
        <div className="mt-8">
          <ServiceContent service={selectedService} />
        </div>
      )}
    </div>
  );
};

export default DynamicServices;