import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthSystem";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMenuTypes, setSelectedMenuTypes] = useState([]);
  const [extraTotal, setExtraTotal] = useState(0);

  const navigate = useNavigate();


  // Helper function to sanitize and create consistent keys
  const createKey = (eventName, menuType) => {
    const sanitizedEventName = eventName.replace(/[^\w\s-]/g, "").trim();
    const sanitizedMenuType = menuType.replace(/[^\w\s-]/g, "").trim();
    return `${sanitizedEventName}-${sanitizedMenuType}`.toLowerCase();
  };

  // Store original event and menu type mappings
  const [keyMappings, setKeyMappings] = useState({});

  // const handleProceedToCheckout = (key) => {
  //   console.log("Attempting checkout with key:", key);
  //   console.log("Available grouped items:", groupedCartItems);

  //   const menuData = groupedCartItems[key];


  

  //   if (!menuData) {
  //     console.error("Menu data not found. Debug info:", {
  //       attemptedKey: key,
  //       availableKeys: Object.keys(groupedCartItems),
  //       groupedItems: groupedCartItems,
  //     });
  //     alert(`Menu data not found. Please try again. (Key: ${key})`);
  //     return;
  //   }

  //   navigate("/order", {
  //     state: {
  //       selectedItems: menuData.items.filter((item) => !item.is_extra),
  //       extraItems: menuData.items.filter((item) => item.is_extra),
  //       platePrice: menuData.platePrice,
  //       guestCount: menuData.guestCount,
  //       totalAmount: menuData.totalPrice,
  //     },
  //   });
  // };

  const calculateExtraTotal = (items) => {
    return items
      .filter(item => item.is_extra)
      .reduce((sum, item) => sum + (Number(item.price) || 50), 0);
  };

  const handleProceedToCheckout = (key) => {
    const menuData = groupedCartItems[key];
    
    if (!menuData) {
      console.error("Menu data not found", { key, groupedCartItems });
      alert(`Menu data not found. Please try again. (Key: ${key})`);
      return;
    }

    navigate("/order", {
      state: {
        selectedItems: menuData.items.filter((item) => !item.is_extra),
        extraItems: menuData.items.filter((item) => item.is_extra),
        platePrice: menuData.platePrice,
        guestCount: menuData.guestCount,
        totalAmount: menuData.totalPrice,
        extraAmount: menuData.extraTotal,
      },
    });
  };

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
          const eventMap = new Map();
          const newKeyMappings = {};

          data.data.forEach((item) => {
            const key = createKey(item.event_name, item.menu_type);
            newKeyMappings[key] = {
              eventName: item.event_name,
              menuType: item.menu_type,
            };

            if (!eventMap.has(item.event_name)) {
              eventMap.set(item.event_name, {
                event_name: item.event_name,
                menu_types: new Set(),
              });
            }
            eventMap.get(item.event_name).menu_types.add(item.menu_type);
          });

          setKeyMappings(newKeyMappings);

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
  

  useEffect(() => {
    if (!selectedMenuTypes.length) return;

    const fetchCartItems = async () => {
      try {
        const localUser = JSON.parse(localStorage.getItem("user"));
        const currentUser = user || localUser;

        if (!currentUser) return;

        const url = `https://mahaspice.desoftimp.com/ms3/get-cart.php?user_id=${currentUser.id}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch cart items.");
        }
        const data = await response.json();

        if (data.success) {
          const filteredItems = data.data.filter((item) => {
            const key = createKey(item.event_name, item.menu_type);
            return selectedMenuTypes.includes(key);
          });
          setCartItems(filteredItems);
        } else {
          throw new Error(data.error || "Failed to fetch cart items.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCartItems();
  }, [selectedMenuTypes, user]);

  

  const groupedCartItems = cartItems.reduce((acc, item) => {
    const key = createKey(item.event_name, item.menu_type);

    if (!acc[key]) {
      acc[key] = {
        items: [],
        platePrice: item.plate_price || 0,
        guestCount: item.guest_count || 1,
      };
    }
    acc[key].items.push(item);
    
    // Calculate totals after adding item
    const extraTotal = calculateExtraTotal(acc[key].items);
    const baseTotal = acc[key].platePrice * acc[key].guestCount;
    acc[key].extraTotal = extraTotal;
    acc[key].baseTotal = baseTotal;
    acc[key].totalPrice = baseTotal + extraTotal;
    
    return acc;
  }, {});

  const handleMenuTypeClick = (eventName, menuType) => {
    const key = createKey(eventName, menuType);

    if (selectedMenuTypes.includes(key)) {
      setSelectedMenuTypes((prev) => prev.filter((type) => type !== key));
    } else {
      setSelectedMenuTypes((prev) => [...prev, key]);
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

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Available Menu Types</h2>
        <div className="flex flex-wrap gap-4">
          {events.map((event) =>
            event.menu_types.map((menuType) => {
              const key = createKey(event.event_name, menuType);
              return (
                <button
                  key={key}
                  onClick={() => handleMenuTypeClick(event.event_name, menuType)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedMenuTypes.includes(key)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } transition-colors`}
                >
                  {`${event.event_name} - ${menuType}`}
                </button>
              );
            })
          )}
        </div>
      </div>

      {selectedMenuTypes.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Compare Menu Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedMenuTypes.map((key) => {
              const menuData = groupedCartItems[key];
              const originalData = keyMappings[key];

              if (!menuData || !originalData) return null;

              return (
                <div key={key} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">
                    {originalData.eventName} - {originalData.menuType}
                  </h3>
                  <div className="space-y-2 mb-4 bg-white p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-gray-600">Guest Count:</div>
                      <div className="font-semibold text-right">{menuData.guestCount}</div>
                      
                      <div className="text-gray-600">Plate Price:</div>
                      <div className="font-semibold text-right">₹{menuData.platePrice}</div>
                      
                      <div className="text-gray-600">Base Total:</div>
                      <div className="font-semibold text-right">₹{menuData.baseTotal}</div>
                      
                      <div className="text-gray-600">Extra Items Total:</div>
                      <div className="font-semibold text-right text-orange-600">₹{menuData.extraTotal}</div>
                      
                      <div className="text-gray-600 font-bold pt-2 border-t">Final Total:</div>
                      <div className="font-bold text-right pt-2 border-t">₹{menuData.totalPrice}</div>
                    </div>
                  </div>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2">Category</th>
                        <th className="py-2">Item Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuData.items.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{item.category_name}</td>
                          <td className="py-2">
                            <div className="flex justify-between items-center">
                              <span>{item.item_name}</span>
                              {item.is_extra && (
                                <span className="text-orange-600 text-sm">
                                  Extra (+₹{item.price || 0})
                                </span>
                              )|| ""}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    onClick={() => handleProceedToCheckout(key)}
                    className="w-full mt-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                  >
                    Proceed to Checkout
                  </button>
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