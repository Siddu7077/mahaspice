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
import { useAuth } from "./AuthSystem";

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
  const { user } = useAuth();
  const [previouslySelectedItems, setPreviouslySelectedItems] = useState({});
  const [notifications, setNotifications] = useState({});
  const [commonItems, setCommonItems] = useState([]);
  const [discountRules, setDiscountRules] = useState([]);

  const fetchDiscountRules = async () => {
    try {
      const response = await fetch(
        "https://adminmahaspice.in/ms3/fetch_discount_rules.php"
      );
      const data = await response.json();
      setDiscountRules(data);
    } catch (error) {
      console.error("Error fetching discount rules:", error);
    }
  };

  useEffect(() => {
    fetchDiscountRules();
  }, []);

  // Show Live Counter Alert only for Silver Menu
  useEffect(() => {
    if (currentMenuType.toLowerCase() === "silver menu") {
      setShowLiveCounterAlert(true);
    }
  }, [currentMenuType]);

  // Rest of the code remains the same...

  // Modify the guest count increment to +1
  const handleGuestCountIncrement = () => {
    setGuestCount((prevCount) => prevCount + 1);
  };

  // Modify the guest count decrement to -1
  const handleGuestCountDecrement = () => {
    setGuestCount((prevCount) => Math.max(10, prevCount - 1));
  };

  // Update the guest count input field
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

  useEffect(() => {
    fetchDiscountRules();
  }, []);

  const getCommonItems = () => {
    return getFilteredItems().filter(
      (item) => item.category_name.toLowerCase() === "common items"
    );
  };

  useEffect(() => {
    const items = getCommonItems();
    setCommonItems(items);
  }, [menuData]);

  useEffect(() => {
    const fetchPreviousSelections = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(
          `https://adminmahaspice.in/ms3/get-cart.php?user_id=${user.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch cart data");

        const data = await response.json();
        if (data.success && data.data) {
          const itemMap = {};
          data.data.forEach((cart) => {
            if (
              cart.event_name === serviceType &&
              cart.menu_type === menuType
            ) {
              cart.items.forEach((item) => {
                if (!itemMap[item.category_name]) {
                  itemMap[item.category_name] = [];
                }
                itemMap[item.category_name].push(item.item_name);
              });
            }
          });
          setPreviouslySelectedItems(itemMap);
        }
      } catch (error) {
        console.error("Error fetching previous selections:", error);
      }
    };

    fetchPreviousSelections();
  }, [user, serviceType, menuType]);

  const showTemporaryNotification = (categoryName, itemName) => {
    setNotifications((prev) => ({
      ...prev,
      [categoryName]: {
        message: `You've already selected ${itemName} in your previous cart. Consider trying a different variety!`,
        timestamp: Date.now(),
      },
    }));

    setTimeout(() => {
      setNotifications((prev) => {
        const newNotifications = { ...prev };
        delete newNotifications[categoryName];
        return newNotifications;
      });
    }, 4000);
  };

  useEffect(() => {
    // console.log("Component mounted. Showing Live Counter Alert.");
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
      // console.log("Setting timeout to hide Live Counter Alert");
      timeoutId = setTimeout(() => {
        // console.log("Hiding Live Counter Alert");
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
      // Move "Common Items" to the last position
      if (a.toLowerCase() === "common items") return 1;
      if (b.toLowerCase() === "common items") return -1;

      // Move "Live Counter" to the second last position (just above "Common Items")
      if (a.toLowerCase() === "live counter") return 1;
      if (b.toLowerCase() === "live counter") return -1;

      // For all other categories, sort by their position
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
        eventType,
        serviceType,
        menuType,
        menuPreference,
        totalAmount: calculateTotal(),
      },
    });
  };

  const handleMenuPreferenceChange = (preference) => {
    setMenuPreference(preference);
    setSelectedItems([]);
  };

  // const handleInputChange = (e) => {
  //   const value = e.target.value;
  //   if (value === "" || /^\d+$/.test(value)) {
  //     setInputValue(value);
  //     const numValue = parseInt(value);
  //     if (!isNaN(numValue) && numValue >= 10) {
  //       setGuestCount(numValue);
  //     }
  //   }
  // };

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
            fetch("https://adminmahaspice.in/ms3/menu_display.php"),
            fetch("https://adminmahaspice.in/ms3/getcategory.php"),
            fetch("https://adminmahaspice.in/ms3/get_pricing.php"),
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
          console.log(pricingJson.data);
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

    // Format the serviceType and menuType to match the API format
    const formattedServiceType = serviceType.replace(/-/g, " ");
    const formattedMenuType = menuType.replace(/-/g, " ");

    // Find the matching price in the pricingData
    const matchingPrice = pricingData.find(
      (price) =>
        price.event_category?.toLowerCase() ===
          formattedServiceType.toLowerCase() &&
        price.gscd?.toLowerCase() === formattedMenuType.toLowerCase()
    );

    if (!matchingPrice) {
      return 0;
    }

    const basePrice =
      menuPreference === "veg"
        ? parseFloat(matchingPrice.veg_price)
        : parseFloat(matchingPrice.nonveg_price);

    const regularExtraItemsPrice = selectedItems
      .filter(
        (item) =>
          item.isExtra && item.category_name.toLowerCase() !== "live counter"
      )
      .reduce((sum, item) => sum + parseFloat(item.price || 0), 0);

    const liveCounterItemsPrice = selectedItems
      .filter((item) => item.category_name.toLowerCase() === "live counter")
      .reduce((sum, item) => sum + parseFloat(item.price || 0), 0);

    const totalPlatePrice =
      basePrice + regularExtraItemsPrice + liveCounterItemsPrice;

    // Calculate discount based on fetched discount rules
    let discountAmount = 0;
    if (discountRules.length > 0) {
      // Sort discount rules by people_count in ascending order
      const sortedRules = discountRules.sort(
        (a, b) => a.people_count - b.people_count
      );

      // Find the applicable discount rule
      for (const rule of sortedRules) {
        if (guestCount >= parseInt(rule.people_count)) {
          discountAmount = parseFloat(rule.discount_amount);
        } else {
          break; // Stop when the guest count is less than the rule's people_count
        }
      }
    }

    return Math.max(totalPlatePrice - discountAmount, 0);
  };

  const calculateTotal = () => {
    const platePrice = calculatePlatePrice();
    const baseCost = platePrice * guestCount;
    return baseCost;
  };

  // Inside the MenuSelection component, replace the getFilteredItems function with this improved version:

  const getFilteredItems = () => {
    return menuData.filter((item) => {
      const normalizeString = (str) =>
        str
          .toLowerCase()
          .replace(/[-\s]+/g, " ")
          .trim();

      const itemEventCategories = (item.event_categories || "")
        .split(",")
        .map(normalizeString);

      const itemEventNames = (item.event_names || "")
        .split(",")
        .map(normalizeString);

      const normalizedEventType = normalizeString(eventType);
      const normalizedServiceType = normalizeString(serviceType);
      const normalizedMenuType = normalizeString(menuType);
      const normalizedItemMenuType = normalizeString(item.menu_type);

      const matchesEvent =
        itemEventCategories.some(
          (cat) => normalizeString(cat) === normalizedServiceType
        ) ||
        itemEventNames.some(
          (name) => normalizeString(name) === normalizedEventType
        );

      const matchesMenu = normalizedItemMenuType === normalizedMenuType;

      // Special case for Live Counter and Common Items - they should always show
      const isLiveCounter = item.category_name.toLowerCase() === "live counter";
      const isCommonItems = item.category_name.toLowerCase() === "common items";

      // Preference matching logic
      let matchesPreference = false;

      if (isLiveCounter || isCommonItems) {
        // For Live Counter and Common Items, always show regardless of preference
        matchesPreference = true;
      } else if (menuPreference === "nonveg") {
        // For non-veg preference, show non-veg items
        matchesPreference = item.is_veg === "0";
      } else {
        // For veg preference, only show veg items
        matchesPreference = item.is_veg === "1";
      }

      // Add debugging
      // console.log(`Item: ${item.item_name}, category: ${item.category_name}, is_veg: ${item.is_veg}, matches: ${matchesEvent && matchesMenu && matchesPreference}`);

      return matchesEvent && matchesMenu && matchesPreference;
    });
  };

  useEffect(() => {}, [menuData, eventType, serviceType, menuType]);

  const getCategoryLimit = (categoryName) => {
    if (
      categoryName.toLowerCase() === "common items" ||
      categoryName.toLowerCase() === "live counter"
    ) {
      return 0;
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
    if (!user) {
      setShowAlert({
        message:
          "You need to login before adding items to cart. Would you like to proceed to login?",
        isConfirmation: true,
        onConfirm: () => {
          const selectionState = {
            selectedItems,
            guestCount,
            menuPreference,
            path: window.location.pathname,
            eventType,
            serviceType,
            menuType,
          };
          localStorage.setItem(
            "pendingCartSelection",
            JSON.stringify(selectionState)
          );
          setShowAlert(null);
          window.location.href = "/login";
        },
      });
      return;
    }
    const incompleteCategories = getSortedCategories().filter((category) => {
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
      // console.log("Incomplete categories:", incompleteCategories);
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

  const handleItemSelectWithConfirmation = (item) => {
    const isLiveCounter = item.category_name.toLowerCase() === "live counter";
    const categoryItems = getItemsInCategory(item.category_name);
    const limit = getCategoryLimit(item.category_name);

    const wasSelectedPreviously = previouslySelectedItems[
      item.category_name
    ]?.includes(item.item_name);

    if (
      wasSelectedPreviously &&
      !selectedItems.some((selected) => selected.id === item.id)
    ) {
      showTemporaryNotification(item.category_name, item.item_name);
    }

    if (selectedItems.some((selected) => selected.id === item.id)) {
      handleItemSelect(item);
      return;
    }

    if (isLiveCounter) {
      setShowAlert({
        message: `Adding "${item.item_name}" will cost extra ₹${item.price} per plate.`,
        isConfirmation: true,
        onConfirm: () => {
          handleItemSelect({
            ...item,
            isExtra: true,
          });
          setShowAlert(null);
        },
      });
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
    const isLiveCounter = item.category_name.toLowerCase() === "live counter";

    if (item.category_name.toLowerCase() === "common items") {
      return;
    }

    if (selectedItems.some((selected) => selected.id === item.id)) {
      const updatedItems = selectedItems.filter(
        (selected) => selected.id !== item.id
      );

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

  const getLiveCounterItems = () => {
    return getFilteredItems().filter(
      (item) => item.category_name.toLowerCase() === "live counter"
    );
  };

  const handleAddToCart = async () => {
    // First check for incomplete categories
    const incompleteCategories = getSortedCategories().filter((category) => {
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

    // If there are incomplete categories, show alert and return
    if (incompleteCategories.length > 0) {
      setShowAlert({
        message: `Please select required items from: ${incompleteCategories.join(
          ", "
        )}`,
      });
      return;
    }

    // Check if user is logged in
    if (!user) {
      setShowAlert({
        message:
          "You need to login before adding items to cart. Would you like to proceed to login?",
        isConfirmation: true,
        onConfirm: () => {
          const selectionState = {
            selectedItems,
            guestCount,
            menuPreference,
            path: window.location.pathname,
            eventType,
            serviceType,
            menuType,
          };
          localStorage.setItem(
            "pendingCartSelection",
            JSON.stringify(selectionState)
          );
          setShowAlert(null);
          window.location.href = "/login";
        },
      });
      return;
    }

    const allItems = [
      ...selectedItems,
      ...commonItems.map((item) => ({
        ...item,
        isExtra: false,
        isComplimentary: true,
      })),
    ];

    const orderDetails = {
      user_id: user.id,
      event_name: serviceType,
      menu_type: menuType,
      guest_count: guestCount,
      plate_price: calculatePlatePrice(),
      total_price: calculateTotal(),
      items: allItems.map((item) => ({
        category_name: item.category_name,
        item_name: item.item_name,
        price: parseFloat(item.price || 0),
        is_extra: item.isExtra,
        is_complimentary: item.category_name.toLowerCase() === "common items",
      })),
    };

    try {
      const response = await fetch(
        "https://adminmahaspice.in/ms3/add-to-cart.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderDetails),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      const data = await response.json();
      if (data.success) {
        alert("Order added to cart successfully!");
      } else {
        throw new Error(data.error || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    }
  };

  useEffect(() => {
    const pendingSelection = localStorage.getItem("pendingCartSelection");
    if (pendingSelection && user) {
      try {
        const {
          selectedItems: savedItems,
          guestCount: savedCount,
          menuPreference: savedPreference,
          path,
        } = JSON.parse(pendingSelection);

        // Only restore if we're on the same page
        if (path === window.location.pathname) {
          setSelectedItems(savedItems);
          setGuestCount(savedCount);
          setMenuPreference(savedPreference);
          // Clear the pending selection
          localStorage.removeItem("pendingCartSelection");
        }
      } catch (error) {
        console.error("Error restoring selection state:", error);
        localStorage.removeItem("pendingCartSelection");
      }
    }
  }, [user]);

  if (loading) return <div className="p-8 text-center">Loading menu...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-aliceBlue grid grid-cols-1 lg:grid-cols-3 gap-1">
      {/* Live Counter Alert */}
      {showLiveCounterAlert &&
        currentMenuType.toLowerCase() === "silver menu" && (
          <>
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="max-w-2xl w-full bg-white border border-green-300 rounded-2xl p-4 sm:p-6 shadow-2xl transform transition-all duration-500 ease-in-out scale-100 animate-zoom mx-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-green-50">
                      <span className="text-xl sm:text-2xl">🌟</span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold text-base sm:text-lg mb-1">
                        We also provide{" "}
                        <span className="text-green-600">Live Counter</span>{" "}
                        options!
                      </p>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Enhance your event experience with our special live
                        counters
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowLiveCounterAlert(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="mt-4 max-h-48 sm:max-h-64 overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                    {getLiveCounterItems().map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center p-2 sm:p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 text-sm sm:text-base">
                              {item.item_name}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    Click on any live counter item in the menu to add it to your
                    selection
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

      <div className="max-w-full mx-auto p-4 lg:col-span-2">
        {/* Header */}
        <div className="max-w-full bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
            <div className="flex items-center gap-2 bg-green-50 px-3 sm:px-4 py-1 sm:py-2 rounded-lg">
              <h1 className="text-xl sm:text-3xl font-bold text-gray-800">
                {menuType
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </h1>
              <span className="text-gray-600 text-sm sm:text-base">
                Base Price:
              </span>
              <span className="text-xl sm:text-2xl font-bold text-green-600">
                ₹{calculatePlatePrice()}
              </span>
              <span className="text-gray-600 text-sm sm:text-base">
                per plate
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleMenuPreferenceChange("veg")}
                className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base ${
                  menuPreference === "veg"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Veg
              </button>
              <button
                onClick={() => handleMenuPreferenceChange("nonveg")}
                className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base ${
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

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Menu Categories */}
          <div className="lg:col-span-2 space-y-4">
            {getSortedCategories().map((category) => {
              const limit = getCategoryLimit(category);
              const selectedCount = getItemsInCategory(category).length;
              const isCommonItems = category.toLowerCase() === "common items";
              const isLiveCounter = category.toLowerCase() === "live counter";

              // Find the category type (veg or non-veg) from categoryData
              const categoryType = categoryData.find(
                (cat) => cat.category_name === category
              )?.category_type;

              return (
                <div
                  key={category}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                    category.toLowerCase() === "live counter"
                      ? "border-2 border-green-500"
                      : ""
                  }`}
                >
                  <div
                    className={`p-3 sm:p-4 border-b ${
                      category.toLowerCase() === "live counter"
                        ? "bg-green-50"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-start items-center">
                      {!isCommonItems && (
                        <span
                          className={`w-4 h-4 sm:w-6 sm:h-6 rounded-lg border-2 flex items-center justify-center ${
                            categoryType === "nonveg"
                              ? "border-red-500"
                              : "border-green-500"
                          }`}
                        >
                          <span
                            className={`w-3 h-3 sm:w-3 sm:h-3 rounded-full ${
                              categoryType === "nonveg"
                                ? "bg-red-500"
                                : "bg-green-500"
                            }`}
                          ></span>
                        </span>
                      )}
                      <h2
                        className={`text-lg sm:text-xl font-bold ml-2 ${
                          category.toLowerCase() === "live counter"
                            ? "text-black"
                            : "text-gray-800"
                        }`}
                      >
                        {category}{" "}
                        {!isCommonItems && !isLiveCounter && `(ANY ${limit})`}
                        {category.toLowerCase() === "live counter" && (
                          <span className="ml-2 text-sm font-normal text-black animate-pulse">
                            ✨ Special Addition (Optional)
                          </span>
                        )}
                      </h2>
                      {notifications[category] && (
                        <div className="p-1 bg-yellow-50 text-yellow-800 rounded-md text-xs sm:text-sm animate-fade-out">
                          {notifications[category].message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 min-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                    {getFilteredItems()
                      .filter((item) => item.category_name === category)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <label className="flex items-center flex-1 cursor-pointer">
                            <div className="relative w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3">
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
                                className={`w-4 h-4 sm:w-5 sm:h-5 border-2 rounded transition-colors ${
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
                            <span className="flex-1 text-sm sm:text-base">
                              {item.item_name}
                            </span>
                          </label>
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
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 max-w-md w-full">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <AlertTriangle className="text-orange-500" size={20} />
                <h3 className="text-base sm:text-lg font-bold">
                  {showAlert.isConfirmation
                    ? "Confirmation Required"
                    : "Missing Items"}
                </h3>
              </div>

              <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
                {showAlert.message}
              </p>

              <div className="flex justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => setShowAlert(null)}
                  className="px-3 sm:px-4 py-1 sm:py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm sm:text-base"
                >
                  {showAlert.isConfirmation ? "Cancel" : "OK"}
                </button>
                {showAlert.isConfirmation && (
                  <button
                    onClick={showAlert.onConfirm}
                    className="px-3 sm:px-4 py-1 sm:py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors text-sm sm:text-base"
                  >
                    Proceed
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="lg:sticky lg:top-6 lg:col-span-1 mt-4 sm:mt-5 mr-4 sm:mr-5">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 sticky top-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
            Your Selection
          </h2>

          <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 p-2 sm:p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-600 text-sm sm:text-base">Guests:</span>
            <button
              onClick={handleGuestCountDecrement}
              className="p-1 sm:p-2 rounded hover:bg-gray-200 transition-colors"
            >
              <Minus size={14} />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="w-12 sm:w-16 text-center font-bold bg-white border rounded-md py-1 px-2 focus:outline-none text-sm sm:text-base"
              maxLength={4}
            />
            <button
              onClick={handleGuestCountIncrement}
              className="p-1 sm:p-2 rounded hover:bg-gray-200 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="space-y-2 sm:space-y-4 mb-4 sm:mb-6 max-h-48 sm:max-h-96 overflow-y-auto">
            <h3 className="font-bold text-sm sm:text-base">Selected Items</h3>
            {Object.entries(
              selectedItems.reduce((acc, item) => {
                if (!acc[item.category_name]) acc[item.category_name] = [];
                acc[item.category_name].push(item);
                return acc;
              }, {})
            )
              .reverse()
              .map(([category, items]) => (
                <div
                  key={category}
                  className="p-2 sm:p-4 bg-gray-50 rounded-lg"
                >
                  <h3 className="font-bold text-gray-700 text-sm sm:text-base mb-1 sm:mb-2">
                    {category}
                  </h3>
                  <ul className="space-y-1 sm:space-y-2">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="flex justify-between items-center text-sm sm:text-base"
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

          <div className="border-t pt-2 sm:pt-4 mb-4 sm:mb-6">
            <div className="space-y-1 sm:space-y-2">
              <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                <span>
                  Plate Cost (₹{calculatePlatePrice()} × {guestCount})
                </span>
                <span>₹{(calculatePlatePrice() * guestCount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                <span>Extra Items Per Plate</span>
                <span>
                  ₹
                  {selectedItems
                    .filter((item) => item.isExtra)
                    .reduce((sum, item) => sum + parseFloat(item.price || 0), 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg sm:text-xl font-bold pt-2 border-t">
                <span>Total</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <button
              onClick={() => handleActionButton("pay")}
              className="w-full py-2 sm:py-3 px-3 sm:px-4 rounded-lg flex items-center justify-center gap-1 sm:gap-2 bg-green-600 hover:bg-green-700 text-white transition-colors text-sm sm:text-base"
            >
              <CreditCard size={16} />
              Proceed to Pay
            </button>
            <button
              onClick={handleAddToCart}
              className="w-full py-2 sm:py-3 px-3 sm:px-4 rounded-lg flex items-center justify-center gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors text-sm sm:text-base"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuSelection;
