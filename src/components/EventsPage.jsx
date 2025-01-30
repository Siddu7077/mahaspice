import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EventsPage = () => {
  const { eventType } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://mahaspice.desoftimp.com/ms3/get_events.php');
        const data = await response.json();
        
        // Find all events that match the category
        const matchedEvents = data.filter(event => 
          event.event_name.toLowerCase() === eventType.toLowerCase() ||
          event.event_name.toLowerCase().replace(/\s+/g, '-') === eventType.toLowerCase()
        );

        if (matchedEvents.length > 0) {
          // Transform database data to match component structure
          const transformedData = {
            mainTitle: matchedEvents[0].event_name, // Use the first event's name as main title
            mainDescription: "Choose from our variety of services below", // Generic description
            services: matchedEvents.map(event => ({
              title: event.event_category,
              description: event.event_description,
              image: `https://mahaspice.desoftimp.com/ms3/${event.event_file_path}`,
              startingPrice: parseFloat(event.event_veg_price),
              nonVegPrice: parseFloat(event.event_nonveg_price),
              highlights: [
                `Veg Price: ₹${event.event_veg_price}`,
                `Non-Veg Price: ₹${event.event_nonveg_price}`,
                "Customizable menu options",
                "Professional service"
              ]
            }))
          };
          setEventData(transformedData);
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventType]);

  const handleOrderNow = (service) => {
    const formattedServiceTitle = service.title
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '');

    const formattedEventType = eventType
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '');

    navigate(`/events/${formattedEventType}/${formattedServiceTitle}/Menu`);
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600">
          Event type not found!
        </h2>
        <p className="text-gray-600 mt-2">
          Please check the URL or select a valid event.
        </p>
      </div>
    );
  }
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        {eventData.mainTitle}
      </h1>
      <p className="text-gray-700 mb-8">{eventData.mainDescription}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {eventData.services.map((service, index) => (
          <div
            onClick={() => handleOrderNow(service)}
            key={index}
            className="border rounded-lg shadow-md overflow-hidden bg-white cursor-pointer"
          >
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-60 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder-image.jpg"; // Add a placeholder image if the main image fails to load
              }}
            />
            <div className="p-4">
              <h3 className="text-lg font-bold text-black mb-2">
                {service.title}
              </h3>
              {/* <p className="text-gray-600 mb-2">{service.description}</p>
              <p className="text-gray-800 font-semibold mb-4">
                Starting Price: ₹{service.startingPrice.toLocaleString()}
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
                {service.highlights.map((highlight, idx) => (
                  <li key={idx}>{highlight}</li>
                ))}
              </ul> */}
              <div className="text-center">
                <button
                  onClick={() => handleOrderNow(service)}
                  className="mt-3 w-full p-3 bg-green-700 text-white rounded-md hover:bg-green-600 transition"
                >
                  Choose your package
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;