import React, { useState, useEffect } from "react";
import { Plus, Minus, ShoppingCart, X } from "lucide-react";
import DelboxCheckout from "./DelboxCheckout";

const SuperfastDeliveryMenu = () => {
  const [menuData, setMenuData] = useState([]);
  const [menuType, setMenuType] = useState("veg");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItems, setSelectedItems] = useState(() => {
    // Initialize from localStorage if available
    const savedItems = localStorage.getItem('selectedItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  
  const [guestCount, setGuestCount] = useState(() => {
    // Initialize from localStorage if available
    const savedCount = localStorage.getItem('guestCount');
    return savedCount ? parseInt(savedCount) : 5;
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCheckout, setIsCheckout] = useState(() => {
    // Initialize from localStorage if available
    const savedCheckout = localStorage.getItem('isCheckout');
    return savedCheckout ? JSON.parse(savedCheckout) : false;
  });
  const [error, setError] = useState(null);

  // Save state to localStorage whenever it changes
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
    const newCount = Math.max(10, guestCount + increment);
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
    setIsCheckout(true);
  };

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
    const tax = subtotal * 0.18;
    const deliveryCharge = 500;
    const total = subtotal + tax + deliveryCharge;
    return { subtotal, tax, total, deliveryCharge };
  }, [selectedItems]);

  const isItemSelected = (itemId) => selectedItems.some((item) => item.id === itemId);

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
      <div className="bg-white p-4 shadow">
        <div className="flex flex-wrap items-center gap-6">
          {/* Guest Count Controls */}
          <div className="flex items-center">
            <span className="font-semibold">Guests:</span>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={() => handleGuestCountChange(-1)}
                className="p-3 bg-gray-100 hover:bg-gray-200"
              >
                <Minus size={16} />
              </button>
              <span className="px-4 py-2 min-w-[60px] text-center">
                {guestCount}
              </span>
              <button
                onClick={() => handleGuestCountChange(1)}
                className="p-3 bg-gray-100 hover:bg-gray-200"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Menu Type Toggle */}
          <div className="flex items-center gap-2">
            <span className="font-semibold">Menu Type:</span>
            <div className="flex rounded-lg overflow-hidden border">
              <button
                onClick={() => setMenuType("veg")}
                className={`px-4 py-2 ${
                  menuType === "veg"
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                Veg
              </button>
              <button
                onClick={() => setMenuType("non-veg")}
                className={`px-4 py-2 ${
                  menuType === "non-veg"
                    ? "bg-red-500 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                Non-Veg
              </button>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.category_type)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === category.category_type
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {category.category_type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1 gap-4 p-4">
        {/* Menu Items Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {menuData
              .filter((item) =>
                menuType === "veg"
                  ? item.veg_non === "veg"
                  : item.veg_non === "non-veg"
              )
              .filter((item) => item.category_type === selectedCategory)
              .map((item) => (
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
              <span>Tax (18%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span>₹{deliveryCharge}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
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

export default SuperfastDeliveryMenu;
