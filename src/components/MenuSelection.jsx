import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  Minus,
  ShoppingCart,
  CreditCard,
  AlertTriangle,
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

    // Use menuPreference instead of showVegOnly
    const basePrice =
      menuPreference === "veg"
        ? parseFloat(matchingPrice.veg_price)
        : parseFloat(matchingPrice.nonveg_price);

    const extraItemsPrice = selectedItems
      .filter((item) => item.isExtra)
      .reduce((sum, item) => sum + parseFloat(item.price || 0), 0);

    const totalPlatePrice = basePrice + extraItemsPrice;

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
      const matchesPreference =
        menuPreference === "nonveg" ? true : item.is_veg === "1";

      return matchesEvent && matchesMenu && matchesPreference;
    });
  };

  const getSortedCategories = () => {
    const filteredItems = getFilteredItems();
    const uniqueCategories = [
      ...new Set(filteredItems.map((item) => item.category_name)),
    ];

    return uniqueCategories.sort((a, b) => {
      const categoryA = categoryData.find((cat) => cat.category_name === a);
      const categoryB = categoryData.find((cat) => cat.category_name === b);
      const posA = categoryA ? parseInt(categoryA.position) || 0 : 0;
      const posB = categoryB ? parseInt(categoryB.position) || 0 : 0;
      return posA - posB;
    });
  };

  const getCategoryLimit = (categoryName) => {
    if (categoryName.toLowerCase() === "common items") return 0;
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
      if (category.toLowerCase() === "common items") return false;
      const limit = getCategoryLimit(category);
      const selectedCount = getItemsInCategory(category).length;
      return selectedCount < limit;
    });

    if (incompleteCategories.length > 0) {
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

  const handleProceedToPay = () => {
    const extraItems = selectedItems.filter((item) => item.isExtra);
    const platePrice = calculatePlatePrice();

    navigate(`/events/${eventType}/${serviceType}/Menu/${menuType}/order`, {
      state: {
        selectedItems,
        extraItems,
        platePrice,
        guestCount,
        totalAmount: calculateTotal(),
      },
    });
  };

  const handleItemSelectWithConfirmation = (item) => {
    const categoryItems = getItemsInCategory(item.category_name);
    const limit = getCategoryLimit(item.category_name);

    if (selectedItems.some((selected) => selected.id === item.id)) {
      handleItemSelect(item);
      return;
    }

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
    if (item.category_name.toLowerCase() === "common items") {
      return;
    }

    const categoryLimit = getCategoryLimit(item.category_name);

    if (selectedItems.some((selected) => selected.id === item.id)) {
      // Remove the item
      const updatedItems = selectedItems.filter(
        (selected) => selected.id !== item.id
      );

      // Recalculate isExtra status for remaining items in the same category
      const finalItems = updatedItems.map((selectedItem) => {
        if (selectedItem.category_name === item.category_name) {
          // Get all items in this category after removal
          const categoryItems = updatedItems.filter(
            (i) => i.category_name === item.category_name
          );
          // Update isExtra based on current position in category
          const itemIndex = categoryItems.findIndex(
            (i) => i.id === selectedItem.id
          );
          return {
            ...selectedItem,
            isExtra: itemIndex >= categoryLimit,
          };
        }
        return selectedItem;
      });

      setSelectedItems(finalItems);
    } else {
      // Adding a new item
      const categoryItems = getItemsInCategory(item.category_name);
      const newItem = {
        ...item,
        isExtra: categoryItems.length >= categoryLimit && categoryLimit > 0,
      };
      setSelectedItems([...selectedItems, newItem]);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading menu...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-aliceBlue grid grid-cols-3 gap-1">
      <div className="max-w-full mx-auto p-6 lg:col-span-2 ">
        {/* Header */}
        <div className="max-w-full bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
              <h1 className="text-3xl font-bold text-gray-800">
                {menuType
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </h1>
              <span className="text-gray-600">Base Price:</span>
              <span className="text-2xl font-bold text-blue-600">
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
          <div className="lg:col-span-2 space-y-6 ">
            {getSortedCategories().map((category) => {
              const limit = getCategoryLimit(category);
              const selectedCount = getItemsInCategory(category).length;
              const isCommonItems = category.toLowerCase() === "common items";

              return (
                <div
                  key={category}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="p-4 border-b  bg-gray-50 ">
                    <div className="flex  justify-between items-center">
                      <h2 className="text-xl font-bold text-gray-800">
                        {category} {!isCommonItems && `(ANY ${limit})`}
                      </h2>
                      {!isCommonItems && (
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold ${
                            selectedCount >= limit
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {selectedCount}/{limit} selected
                        </span>
                      )}
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
                                    ? "bg-blue-500 border-blue-500"
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
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
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
              onClick={() => handleActionButton("cart")}
              className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>

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
