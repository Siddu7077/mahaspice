import React, { useState, useEffect } from "react";
import { Plus, Minus, ShoppingCart, X } from "lucide-react";
import DelboxCheckout from "./DelboxCheckout";
import { useAuth } from "./AuthSystem";
import { useNavigate } from "react-router-dom";

const DeliveryMenu = () => {
  const [menuData, setMenuData] = useState([]);
  const [menuType, setMenuType] = useState("veg");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItems, setSelectedItems] = useState(() => {
    const savedItems = localStorage.getItem('selectedItems');
    return savedItems ? JSON.parse(savedItems) : [];
  
  });
  const [gstPercentage, setGstPercentage] = useState(0);
  const [serviceType, setServiceType] = useState("home_delivery");
  const [guestCount, setGuestCount] = useState(() => {
    const savedCount = localStorage.getItem('guestCount');
    return savedCount ? parseInt(savedCount) : 5;
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCheckout, setIsCheckout] = useState(() => {
    const savedCheckout = localStorage.getItem('isCheckout');
    return savedCheckout ? JSON.parse(savedCheckout) : false;
  });
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { user } = useAuth();
  // Function to clear localStorage
  const clearLocalStorage = () => {
    localStorage.removeItem('selectedItems');
    localStorage.removeItem('guestCount');
    localStorage.removeItem('isCheckout');
  };

  // Handle page visibility change
  useEffect(() => {

    

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearLocalStorage();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const fetchGST = async () => {
      try {
        const response = await fetch(
          "https://mahaspice.desoftimp.com/ms3/displaygst.php"
        );
        const data = await response.json();

        if (data.success) {
          const serviceGst = data.data.find(
            (item) => item.service_type === serviceType
          );
          if (serviceGst) {
            setGstPercentage(parseFloat(serviceGst.gst_percentage));
          }
        }
      } catch (err) {
        console.error("Error fetching GST:", err);
        setError("Failed to load GST data");
      }
    };

    fetchGST();
  }, [serviceType]);

  // Handle window unload
  useEffect(() => {
    const handleUnload = () => {
      clearLocalStorage();
    };

    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('unload', handleUnload);
    };
  }, []);

  
  // Handle inactivity timer
  useEffect(() => {
    let inactivityTimer;
    const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 2 minutes in milliseconds

    const resetTimer = () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      inactivityTimer = setTimeout(() => {
        clearLocalStorage();
        // Reset states to default values
        setSelectedItems([]);
        setGuestCount(5);
        setIsCheckout(false);
      }, INACTIVITY_TIMEOUT);
    };

    // Events to track user activity
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart'
    ];

    // Add event listeners for user activity
    activityEvents.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    // Initial timer setup
    resetTimer();

    // Cleanup
    return () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
  }, [selectedItems]);

  useEffect(() => {
    localStorage.setItem('guestCount', guestCount.toString());
  }, [guestCount]);

  useEffect(() => {
    localStorage.setItem('isCheckout', JSON.stringify(isCheckout));
  }, [isCheckout]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://mahaspice.desoftimp.com/ms3/getHomeItems.php"
        );
        const data = await response.json();
        const processedMenuItems = data.items || [];

        const uniqueCategories = [
          ...new Set(processedMenuItems.map((item) => item.category_type)),
        ].map((category, index) => ({
          id: index,
          category_type: category,
        }));

        setMenuData(processedMenuItems);
        setCategories(uniqueCategories);

        if (uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0].category_type);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load menu data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGuestCountChange = (increment) => {
    const newCount = Math.max(5, guestCount + (increment *5));
    setGuestCount(newCount);
    updateDefaultQuantities(newCount);
  };

  const updateDefaultQuantities = (newGuestCount) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        quantity: Math.ceil(newGuestCount),
      }))
    );
  };

  const handleItemQuantity = (itemId, change) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const handleCheckout = () => {
  // Check if cart is empty
  if (selectedItems.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // If user is not logged in
  if (!user) {
    // Store current cart state in localStorage
    localStorage.setItem('pendingCart', JSON.stringify({
      selectedItems,
      guestCount,
      menuType,
      selectedCategory
    }));

    // Store the current path for redirect
    const currentPath = window.location.pathname;
    localStorage.setItem('checkoutRedirect', currentPath);

    // Redirect to login page
    window.location.href = "/login";
    return;
  }

  // If user is logged in, proceed to checkout
  setIsCheckout(true);
};

// Add this useEffect at the component level to handle post-login redirect
useEffect(() => {
  // Check if there's a pending cart and we're returning from login
  const pendingCart = localStorage.getItem('pendingCart');
  const checkoutRedirect = localStorage.getItem('checkoutRedirect');

  if (user && pendingCart && checkoutRedirect) {
    try {
      // Restore cart state
      const cartData = JSON.parse(pendingCart);
      setSelectedItems(cartData.selectedItems);
      setGuestCount(cartData.guestCount);
      setMenuType(cartData.menuType);
      setSelectedCategory(cartData.selectedCategory);

      // Clear the pending cart and redirect data
      localStorage.removeItem('pendingCart');
      localStorage.removeItem('checkoutRedirect');
    } catch (error) {
      console.error('Error restoring cart:', error);
    }
  }
}, [user]); // Only run when user auth state changes

  const handleAddItem = (item) => {
    const defaultQuantity = Math.ceil(guestCount);
    setSelectedItems((prevItems) => {
      if (prevItems.some((i) => i.id === item.id)) {
        return prevItems.filter((i) => i.id !== item.id);
      }
      return [...prevItems, { ...item, quantity: defaultQuantity }];
    });
  };
  

  const calculateTotals = React.useMemo(() => {
    const subtotal = selectedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const gst = (subtotal * gstPercentage) / 100;
    
    const total = subtotal + gst ;
    return { subtotal, gst, total};
  }, [selectedItems]);

  const isItemSelected = (itemId) => selectedItems.some((item) => item.id === itemId);

  const filteredItems = React.useMemo(() => {
    return menuData
      .filter((item) =>
        menuType === "veg"
          ? item.veg_non === "veg"
          : item.veg_non === "non-veg"
      )
      .filter((item) => item.category_type === selectedCategory);
  }, [menuData, menuType, selectedCategory]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const { subtotal, tax, total, deliveryCharge } = calculateTotals;
  if (isCheckout) {
    return (
      <DelboxCheckout
        selectedItems={selectedItems}
        totals={calculateTotals}
        guestCount={guestCount}
        onBack={() => setIsCheckout(false)}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Controls Section */}
      <div className="bg-white p-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Home Delivery</h2>
      </div>
      <div className="bg-white p-4 shadow">
        <div className="flex flex-wrap justify-between items-center">
          {/* Category Navigation - Left Side */}
          <div className="w-full lg:w-7/12 mb-4 lg:mb-0">
            <div className="flex flex-wrap gap-2 max-w-full">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.category_type)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors min-w-[120px] text-center
              ${selectedCategory === category.category_type
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                >
                  {category.category_type}
                </button>
              ))}
            </div>
          </div>

          {/* Controls - Right Side */}
          <div className="flex flex-wrap items-center gap-4 lg:gap-6 w-full lg:w-auto">
            {/* Menu Type Toggle */}
            <div className="w-full sm:w-auto order-2 sm:order-1">
              <div className="flex justify-center gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setMenuType("veg")}
                  className={`px-6 py-2 rounded-md transition-all ${menuType === "veg"
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-transparent text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  Veg
                </button>
                <button
                  onClick={() => setMenuType("non-veg")}
                  className={`px-6 py-2 rounded-md transition-all ${menuType === "non-veg"
                      ? "bg-red-500 text-white shadow-md"
                      : "bg-transparent text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  Non-Veg
                </button>
              </div>
            </div>

            {/* Guest Count Controls with Input */}
            <div className="w-full sm:w-auto order-1 sm:order-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-gray-700 font-medium">Guests:</span>
                <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleGuestCountChange(-1)}
                    className="p-2 hover:bg-gray-200 transition-colors"
                  >
                    <Minus size={16} className="text-gray-600" />
                  </button>
                  <input
                    type="number"
                    value={guestCount}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 5;
                      setGuestCount(Math.max(5, value));
                      updateDefaultQuantities(Math.max(5, value));
                    }}
                    onBlur={(e) => {
                      const value = parseInt(e.target.value) || 5;
                      setGuestCount(Math.max(5, value));
                      updateDefaultQuantities(Math.max(5, value));
                    }}
                    className="w-16 text-center bg-transparent border-none focus:outline-none font-semibold"
                    min="10"
                  />
                  <button
                    onClick={() => handleGuestCountChange(1)}
                    className="p-2 hover:bg-gray-200 transition-colors"
                  >
                    <Plus size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1 gap-4 p-4">
        {/* Menu Items Grid */}
        <div className="flex-1">
          {filteredItems.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-red-500 text-2xl font-bold text-center">
                No items available in {selectedCategory} for {menuType === "veg" ? "vegetarian" : "non-vegetarian"} category
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow p-4 flex flex-col"
                >
                  <img
                    src={`https://mahaspice.desoftimp.com/ms3/uploads/homeCategory/${item.image_path}`}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/400/320";
                      e.target.onerror = null;
                    }}
                  />
                  <div className="mt-4 flex-1 flex flex-col">
                    <h3 className="font-bold flex-1">{item.title}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-gray-600 font-semibold">₹{item.price}</p>
                      {isItemSelected(item.id) ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleItemQuantity(item.id, -1)}
                            className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="min-w-[40px] text-center">
                            {selectedItems.find((i) => i.id === item.id)?.quantity || 0}
                          </span>
                          <button
                            onClick={() => handleItemQuantity(item.id, 1)}
                            className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            onClick={() => handleAddItem(item)}
                            className="ml-2 p-2 rounded bg-red-500 text-white hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddItem(item)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          <ShoppingCart size={16} />
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 bg-white rounded-lg shadow-lg p-6 h-fit sticky top-4">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          <div className="space-y-4 max-h-[50vh] overflow-y-auto">
            {selectedItems.length === 0 ? (
              <p className="text-gray-500">No items selected.</p>
            ) : (
              selectedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2 border-b"
                >
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-600">
                      ₹{item.price} x {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">₹{item.price * item.quantity}</p>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 space-y-2 pt-4 border-t">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST ({gstPercentage}%)</span>
              <span>₹{calculateTotals.gst.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>₹{calculateTotals.total.toFixed(2)}</span>
            </div>
          </div>

          <button
            className="mt-6 w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={selectedItems.length === 0}
            onClick={handleCheckout}
          >
            <ShoppingCart size={20} />
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryMenu;