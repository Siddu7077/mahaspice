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
  const [guestCount, setGuestCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuPreference, setMenuPreference] = useState("veg");
  const [showAlert, setShowAlert] = useState(null);
  const [pricingData, setPricingData] = useState(null);
  const [inputValue, setInputValue] = useState(guestCount.toString());
  const currentEventType = eventType.toLowerCase(); // "wedding-catering"
  const currentServiceType = serviceType.toLowerCase(); // "haldi-ceremony"
  const currentMenuType = menuType.replace(/-/g, " "); // "Silver Menu"
  const [showLiveCounterAlert, setShowLiveCounterAlert] = useState(false);

  const slideInAnimation = {
    animation: "slideIn 0.5s ease-out",
  };

  useEffect(() => {
    console.log("Component mounted. Showing Live Counter Alert."); // Debugging log
    setShowLiveCounterAlert(true);
  }, []);

  useEffect(() => {
    const hasLiveCounter = menuData.some(
      (item) => item.category_name.toLowerCase() === "live counter"
    );

    if (hasLiveCounter && !showLiveCounterAlert) {
      setShowLiveCounterAlert(true);
      const timer = setTimeout(() => {
        setShowLiveCounterAlert(false);
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [menuData]);

  useEffect(() => {
    let timeoutId;
    if (showLiveCounterAlert) {
      console.log("Setting timeout to hide Live Counter Alert"); // Debugging log
      timeoutId = setTimeout(() => {
        console.log("Hiding Live Counter Alert"); // Debugging log
        setShowLiveCounterAlert(false);
      }, 10000);
    }
    return () => clearTimeout(timeoutId);
  }, [showLiveCounterAlert]);

  const getSortedCategories = () => {
    const filteredItems = getFilteredItems();
    const uniqueCategories = [
      ...new Set(filteredItems.map((item) => item.category_name)),
    ];

    return uniqueCategories.sort((a, b) => {
      // Always put Live Counter at the end
      if (a.toLowerCase() === "live counter") return -1;
      if (b.toLowerCase() === "live counter") return 1;

      const categoryA = categoryData.find((cat) => cat.category_name === a);
      const categoryB = categoryData.find((cat) => cat.category_name === b);
      const posA = categoryA ? parseInt(categoryA.position) || 0 : 0;
      const posB = categoryB ? parseInt(categoryB.position) || 0 : 0;
      return posA - posB;
    });
  };

  const handleProceedToPay = () => {
    const filteredItems = selectedItems.filter(
      (item) => item.category_name.toLowerCase() !== "live counter"
    );
    const extraItems = filteredItems.filter((item) => item.isExtra);
    const platePrice = calculatePlatePrice();

    navigate(`/events/${eventType}/${serviceType}/Menu/${menuType}/order`, {
      state: {
        selectedItems: filteredItems,
        extraItems,
        platePrice,
        guestCount,
        totalAmount: calculateTotal(),
      },
    });
  };

  const handleMenuPreferenceChange = (preference) => {
    setMenuPreference(preference);
    setSelectedItems([]);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setInputValue(value);
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue >= 10) {
        setGuestCount(numValue);
      }
    }
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue);
    if (isNaN(numValue) || numValue < 10) {
      setInputValue("10");
      setGuestCount(10);
    }
  };

  useEffect(() => {
    setInputValue(guestCount.toString());
  }, [guestCount]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [menuResponse, categoryResponse, pricingResponse] =
          await Promise.all([
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
        // console.log("Menu Data:", menuJson.data);
        // console.log("Category Data:", categoryJson);
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

    const basePrice =
      menuPreference === "veg"
        ? parseFloat(matchingPrice.veg_price)
        : parseFloat(matchingPrice.nonveg_price);

    // Calculate extra items cost (excluding Live Counter items)
    const regularExtraItemsPrice = selectedItems
      .filter(
        (item) =>
          item.isExtra && item.category_name.toLowerCase() !== "live counter"
      )
      .reduce((sum, item) => sum + parseFloat(item.price || 0), 0);

    // Calculate Live Counter items cost separately
    const liveCounterItemsPrice = selectedItems
      .filter((item) => item.category_name.toLowerCase() === "live counter")
      .reduce((sum, item) => sum + parseFloat(item.price || 0), 0);

    const totalPlatePrice =
      basePrice + regularExtraItemsPrice + liveCounterItemsPrice;

    let discountAmount = 0;

    if (guestCount <= 50) {
      const tiers = Math.floor(guestCount / 10);
      discountAmount = tiers * 1;
    } else if (guestCount <= 150) {
      discountAmount = 5 * 2;
      const additionalTiers = Math.floor((guestCount - 50) / 10);
      discountAmount += additionalTiers * 1;
    } else if (guestCount < 250) {
      discountAmount = 5 * 2;
      discountAmount += 10 * 1;
      const remainingTiers = Math.floor((guestCount - 150) / 50);
      discountAmount += remainingTiers * 1;
    } else {
      discountAmount = 5 * 2 + 10 * 1 + 2 * 1;
    }

    return Math.max(totalPlatePrice - discountAmount, 0);
  };

  const calculateTotal = () => {
    const platePrice = calculatePlatePrice();
    const baseCost = platePrice * guestCount;
    const deliveryCharge = 500;
    return baseCost + deliveryCharge;
  };

  const getFilteredItems = () => {
    return menuData.filter((item) => {
      // Normalize the strings for comparison by converting to lowercase and replacing spaces/hyphens
      const normalizeString = (str) =>
        str
          .toLowerCase()
          .replace(/[-\s]+/g, " ")
          .trim();

      // Get event categories and names from the item
      const itemEventCategories = (item.event_categories || "")
        .split(",")
        .map(normalizeString);

      const itemEventNames = (item.event_names || "")
        .split(",")
        .map(normalizeString);

      // Normalize the current types
      const normalizedEventType = normalizeString(eventType);
      const normalizedServiceType = normalizeString(serviceType);
      const normalizedMenuType = normalizeString(menuType);
      const normalizedItemMenuType = normalizeString(item.menu_type);

      // Check if the item matches any of the event categories or names
      const matchesEvent =
        itemEventCategories.some(
          (cat) => normalizeString(cat) === normalizedServiceType
        ) ||
        itemEventNames.some(
          (name) => normalizeString(name) === normalizedEventType
        );

      // Check if menu type matches
      const matchesMenu = normalizedItemMenuType === normalizedMenuType;

      // Check if the item matches the veg/non-veg preference
      const matchesPreference =
        menuPreference === "nonveg" ? true : item.is_veg === "1";

      return matchesEvent && matchesMenu && matchesPreference;
    });
  };
  useEffect(() => {
    // console.log("Event Type:", eventType);
    // console.log("Service Type:", serviceType);
    // console.log("Menu Type:", menuType);
    // console.log("Filtered Items:", getFilteredItems());
  }, [menuData, eventType, serviceType, menuType]);

  const getCategoryLimit = (categoryName) => {
    if (
      categoryName.toLowerCase() === "common items" ||
      categoryName.toLowerCase() === "live counter"
    ) {
      return 0; // No limit for optional categories
    }
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

  const handleActionButton = (action) => {
    const incompleteCategories = getSortedCategories().filter((category) => {
      // Exclude "Live Counter" and "Common Items" from validation
      if (
        category.toLowerCase() === "common items" ||
        category.toLowerCase() === "live counter"
      ) {
        return false;
      }

      const limit = getCategoryLimit(category);
      const selectedCount = getItemsInCategory(category).length;
      return selectedCount < limit;
    });

    if (incompleteCategories.length > 0) {
      console.log("Incomplete categories:", incompleteCategories); // Debugging log
      setShowAlert({
        message: `Please select required items from: ${incompleteCategories.join(
          ", "
        )}`,
      });
      return;
    }

    if (action === "pay") {
      handleProceedToPay();
    }
  };

  // const handleProceedToPay = () => {
  //   const extraItems = selectedItems.filter((item) => item.isExtra);
  //   const platePrice = calculatePlatePrice();

  //   navigate(`/events/${eventType}/${serviceType}/Menu/${menuType}/order`, {
  //     state: {
  //       selectedItems,
  //       extraItems,
  //       platePrice,
  //       guestCount,
  //       totalAmount: calculateTotal(),
  //     },
  //   });
  // };

  const handleItemSelectWithConfirmation = (item) => {
    const isLiveCounter = item.category_name.toLowerCase() === "live counter";
    const categoryItems = getItemsInCategory(item.category_name);
    const limit = getCategoryLimit(item.category_name);

    // If item is already selected, handle removal
    if (selectedItems.some((selected) => selected.id === item.id)) {
      handleItemSelect(item);
      return;
    }

    // Special handling for Live Counter items
    if (isLiveCounter) {
      setShowAlert({
        message: `Adding "${item.item_name}" will cost extra ₹${item.price} per plate.`,
        isConfirmation: true,
        onConfirm: () => {
          handleItemSelect({
            ...item,
            isExtra: true, // Force Live Counter items to always be extra
          });
          setShowAlert(null);
        },
      });
      return;
    }

    // Handle regular items that exceed category limit
    if (categoryItems.length >= limit && limit > 0) {
      setShowAlert({
        message: `You've reached the limit of ${limit} items for ${item.category_name}. Adding this item will cost extra ₹${item.price}.`,
        isConfirmation: true,
        onConfirm: () => {
          handleItemSelect(item);
          setShowAlert(null);
        },
      });
    } else {
      handleItemSelect(item);
    }
  };

  const handleItemSelect = (item) => {
    const isLiveCounter = item.category_name.toLowerCase() === "live counter";

    if (item.category_name.toLowerCase() === "common items") {
      return;
    }

    if (selectedItems.some((selected) => selected.id === item.id)) {
      // Remove the item
      const updatedItems = selectedItems.filter(
        (selected) => selected.id !== item.id
      );

      // Recalculate isExtra status for remaining items in the same category
      const finalItems = updatedItems.map((selectedItem) => {
        if (
          selectedItem.category_name === item.category_name &&
          !isLiveCounter
        ) {
          const categoryItems = updatedItems.filter(
            (i) => i.category_name === item.category_name
          );
          const itemIndex = categoryItems.findIndex(
            (i) => i.id === selectedItem.id
          );
          return {
            ...selectedItem,
            isExtra: itemIndex >= getCategoryLimit(item.category_name),
          };
        }
        return selectedItem;
      });

      setSelectedItems(finalItems);
    } else {
      // Adding a new item
      const newItem = {
        ...item,
        isExtra: isLiveCounter
          ? true
          : getItemsInCategory(item.category_name).length >=
            getCategoryLimit(item.category_name),
      };
      setSelectedItems([...selectedItems, newItem]);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading menu...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-aliceBlue grid grid-cols-3 gap-1">
      {/* Live Counter Alert */}
      {showLiveCounterAlert && (
        <>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="max-w-lg w-full bg-white border border-green-300 rounded-2xl p-6 shadow-2xl transform transition-all duration-500 ease-in-out scale-100 animate-zoom">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-10 rounded-full flex items-center justify-center">
                    <span className="text-white">🌟</span>
                  </div>
                  <p className="text-black-900 font-semibold text-lg">
                    We also provide{" "}
                    <span className="text-green-600">Live Counter</span>{" "}
                    options! Feel free to explore and enhance your event
                    experience.
                  </p>
                </div>
                <button
                  onClick={() => setShowLiveCounterAlert(false)}
                  className="text-black-900 hover:text-black-700 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* Add the keyframes animation using a style element with proper React syntax */}
          <style>{`
  @keyframes zoomInOut {
    0% { transform: scale(0.8); opacity: 0; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); }
  }
  .animate-zoom {
    animation: zoomInOut 0.5s ease-in-out;
  }
`}</style>
        </>
      )}

      <div className="max-w-full mx-auto p-6 lg:col-span-2 ">
        {/* Header */}
        <div className="max-w-full bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
              <h1 className="text-3xl font-bold text-gray-800">
                {menuType
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </h1>
              <span className="text-gray-600">Base Price:</span>
              <span className="text-2xl font-bold text-green-600">
                ₹{calculatePlatePrice()}
              </span>
              <span className="text-gray-600">per plate</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleMenuPreferenceChange("veg")}
                className={`px-4 py-2 rounded-lg ${
                  menuPreference === "veg"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Veg
              </button>
              <button
                onClick={() => handleMenuPreferenceChange("nonveg")}
                className={`px-4 py-2 rounded-lg ${
                  menuPreference === "nonveg"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Non-Veg
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Menu Categories */}
          <div className="lg:col-span-2 space-y-6">
            {getSortedCategories().map((category) => {
              const limit = getCategoryLimit(category);
              const selectedCount = getItemsInCategory(category).length;
              const isCommonItems = category.toLowerCase() === "common items";
              const isLiveCounter = category.toLowerCase() === "live counter";

              return (
                <div
                  key={category}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                    isLiveCounter ? "border-2 border-green-500" : ""
                  }`}
                >
                  <div
                    className={`p-4 border-b ${
                      isLiveCounter ? "bg-green-50" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h2
                        className={`text-xl font-bold ${
                          isLiveCounter ? "text-black" : "text-gray-800"
                        }`}
                      >
                        {category} {!isCommonItems && !isLiveCounter && `(ANY ${limit})`}
                        {isLiveCounter && (
                          <span className="ml-2 text-sm font-normal text-black animate-pulse">
                            ✨ Special Addition (Optional)
                          </span>
                        )}
                      </h2>
                    </div>
                  </div>

                  <div className="p-4 min-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getFilteredItems()
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
                                checked={
                                  isCommonItems ||
                                  selectedItems.some(
                                    (selected) => selected.id === item.id
                                  )
                                }
                                onChange={() =>
                                  isCommonItems
                                    ? null
                                    : handleItemSelectWithConfirmation(item)
                                }
                                disabled={isCommonItems}
                                className="hidden"
                              />
                              <div
                                className={`w-5 h-5 border-2 rounded transition-colors ${
                                  isCommonItems ||
                                  selectedItems.some(
                                    (selected) => selected.id === item.id
                                  )
                                    ? "bg-green-500 border-green-500"
                                    : "border-gray-300"
                                }`}
                              >
                                {(isCommonItems ||
                                  selectedItems.some(
                                    (selected) => selected.id === item.id
                                  )) && (
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
                            className={`flex items-center justify-center w-6 h-6 rounded ${
                              item.is_veg === "1"
                                ? "border-2 border-green-500"
                                : "border-2 border-red-500"
                            }`}
                          >
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                item.is_veg === "1"
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
        </div>

        {/* Alert Dialog */}
        {showAlert && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-orange-500" size={24} />
                <h3 className="text-lg font-bold">
                  {showAlert.isConfirmation
                    ? "Confirmation Required"
                    : "Missing Items"}
                </h3>
              </div>

              <p className="text-gray-600 mb-6">{showAlert.message}</p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowAlert(null)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  {showAlert.isConfirmation ? "Cancel" : "OK"}
                </button>
                {showAlert.isConfirmation && (
                  <button
                    onClick={showAlert.onConfirm}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                  >
                    Add Anyway
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="lg:sticky lg:top-6 lg:col-span-1 mt-5 mr-5">
        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Your Selection
          </h2>

          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Guests:</span>
            <button
              onClick={() => setGuestCount(Math.max(10, guestCount - 5))}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
            >
              <Minus size={16} />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="w-16 text-center font-bold bg-white border rounded-md py-1 px-2 focus:outline-none"
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
            <h3 className="font-bold">Selected Items</h3>
            {Object.entries(
              selectedItems.reduce((acc, item) => {
                if (!acc[item.category_name]) acc[item.category_name] = [];
                acc[item.category_name].push(item);
                return acc;
              }, {})
            )
              .reverse()
              .map(([category, items]) => (
                <div key={category} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-gray-700 mb-2">{category}</h3>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="flex justify-between items-center"
                      >
                        <span className="text-gray-600">{item.item_name}</span>
                        {item.isExtra && (
                          <span className="text-orange-600 font-bold">
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
                <span>₹{(calculatePlatePrice() * guestCount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Extra Items Per Plate</span>
                <span>
                  ₹
                  {selectedItems
                    .filter((item) => item.isExtra)
                    .reduce((sum, item) => sum + parseFloat(item.price || 0), 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge</span>
                <span>₹500</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2 border-t">
                <span>Total</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleActionButton("pay")}
              className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white transition-colors"
            >
              <CreditCard size={20} />
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuSelection;
