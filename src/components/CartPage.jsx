import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthSystem";

const CartPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMenuTypes, setSelectedMenuTypes] = useState([]);
  const [availableMenuTypes, setAvailableMenuTypes] = useState([]);

  // Fetch events and their menu types
  useEffect(() => {
    if (authLoading) return;

    const fetchEvents = async () => {
      try {
        const localUser = JSON.parse(localStorage.getItem("user"));
        const currentUser = user || localUser;

        if (!currentUser || !currentUser.id) {
          setError("Please login to view your cart.");
          setLoading(false);
          return;
        }

        const url = `https://mahaspice.desoftimp.com/ms3/get-cart.php?user_id=${currentUser.id}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch events.");
        }
        const data = await response.json();

        if (data.success) {
          // Group events and their menu types
          const eventMap = new Map();

          data.data.forEach((item) => {
            if (!eventMap.has(item.event_name)) {
              eventMap.set(item.event_name, {
                event_name: item.event_name,
                menu_types: new Set(),
              });
            }
            eventMap.get(item.event_name).menu_types.add(item.menu_type);
          });

          const uniqueEvents = Array.from(eventMap.values()).map((event) => ({
            ...event,
            menu_types: Array.from(event.menu_types),
          }));

          setEvents(uniqueEvents);
        } else {
          throw new Error(data.error || "Failed to fetch events.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user, authLoading]);

  // Update available menu types when an event is selected
  useEffect(() => {
    if (!selectedEvent) {
      setAvailableMenuTypes([]);
      setSelectedMenuTypes([]);
      return;
    }

    const selectedEventData = events.find(
      (event) => event.event_name === selectedEvent
    );
    if (selectedEventData) {
      setAvailableMenuTypes(selectedEventData.menu_types);
      setSelectedMenuTypes([]);
    }
  }, [selectedEvent, events]);

  // Fetch cart items for selected menu types
  useEffect(() => {
    if (!selectedMenuTypes.length || !selectedEvent) return;

    const fetchCartItems = async () => {
      try {
        const localUser = JSON.parse(localStorage.getItem("user"));
        const currentUser = user || localUser;

        if (!currentUser) return;

        const url = `https://mahaspice.desoftimp.com/ms3/get-cart.php?user_id=${
          currentUser.id
        }&event_name=${encodeURIComponent(selectedEvent)}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch cart items.");
        }
        const data = await response.json();

        if (data.success) {
          // Filter items based on selected menu types
          const filteredItems = data.data.filter((item) =>
            selectedMenuTypes.includes(item.menu_type)
          );
          setCartItems(filteredItems);
        } else {
          throw new Error(data.error || "Failed to fetch cart items.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCartItems();
  }, [selectedMenuTypes, selectedEvent, user]);

  // Group cart items by menu_type
  const groupedCartItems = cartItems.reduce((acc, item) => {
    if (!acc[item.menu_type]) {
      acc[item.menu_type] = {
        items: [],
        totalPrice: item.total_price || 0,
        platePrice: item.plate_price || 0,
        guestCount: item.guest_count || 1,
      };
    }
    acc[item.menu_type].items.push(item);
    return acc;
  }, {});

  const handleEventSelect = (eventName) => {
    setSelectedEvent(eventName);
    setSelectedMenuTypes([]);
  };

  const handleMenuTypeClick = (menuType) => {
    if (selectedMenuTypes.includes(menuType)) {
      setSelectedMenuTypes((prev) => prev.filter((type) => type !== menuType));
    } else {
      setSelectedMenuTypes((prev) => [...prev, menuType]);
    }
  };

  if (authLoading) {
    return <div className="p-8 text-center">Loading authentication...</div>;
  }
  if (loading) {
    return <div className="p-8 text-center">Loading cart...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {/* Event Selection */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Select Event</h2>
        <div className="flex flex-wrap gap-4">
          {events.map((event) => (
            <button
              key={event.event_name}
              onClick={() => handleEventSelect(event.event_name)}
              className={`px-6 py-3 rounded-lg ${
                selectedEvent === event.event_name
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } shadow-md transition-colors`}
            >
              {event.event_name.replace(/-/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Types */}
      {selectedEvent && availableMenuTypes.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Available Menu Types</h2>
          <div className="flex flex-wrap gap-4">
            {availableMenuTypes.map((menuType) => (
              <button
                key={menuType}
                onClick={() => handleMenuTypeClick(menuType)}
                className={`px-4 py-2 rounded-lg ${
                  selectedMenuTypes.includes(menuType)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } transition-colors`}
              >
                {menuType}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Menu Items Comparison */}
      {selectedMenuTypes.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Compare Menu Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedMenuTypes.map((menuType) => (
              <div key={menuType} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">{menuType}</h3>
                <div className="space-y-2 mb-4">
                  <div className="font-bold">
                    Guest Count: {groupedCartItems[menuType]?.guestCount}
                  </div>
                  <div className="font-bold">
                    Plate Price: ₹{groupedCartItems[menuType]?.platePrice}
                  </div>
                  <div className="font-bold">
                    Total Price: ₹{groupedCartItems[menuType]?.totalPrice}
                  </div>
                </div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2">Category</th>
                      <th className="py-2">Item Name</th>
                      {/* <th className="py-2">Price</th> */}
                      {/* <th className="py-2">Extra</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {groupedCartItems[menuType]?.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{item.category_name}</td>
                        <td className="py-2">
                          {item.item_name}{" "}
                          {item.is_extra && (
                            <span className="text-red-500">
                              (Extra Item) ₹{item.price}
                            </span>
                          )|| ""}
                        </td>

                        {/* <td className="py-2">{item.is_extra ? "Yes" : "No"}</td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
