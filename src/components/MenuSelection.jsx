import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  Minus,
  ShoppingCart,
  CreditCard,
  AlertTriangle,
  X,
} from "lucide-react";

const MenuSelection = () => {
  const navigate = useNavigate();
  const { eventType, serviceType, menuType } = useParams();
  const [menuData, setMenuData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [guestCount, setGuestCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVegOnly, setShowVegOnly] = useState(false);
  const [eventPricing, setEventPricing] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(null);
  const [pricingData, setPricingData] = useState(null);
  const [inputValue, setInputValue] = useState(guestCount.toString());
  const handleInputChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and empty string
    if (value === '' || /^\d+$/.test(value)) {
      setInputValue(value);
      // Update guestCount only if value is valid and within range
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue >= 5) {
        setGuestCount(numValue);
      }
    }
  };

  const handleInputBlur = () => {
    // If empty or less than 5, reset to 5
    const numValue = parseInt(inputValue);
    if (isNaN(numValue) || numValue < 5) {
      setInputValue('5');
      setGuestCount(5);
    }
  };

  // Update input value when buttons are clicked
  useEffect(() => {
    setInputValue(guestCount.toString());
  }, [guestCount]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [menuResponse, categoryResponse, pricingResponse] = await Promise.all([
          fetch("https://mahaspice.desoftimp.com/ms3/menu_display.php"),
          fetch("https://mahaspice.desoftimp.com/ms3/getcategory.php"),
          fetch("https://mahaspice.desoftimp.com/ms3/get_pricing.php"),
        ]);

        const menuJson = await menuResponse.json();
        const categoryJson = await categoryResponse.json();
        const pricingJson = await pricingResponse.json();

        if (menuJson.success && Array.isArray(menuJson.data)) {
          setMenuData(menuJson.data);
        }
        if (Array.isArray(categoryJson)) {
          // Sort categories by position before setting state
          const sortedCategories = categoryJson.sort((a, b) => {
            const posA = parseInt(a.position) || 0;
            const posB = parseInt(b.position) || 0;
            return posA - posB;
          });
          setCategoryData(sortedCategories);
        }
        if (pricingJson.success && Array.isArray(pricingJson.data)) {
          setPricingData(pricingJson.data);
        }
        setError(null);
      } catch (err) {
        setError("Failed to load menu data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventType]);

  const getFilteredItems = () => {
    return menuData.filter((item) => {
      const itemEventCategories = item.event_categories
        .split(",")
        .map((cat) => cat.trim().toLowerCase());
      const itemEventNames = item.event_names
        .split(",")
        .map((name) => name.trim().toLowerCase());
      const currentEventType = eventType.toLowerCase();
      const currentServiceType = serviceType.toLowerCase();
      const currentMenuType = menuType.replace(/-/g, " ");

      const matchesEvent =
        itemEventCategories.some(
          (cat) => cat === currentEventType || cat === currentServiceType
        ) ||
        itemEventNames.some(
          (name) =>
            name.toLowerCase() === currentEventType ||
            name.toLowerCase() === currentServiceType
        );
      const matchesMenu = item.menu_type === currentMenuType;
      const matchesVegFilter = !showVegOnly || item.is_veg === "1";

      return matchesEvent && matchesMenu && matchesVegFilter;
    });
  };

  // Modified to return sorted categories
  const getSortedCategories = () => {
    const filteredItems = getFilteredItems();
    const uniqueCategories = [...new Set(filteredItems.map((item) => item.category_name))];

    return uniqueCategories.sort((a, b) => {
      const categoryA = categoryData.find(cat => cat.category_name === a);
      const categoryB = categoryData.find(cat => cat.category_name === b);
      const posA = categoryA ? parseInt(categoryA.position) || 0 : 0;
      const posB = categoryB ? parseInt(categoryB.position) || 0 : 0;
      return posA - posB;
    });
  };

  const getCategoryLimit = (categoryName) => {
    const category = categoryData.find(
      (cat) =>
        cat.category_name === categoryName &&
        cat.menu_type === menuType.replace(/-/g, " ")
    );
    return category ? parseInt(category.category_limit) : 0;
  };

  const getItemsInCategory = (categoryName) => {
    return selectedItems.filter((item) => item.category_name === categoryName);
  };

  const handleProceedToPay = () => {
    const extraItems = selectedItems.filter(item => item.isExtra);
    const platePrice = calculatePlatePrice();

    navigate(`/events/${eventType}/${serviceType}/Menu/${menuType}/order`, {
      state: {
        selectedItems,
        extraItems,
        platePrice,
        guestCount,
        totalAmount: calculateTotal()
      }
    });
  };

  const handleItemSelect = (item) => {
    const categoryItems = getItemsInCategory(item.category_name);
    const limit = getCategoryLimit(item.category_name);

    // If item is already selected, remove it and reorder remaining items
    if (selectedItems.some((selected) => selected.id === item.id)) {
      const newSelectedItems = selectedItems.filter(
        (selected) => selected.id !== item.id
      );

      // Reorder remaining items in the category
      const remainingCategoryItems = newSelectedItems.filter(
        (selected) => selected.category_name === item.category_name
      );

      // Update isExtra flag based on new order
      const reorderedItems = newSelectedItems.map((selected) => {
        if (selected.category_name === item.category_name) {
          const itemIndex = remainingCategoryItems.findIndex(
            (i) => i.id === selected.id
          );
          return {
            ...selected,
            isExtra: itemIndex >= limit,
          };
        }
        return selected;
      });

      setSelectedItems(reorderedItems);
      return;
    }



    // Add new item
    const newItem = {
      ...item,
      isExtra: categoryItems.length >= limit,
    };
    setSelectedItems([...selectedItems, newItem]);
  };

  const calculatePlatePrice = () => {
    if (!pricingData || !serviceType || !menuType) {
      return 0;
    }

    const formattedMenuType = menuType.replace(/-/g, " ");
    const matchingPrice = pricingData.find(
      (price) => price.gscd?.toLowerCase() === formattedMenuType.toLowerCase()
    );

    if (!matchingPrice) {
      return 0;
    }

    // Get base price based on veg/non-veg selection
    const basePrice = showVegOnly
      ? parseFloat(matchingPrice.veg_price)
      : parseFloat(matchingPrice.nonveg_price);

    // Add extra item prices
    const extraItemsPrice = selectedItems
      .filter((item) => item.isExtra)
      .reduce((sum, item) => sum + parseFloat(item.price || 0), 0);

    const totalPlatePrice = basePrice + extraItemsPrice;

    // Calculate tiered discounts based on guest count
    let discountAmount = 0;

    if (guestCount <= 50) {
      // First 50 guests: -₹2 per 10 guests
      const tiers = Math.floor(guestCount / 10);
      discountAmount = tiers * 2;
    } else if (guestCount <= 150) {
      // First 50 guests discount
      discountAmount = (5 * 2); // 5 tiers of ₹2

      // Next 100 guests (51-150): -₹1 per 10 guests
      const additionalTiers = Math.floor((guestCount - 50) / 10);
      discountAmount += additionalTiers * 1;
    } else if (guestCount < 250) {
      // First 50 guests discount
      discountAmount = (5 * 2); // 5 tiers of ₹2

      // Next 100 guests discount (51-150)
      discountAmount += (10 * 1); // 10 tiers of ₹1

      // Remaining guests up to 250: -₹1 per 50 guests
      const remainingTiers = Math.floor((guestCount - 150) / 50);
      discountAmount += remainingTiers * 1;
    } else {
      // Maximum discount at 250+ guests
      discountAmount = (5 * 2) + // First 50 guests (5 tiers of ₹2)
        (10 * 1) + // Next 100 guests (10 tiers of ₹1)
        (2 * 1);   // Final 100 guests (2 tiers of ₹1 for 50 guests each)
    }

    return Math.max(totalPlatePrice - discountAmount, 0);
  };

  const calculateTotal = () => {
    const platePrice = calculatePlatePrice();
    const baseCost = platePrice * guestCount;
    const deliveryCharge = 0;
    return baseCost + deliveryCharge;
  };

  if (loading) return <div className="p-8 text-center">Loading menu...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  const areAllCategoriesComplete = () => {
    // Get filtered items based on current filters
    const filteredItems = getFilteredItems();

    // Get unique categories from filtered items
    const categories = [...new Set(filteredItems.map(item => item.category_name))];

    // Check if each category meets its minimum requirement
    return categories.every(category => {
      const limit = getCategoryLimit(category);
      const selectedCount = getItemsInCategory(category).length;
      return selectedCount >= limit;
    });
  };
  const filteredItems = getFilteredItems();
  const categories = [
    ...new Set(filteredItems.map((item) => item.category_name)),
  ];

  const handleItemSelectWithConfirmation = (item) => {
    const categoryItems = getItemsInCategory(item.category_name);
    const limit = getCategoryLimit(item.category_name);

    // If item is already selected, remove it
    if (selectedItems.some((selected) => selected.id === item.id)) {
      setSelectedItems(
        selectedItems.filter((selected) => selected.id !== item.id)
      );
      return;
    }

    // If exceeding limit, show confirmation
    if (categoryItems.length >= limit) {
      setShowConfirmation({
        item,
        message: `You've reached the limit of ${limit} items for ${item.category_name}. Adding this item will cost extra ₹${item.price}.`,
      });
    } else {
      handleItemSelect(item);
    }
  };

  const sortedCategories = getSortedCategories();

  return (
    <div className="min-h-screen bg-aliceBlue">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {eventType
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </h1>

          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-gray-600">Base Price:</span>
              <span className="text-2xl font-bold text-blue-600">
                ₹{calculatePlatePrice()}
              </span>
              <span className="text-gray-600">per plate</span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showVegOnly}
                  onChange={() => setShowVegOnly(!showVegOnly)}
                  className="sr-only"
                />
                <div
                  className={`w-14 h-7 rounded-full transition-colors ${showVegOnly ? "bg-green-500" : "bg-gray-300"
                    }`}
                >
                  <div
                    className={`absolute w-5 h-5 rounded-full bg-white top-1 transition-all ${showVegOnly ? "right-1" : "left-1"
                      }`}
                  />
                </div>
              </div>
              <span className="text-gray-700">Veg Only</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Menu Categories */}
          <div className="lg:col-span-2 space-y-6">
            {sortedCategories.map((category) => {
              const limit = getCategoryLimit(category);
              const selectedCount = getItemsInCategory(category).length;
              return (
                <div
                  key={category}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="p-4 border-b bg-gray-50">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold text-gray-800">
                        {category}
                      </h2>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${selectedCount >= limit
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                            }`}
                        >
                          {selectedCount}/{limit} selected
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredItems
                      .filter((item) => item.category_name === category)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <label className="flex items-center flex-1 cursor-pointer">
                            <div className="relative w-5 h-5 mr-3">
                              <input
                                type="checkbox"
                                checked={selectedItems.some(
                                  (selected) => selected.id === item.id
                                )}
                                onChange={() =>
                                  handleItemSelectWithConfirmation(item)
                                }
                                className="hidden"
                              />
                              <div
                                className={`w-5 h-5 border-2 rounded transition-colors ${selectedItems.some(
                                  (selected) => selected.id === item.id
                                )
                                  ? "bg-blue-500 border-blue-500"
                                  : "border-gray-300"
                                  }`}
                              >
                                {selectedItems.some(
                                  (selected) => selected.id === item.id
                                ) && (
                                    <svg
                                      className="w-full h-full text-white"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        d="M5 13l5 5L20 7"
                                      />
                                    </svg>
                                  )}
                              </div>
                            </div>
                            <span className="flex-1">{item.item_name}</span>
                          </label>

                          <span
                            className={`flex items-center justify-center w-6 h-6 rounded ${item.is_veg === "1"
                              ? "border-2 border-green-500"
                              : "border-2 border-red-500"
                              }`}
                          >
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${item.is_veg === "1"
                                ? "bg-green-500"
                                : "bg-red-500"
                                }`}
                            ></span>
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selection Summary */}
          <div className="lg:sticky lg:top-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Your Selection
              </h2>

              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Guests:</span>
                <button
                  onClick={() => setGuestCount(Math.max(5, guestCount - 5))}
                  className="p-2 rounded hover:bg-gray-200 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className="w-16 text-center font-bold bg-white border rounded-md py-1 px-2 focus:outline-none "
                  maxLength={4}
                />
                <button
                  onClick={() => setGuestCount(guestCount + 5)}
                  className="p-2 rounded hover:bg-gray-200 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {Object.entries(
                  selectedItems.reduce((acc, item) => {
                    if (!acc[item.category_name]) acc[item.category_name] = [];
                    acc[item.category_name].push(item);
                    return acc;
                  }, {})
                ).map(([category, items]) => (
                  <div key={category} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-2">
                      {category}
                    </h3>
                    <ul className="space-y-2">
                      {items.map((item, index) => (
                        <li
                          key={`${item.id}-${index}`}
                          className="flex justify-between items-center"
                        >
                          <span className="text-gray-600">
                            {item.item_name}
                          </span>
                          {item.isExtra && (
                            <span className="text-orange-600 font-medium">
                              +₹{item.price}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>
                      Plate Cost (₹{calculatePlatePrice()} × {guestCount})
                    </span>
                    <span>
                      ₹{(calculatePlatePrice() * guestCount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Extra Items Per Plate</span>
                    <span>
                      ₹
                      {selectedItems
                        .filter((item) => item.isExtra)
                        .reduce((sum, item) => sum + parseFloat(item.price), 0)}
                    </span>
                  </div>
                  {/* <div className="flex justify-between text-gray-600">
                    <span>Delivery Charge</span>
                    <span>₹500</span>
                  </div> */}
                  <div className="flex justify-between text-xl font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2
            ${!areAllCategoriesComplete()
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                    } 
            transition-colors`}
                  disabled={!areAllCategoriesComplete()}
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>

                <button
                  className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2
            ${!areAllCategoriesComplete()
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                    } 
            transition-colors`}
                  disabled={!areAllCategoriesComplete()}
                  onClick={handleProceedToPay}
                >
                  <CreditCard size={20} />
                  Proceed to Pay
                </button>

                {!areAllCategoriesComplete() && (
                  <div className="mt-2">
                    {/* <div className="flex items-center gap-2 text-orange-600 text-sm">
                      <AlertTriangle size={16} />
                      <span>Please select the required number of items from each category</span>
                    </div> 
                    <div className="mt-2 space-y-1">
                      {[...new Set(getFilteredItems().map(item => item.category_name))].map(category => {
                        const limit = getCategoryLimit(category);
                        const selectedCount = getItemsInCategory(category).length;
                        if (selectedCount < limit) {
                          return (
                            <div key={category} className="text-sm text-gray-600">
                              • {category}: Need {limit - selectedCount} more item(s)
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-orange-500" size={24} />
                <h3 className="text-lg font-bold">Extra Item Confirmation</h3>
              </div>

              <p className="text-gray-600 mb-6">{showConfirmation.message}</p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmation(null)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleItemSelect(showConfirmation.item);
                    setShowConfirmation(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Add Anyway
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuSelection;

// http://localhost:5173/events/event-caterers/birthdays/Menu
