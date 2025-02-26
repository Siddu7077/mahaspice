import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const EventContext = createContext();

// Transform API data
const transformEventData = (apiResponse) => {
  const result = {
    "wedding-events": [],
    "corporate-events": [],
    "event-catering": [],
    "design-menu": []
  };

  apiResponse.forEach(event => {
    const eventName = event.event_name.toLowerCase().replace(/ /g, '-');
    const category = event.event_category.trim();
    
    switch(eventName) {
      case 'wedding-catering':
        result['wedding-events'].push(category);
        break;
      case 'corporate-events':
        result['corporate-events'].push(category);
        break;
      case 'event-caterers':
        result['event-catering'].push(category);
        break;
    }
  });

  // Remove duplicates and sort
  Object.keys(result).forEach(key => {
    result[key] = [...new Set(result[key])].sort();
  });

  return result;
};

// Create the provider component
export const EventProvider = ({ children }) => {
  const [eventCategories, setEventCategories] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch('https://adminmahaspice.in/ms3/get_events.php');
        const data = await response.json();
        const transformedData = transformEventData(data);
        setEventCategories(transformedData);
        setError(null);
      } catch (err) {
        setError('Failed to load event data');
        console.error('Error fetching event data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, []);

  const dropdownConfig = eventCategories ? [
    {
      key: "wedding-events",
    //   icon: <Ring size={16} className="mr-2" />,
      label: "Wedding Events",
      items: eventCategories["wedding-events"],
      path: "/events/wedding-catering"
    },
    {
      key: "corporate-events",
    //   icon: <Building size={16} className="mr-2" />,
      label: "Corporate Events",
      items: eventCategories["corporate-events"],
      path: "/events/corporate-events"
    },
    {
      key: "event-catering",
    //   icon: <UtensilsCrossed size={16} className="mr-2" />,
      label: "Event Catering",
      items: eventCategories["event-catering"],
      path: "/events/event-caterers"
    }
  ] : [];

  const value = {
    eventCategories,
    dropdownConfig,
    isLoading,
    error
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

// Custom hook to use the event context
export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export default EventProvider;