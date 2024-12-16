import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import data from "./catering-services-data.json";

const EventsPage = () => {
  const { eventType } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    // Directly use the key from the URL
    const matchedEvent = data[eventType] ||
      data[eventType.replace('-', ' ')] ||
      data[eventType.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')];

    setEventData(matchedEvent || null);
  }, [eventType]);

  const handleOrderNow = (service) => {
    // Create a URL-friendly version of the service title
    const formattedServiceTitle = service.title
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '');

    // Create a URL-friendly version of the event type
    const formattedEventType = eventType
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '');

    // Navigate to the menu page with the specific parameters
    navigate(`/events/${formattedEventType}/${formattedServiceTitle}/Menu`);
  };

  if (!eventData) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600">
          Event type not found!
        </h2>
        <p className="text-gray-600 mt-2">
          Please check the URL or select a valid event.
        </p>
        <div className="mt-4">
          <p className="text-gray-500">Available event types:</p>
          <ul className="text-gray-700">
            {Object.keys(data).map((key) => (
              <li key={key}>{key}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        {eventData.mainTitle}
      </h1>
      <p className="text-gray-700 mb-8">{eventData.mainDescription}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {eventData.services.map((service, index) => (
          <div
          onClick={() => handleOrderNow(service)}
            key={index}
            className="border rounded-lg shadow-md overflow-hidden bg-white"
          >
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold text-green-700 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-2">{service.description}</p>
              <p className="text-gray-800 font-semibold mb-4">
                Starting Price: ₹{service.startingPrice.toLocaleString()}
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
                {service.highlights.map((highlight, idx) => (
                  <li key={idx}>{highlight}</li>
                ))}
              </ul>
            </div>
            <div className="justify-center text-center mb-4">
              <button
                onClick={() => handleOrderNow(service)}
                className="mt-3 w-1/3 bg-black items-center justify-center text-center text-white py-2 rounded-md hover:bg-black transition"
              >
                Order Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;