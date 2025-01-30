import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import SuperfastMeal from './SuperfastMeal';
import SuperfastDeliveryMenu from './SuperfastDelbox';
import CategoryDetail from './CategoryDetail';

const DynamicServices = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [sections, setSections] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const BASE_URL = 'https://mahaspice.desoftimp.com/ms3/';

  useEffect(() => {
    fetchSections();
    fetchEvents();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await fetch(`${BASE_URL}get_sections.php`);
      const data = await response.json();
      if (data.success) {
        setSections(data.sections.sort((a, b) => a.position - b.position));
      }
    } catch (err) {
      console.error('Failed to fetch sections:', err);
      setError('Failed to load sections');
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}get_sup_events.php`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Events data received:', data);
      
      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        console.error('Invalid events data structure:', data);
        setError('Invalid events data received');
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const getEventDataForService = (serviceTitle) => {
    console.log('Looking for events matching:', serviceTitle);
    return events.filter(event => {
      const matches = event.event_title === serviceTitle;
      console.log(`Comparing "${event.event_title}" with "${serviceTitle}": ${matches}`);
      return matches;
    });
  };

  const ServiceContent = ({ service }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const serviceComponents = {
      'Box Genie': <SuperfastMeal />,
      'Home Delivery': <SuperfastDeliveryMenu />
    };

    if (serviceComponents[service.title]) {
      return serviceComponents[service.title];
    }

    const matchingEvents = getEventDataForService(service.title);

    if (selectedCategory) {
      return (
        <CategoryDetail 
          category={selectedCategory} 
          onBack={() => setSelectedCategory(null)} 
        />
      );
    }

    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">{service.title}</h2>
        <p className="text-gray-600 mb-4">{service.description}</p>
        
        {loading ? (
          <div className="text-xl text-blue-600 font-semibold">Loading...</div>
        ) : error ? (
          <div className="text-xl text-red-600 font-semibold">{error}</div>
        ) : matchingEvents.length > 0 ? (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">Available Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchingEvents.map((event) => (
                <div 
                  key={event.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedCategory(event)}
                >
                  {event.img_address && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={`${BASE_URL}${event.img_address}`}
                        alt={event.event_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      {event.event_name}
                    </h4>
                    <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {event.event_title}
                    </span>
                    {event.description && (
                      <p className="mt-2 text-sm text-gray-600">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-xl text-blue-600 font-semibold">Coming Soon...</div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {sections.map((section) => (
          <div
            key={section.id}
            className="group bg-white shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl h-[320px] hover:h-[450px] flex flex-col cursor-pointer"
            onClick={() => setSelectedService(section)}
          >
            {/* Image container */}
            <div className="relative flex-shrink-0 h-48">
              <img
                src={`${BASE_URL}${section.img_address}`}
                alt={section.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>

            {/* Content container */}
            <div className="p-4 flex-grow flex flex-col">
              {/* Always visible content */}
              <div className="flex-shrink-0">
                <h3 className="text-black text-lg font-bold mb-2">{section.title}</h3>
                <p className="text-gray-600 text-sm">
                  {section.sub_description}
                </p>
              </div>

              {/* Expandable bullet points */}
              {section.bullet_points && (
                <div className="text-xs text-gray-500 space-y-2 mt-4 opacity-0 h-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300">
                  {section.bullet_points.split('\n').map((point, i) => (
                    point && (
                      <div key={i} className="flex items-start transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
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