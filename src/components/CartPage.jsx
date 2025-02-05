import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthSystem";

const CartPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMenuTypes, setActiveMenuTypes] = useState([]); // Track active menu types

  // Fetch events that are in the user's cart
  useEffect(() => {
    if (authLoading) {
      return; // Wait for auth to load
    }

    if (!user || !user.id) {
      setError("Please login to view your cart.");
      setLoading(false);
      return;
    }

    const fetchEvents = async () => {
      try {
        const url = `https://mahaspice.desoftimp.com/ms3/get-events.php?user_id=${user.id}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch events.");
        }
        const data = await response.json();
        if (data.success) {
          setEvents(data.data);
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

  // Fetch cart items for the selected event
  useEffect(() => {
    if (!selectedEvent || !user) return;

    const fetchCartItems = async () => {
      try {
        const url = `https://mahaspice.desoftimp.com/ms3/get-cart.php?user_id=${user.id}&event_id=${selectedEvent}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch cart items.");
        }
        const data = await response.json();
        if (data.success) {
          setCartItems(data.data);
        } else {
          throw new Error(data.error || "Failed to fetch cart items.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCartItems();
  }, [selectedEvent, user]);

  // Group cart items by menu_type
  const groupedCartItems = cartItems.reduce((acc, item) => {
    if (!acc[item.menu_type]) {
      acc[item.menu_type] = {
        items: [],
        totalPrice: 0,
        platePrice: item.plate_price || 0,
        guestCount: item.guest_count || 1,
      };
    }
    acc[item.menu_type].items.push(item);
    acc[item.menu_type].totalPrice += item.price ;
    return acc;
  }, {});

  // Get unique menu types for the selected event
  const menuTypes = Object.keys(groupedCartItems);

  // Toggle active menu types
  const handleMenuTypeClick = (menuType) => {
    if (activeMenuTypes.includes(menuType)) {
      setActiveMenuTypes((prev) => prev.filter((type) => type !== menuType)); // Remove if already active
    } else {
      setActiveMenuTypes((prev) => [...prev, menuType]); // Add if not active
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

      {/* Event List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {events && events.length > 0 ? (
          events.map((event = {}) => (
            <div
              key={event.event_id || "default-id"}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedEvent(event.event_id)}
            >
              <img
                src={`https://mahaspice.desoftimp.com/ms3/${event.event_file_path || "default-image.jpg"}`}
                alt={event.event_name || "Event"}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-bold mb-2">{event.event_name || "Event Name"}</h2>
              <p className="text-gray-600">{event.event_category || "Event Category"}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No events found.</p>
        )}
      </div>

      {/* Cart Items for Selected Event */}
      {selectedEvent && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Cart Items</h2>

          {/* Menu Type Buttons */}
          <div className="flex space-x-4 mb-6">
            {menuTypes.map((menuType) => {
              const { totalPrice, guestCount, platePrice } = groupedCartItems[menuType];
              const pricePerGuest = totalPrice / guestCount;

              return (
                <button
                  key={menuType}
                  onClick={() => handleMenuTypeClick(menuType)}
                  className={`px-4 py-2 rounded-lg text-left ${
                    activeMenuTypes.includes(menuType)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  <div className="font-bold">{menuType}</div>
                  
                  {/* <div className="text-sm">Plate Price: ₹{platePrice}</div> */}
                </button>
              );
            })}
          </div>

          {/* Display Cart Items for Active Menu Types Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeMenuTypes.map((menuType) => {
              const { items, totalPrice, guestCount,platePrice } = groupedCartItems[menuType];
              const pricePerGuest = totalPrice / guestCount;

              return (
                
                <div key={menuType} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">{menuType}</h3>
                  <div className="text-base font-bold mb-4 text-black">Guest Count: {guestCount}</div>
                  <div className="text-base font-bold mb-4 text-black">Plate Price: ₹{platePrice}</div>
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div key={index} className="p-4 bg-white rounded-lg shadow-sm">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-gray-700 mb-2">
                              {item.category_name}
                            </h4>
                            <span className="text-gray-600">{item.item_name}</span>
                            <span className="text-gray-600 ml-4">
                              {/* {item.is_extra && item.price !== 0 && `₹${item.price} (Extra)`} */}
                              {item.is_extra && `₹${item.price} (Extra)` || ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;