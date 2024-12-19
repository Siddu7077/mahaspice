import React, { useState } from "react";
import {
  Utensils,
  Leaf,
  PlusCircle,
  MinusCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { menuItems, menuCategories } from "./data";
import "./del.css";
import DelboxCheckout from "./DelboxCheckout";

const DeliveryMenu = () => {
  const [menuType, setMenuType] = useState("veg");
  const [selectedCategory, setSelectedCategory] = useState("beverages");
  const [selectedItems, setSelectedItems] = useState([]);
  const [guestCount, setGuestCount] = useState(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileOrderSummaryOpen, setIsMobileOrderSummaryOpen] =
    useState(false);
  const [isCheckout, setIsCheckout] = useState(false);

  const handleAddItem = (item) => {
    const existingItem = selectedItems.find((i) => i.id === item.id);
    if (existingItem) {
      setSelectedItems(
        selectedItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setSelectedItems([
        ...selectedItems,
        { ...item, quantity: 1, category: selectedCategory },
      ]);
    }
  };

  const handleCheckout = () => {
    setIsCheckout(true);
  };

  

  const handleRemoveItem = (itemId) => {
    const existingItem = selectedItems.find((i) => i.id === itemId);
    if (existingItem.quantity > 1) {
      setSelectedItems(
        selectedItems.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        )
      );
    } else {
      setSelectedItems(selectedItems.filter((i) => i.id !== itemId));
    }
  };

  const handleItemQuantityChange = (itemId, newQuantity) => {
    const numQuantity = Math.max(0, Number(newQuantity));
    if (numQuantity === 0) {
      setSelectedItems(selectedItems.filter((i) => i.id !== itemId));
    } else {
      setSelectedItems(
        selectedItems.map((i) =>
          i.id === itemId ? { ...i, quantity: numQuantity } : i
        )
      );
    }
  };

  const calculateTotals = () => {
    const subtotal = selectedItems.reduce(
      (total, item) => total + item.price * item.quantity * guestCount,
      0
    );
    const tax = subtotal * 0.18;
    const total = subtotal + tax + 500;
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  // Get categories based on selected menu type
  const categories = menuCategories[menuType].map((cat) => cat.id);

  if (isCheckout) {
    return (
      <DelboxCheckout
        selectedItems={selectedItems}
        totals={calculateTotals()}
        onBack={() => setIsCheckout(false)}
      />
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white shadow-md">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 bg-gray-100 rounded-lg"
        >
          <ChevronLeft />
        </button>
        <div className="flex items-center space-x-4">
          <span
            className={`${
              menuType === "veg" ? "text-green-600" : "text-gray-500"
            }`}
          >
            Veg
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={menuType === "nonveg"}
              onChange={() =>
                setMenuType(menuType === "veg" ? "nonveg" : "veg")
              }
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600"></div>
          </label>
          <span
            className={`${
              menuType === "nonveg" ? "text-red-600" : "text-gray-500"
            }`}
          >
            Non-Veg
          </span>
        </div>
        <button
          onClick={() => setIsMobileOrderSummaryOpen(!isMobileOrderSummaryOpen)}
          className="p-2 bg-gray-100 rounded-lg"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Mobile Sidebar (Categories) */}
      {isMobileSidebarOpen && (
        <div className="md:hidden fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 overflow-y-auto">
          <div className="p-4 space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {menuCategories[menuType].find((cat) => cat.id === category)
                  ?.name || category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Sidebar - Categories */}
      <div className="hidden md:block w-48 bg-white shadow-lg pt-4 overflow-y-auto">
        <div className="space-y-2 px-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`w-full text-left px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {menuCategories[menuType].find((cat) => cat.id === category)
                ?.name || category}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Order Summary */}
      {isMobileOrderSummaryOpen && (
        <div className="md:hidden fixed inset-y-0 right-0 w-full bg-white shadow-lg z-50 overflow-y-auto p-6">
          {/* Same content as desktop order summary, but full-width */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Order Summary</h2>
            <button
              onClick={() => setIsMobileOrderSummaryOpen(false)}
              className="p-2 bg-gray-100 rounded-lg"
            >
              <ChevronRight />
            </button>
          </div>

          {/* Order summary content (same as desktop version) */}
          {selectedItems.length === 0 ? (
            <div className="text-center text-gray-500">No items selected</div>
          ) : (
            <>
              {/* Selected Items List */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {Object.entries(
                  selectedItems.reduce((acc, item) => {
                    if (!acc[item.category]) {
                      acc[item.category] = [];
                    }
                    acc[item.category].push(item);
                    return acc;
                  }, {})
                ).map(([category, items]) => (
                  <div key={category} className="mb-4">
                    <h3 className="text-lg font-bold mb-2 pb-2 border-b">
                      {menuCategories[menuType].find(
                        (cat) => cat.id === category
                      )?.name || category}
                    </h3>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
                        >
                          <div>
                            <span className="font-semibold">{item.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600 mr-2">
                              × {item.quantity}
                            </span>
                            <span className="font-semibold">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>₹ 500</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                className="w-full bg-green-500 text-white py-3 rounded-lg mt-6 hover:bg-green-600 transition-colors"
                disabled={selectedItems.length === 0}
              >
                Proceed to Checkout
              </button>
            </>
          )}
        </div>
      )}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Desktop Menu Type and Guest Count */}
        <div className="hidden md:flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <span
              className={`${
                menuType === "veg"
                  ? "text-green-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              Veg
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={menuType === "nonveg"}
                onChange={() =>
                  setMenuType(menuType === "veg" ? "nonveg" : "veg")
                }
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none   rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600"></div>
            </label>
            <span
              className={`${
                menuType === "nonveg"
                  ? "text-red-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              Non-Veg
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Guests:</span>
            <div className="flex items-center">
              <button
                onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                className="text-gray-500 hover:text-gray-700"
              >
                <MinusCircle />
              </button>
              <span className="mx-2">{guestCount}</span>
              <button
                onClick={() => setGuestCount(guestCount + 1)}
                className="text-gray-500 hover:text-gray-700"
              >
                <PlusCircle />
              </button>
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
          {menuItems[menuType][selectedCategory].map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow overflow-hidden w-full h-96 flex flex-col transform hover:shadow-lg transition-transform"
            >
              <div className="w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x300?text=Image+Not+Available";
                  }}
                />
              </div>
              <div className="p-4 flex-grow flex flex-col justify-between">
                <h3 className="text-lg font-bold truncate">{item.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-green-600 font-semibold">
                    ₹{item.price.toFixed(2)}
                  </span>
                  {!selectedItems.find((i) => i.id === item.id) ? (
                    <button
                      onClick={() => handleAddItem(item)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Add
                    </button>
                  ) : (
                    <div className="flex items-center border rounded-md overflow-hidden">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="px-4 py-2 bg-red-500 text-white text-sm font-medium hover:bg-red-600"
                      >
                        <MinusCircle size={16} />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={
                          selectedItems.find((i) => i.id === item.id)
                            ?.quantity || 0
                        }
                        onChange={(e) =>
                          handleItemQuantityChange(item.id, e.target.value)
                        }
                        className="w-16 text-center border-l border-r border-gray-300 focus:outline-none"
                        style={{ appearance: "textfield" }}
                      />
                      <button
                        onClick={() => handleAddItem(item)}
                        className="px-4 py-2 bg-green-500 text-white text-sm font-medium hover:bg-green-600"
                      >
                        <PlusCircle size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Order Summary Sidebar */}
      <div className="hidden md:block w-76 bg-white shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Order Summary</h2>
        </div>

        {selectedItems.length === 0 ? (
          <div className="text-center text-gray-500">No items selected</div>
        ) : (
          <>
            {/* Selected Items List */}
            <div className="space-y-4 mb-6 max-h-86 overflow-y-auto">
              {Object.entries(
                selectedItems.reduce((acc, item) => {
                  if (!acc[item.category]) {
                    acc[item.category] = [];
                  }
                  acc[item.category].push(item);
                  return acc;
                }, {})
              ).map(([category, items]) => (
                <div key={category} className="mb-4">
                  <h3 className="text-lg font-bold mb-2 pb-2 border-b">
                    {menuCategories[menuType].find((cat) => cat.id === category)
                      ?.name || category}
                  </h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
                      >
                        <div>
                          <span className="font-semibold">{item.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600 mr-2">
                            × {item.quantity}
                          </span>
                          <span className="font-semibold">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Details */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>₹ 500</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              className="w-full bg-green-500 text-white py-3 rounded-lg mt-6 hover:bg-green-600 transition-colors"
              disabled={selectedItems.length === 0}
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DeliveryMenu;
