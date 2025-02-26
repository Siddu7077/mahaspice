import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus, ShoppingCart, CreditCard, AlertTriangle , AlertCircle } from 'lucide-react';
import SupOrder from './SupOrder';
import { useNavigate } from 'react-router-dom';

const UniversalMenu = ({ eventName, packageName }) => {
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
  const navigate = useNavigate();
  const [showOrder, setShowOrder] = useState(false);
  const [showGuestLimitPopup, setShowGuestLimitPopup] = useState(false);

  const baseUrl = 'https://adminmahaspice.in/ms3/';

  // Create a ref to the component's root element
  const componentRef = useRef(null);
  

  // Scroll the component into view when it mounts or when eventName/packageName changes
  useEffect(() => {
    if (componentRef.current) {
      componentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [eventName, packageName]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [itemsResponse, categoriesResponse, pricingResponse] = await Promise.all([
          fetch(`${baseUrl}getsf_items.php`),
          fetch(`${baseUrl}getsf_categories.php`),
          fetch(`${baseUrl}get_sup_event_pricing.php`)
        ]);

        const itemsData = await itemsResponse.json();
        const categoriesData = await categoriesResponse.json();
        const pricingData = await pricingResponse.json();

        // Filter categories for the selected package and event
        const filteredCategories = categoriesData.categories.filter(
          cat => cat.type.toLowerCase() === packageName.toLowerCase() && cat.event_name === eventName
        );

        // Filter menu items to only include those in the filtered categories
        const filteredCategoryNames = filteredCategories.map(cat => cat.category.toLowerCase());
        const filteredItems = itemsData.filter(item =>
          filteredCategoryNames.includes(item.category_name.toLowerCase()) && item.event_name === eventName
        );

        

        setMenuData(filteredItems);
        setCategoryData(filteredCategories);
        setPricingData(pricingData);
        setError(null);
      } catch (err) {
        setError("Failed to load menu data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventName, packageName]);
  

  const handleMenuPreferenceChange = (preference) => {
    setMenuPreference(preference);
    setSelectedItems([]);
  };

  const handleGuestIncrement = () => {
    if (guestCount >= 50) {
      setShowGuestLimitPopup(true);
      return;
    }
    const newCount = guestCount + 1;
    setGuestCount(newCount);
    setInputValue(newCount.toString());
  };
   const handleGuestLimitCancel = () => {
    setShowGuestLimitPopup(false);
    setGuestCount(50);
    setInputValue("50");
  };

  const handleRedirectToBox = () => {
    navigate('/events');
  };


  const handleGuestDecrement = () => {
    const newCount = Math.max(10, guestCount - 1);
    setGuestCount(newCount);
    setInputValue(newCount.toString());
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setInputValue(value);
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        if (numValue > 50) {
          setShowAlert({
            message: "In Superfast, we can deliver only up to 50 guests. For larger events, please order from '/events'",
          });
          setGuestCount(50);
          setInputValue("50");
        } else if (numValue >= 10) {
          setGuestCount(numValue);
        }
      }
    }
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue);
    if (isNaN(numValue) || numValue < 10) {
      setInputValue("10");
      setGuestCount(10);
    } else if (numValue > 50) {
      setInputValue("50");
      setGuestCount(50);
    }
  };

  const calculatePlatePrice = () => {
    if (!pricingData) return 0;

    const packagePricing = pricingData.find(
      price => price.crpb_name.toLowerCase() === packageName.toLowerCase() && price.event_name === eventName
    );

    if (!packagePricing) return 0;

    const basePrice = menuPreference === "veg"
      ? parseFloat(packagePricing.veg_price)
      : parseFloat(packagePricing.non_veg_price);

    return basePrice;
  };

  const calculateTotal = () => {
    const platePrice = calculatePlatePrice();
    return platePrice * guestCount;
  };

  const getFilteredItems = () => {
    return menuData.filter(item => {
      const isVegMatch = menuPreference === "nonveg" ? true : item.is_veg === true;
      return isVegMatch;
    });
  };

  const getSortedCategories = () => {
    const filteredItems = getFilteredItems();
    const uniqueCategories = [...new Set(filteredItems.map(item => item.category_name))];

    return uniqueCategories.sort((a, b) => {
      const categoryA = categoryData.find(cat => cat.category === a);
      const categoryB = categoryData.find(cat => cat.category === b);
      const posA = categoryA ? parseInt(categoryA.position) || 0 : 0;
      const posB = categoryB ? parseInt(categoryB.position) || 0 : 0;
      return posA - posB;
    });
  };

  const getCategoryLimit = (categoryName) => {
    const category = categoryData.find(cat => cat.category === categoryName);
    return category ? parseInt(category.limit) : 0;
  };

  const getItemsInCategory = (categoryName) => {
    return selectedItems.filter(item => item.category_name === categoryName);
  };

  const handleItemSelect = (item) => {
    if (selectedItems.some(selected => selected.id === item.id)) {
      setSelectedItems(selectedItems.filter(selected => selected.id !== item.id));
    } else {
      const categoryLimit = getCategoryLimit(item.category_name);
      const categoryItems = getItemsInCategory(item.category_name);

      if (categoryItems.length >= categoryLimit) {
        setShowAlert({
          message: `You've reached the limit of ${categoryLimit} items for ${item.category_name}.`,
        });
        return;
      }

      setSelectedItems([...selectedItems, item]);
    }
  };
  const handleProceedToOrder = () => {
    setShowOrder(true);
  };

  if (showOrder) {
    return (
      <SupOrder
        selectedItems={selectedItems}
        platePrice={calculatePlatePrice()}
        guestCount={guestCount}
        totalAmount={calculateTotal()}
      />
    );
  }

  if (loading) return <div className="p-8 text-center">Loading menu...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div ref={componentRef} className="min-h-screen bg-gray-50 grid grid-cols-3 gap-1">
      <div className="col-span-2 p-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
              <h1 className="text-3xl font-bold text-gray-800">{packageName} Menu</h1>
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

        <div className="space-y-6">
          {getSortedCategories().map(category => {
            const limit = getCategoryLimit(category);
            const selectedCount = getItemsInCategory(category).length;

            return (
              <div key={category} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">
                      {category} {`(ANY ${limit})`}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      selectedCount >= limit
                        ? "bg-orange-100 text-orange-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {selectedCount}/{limit} selected
                    </span>
                  </div>
                </div>

                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredItems()
                    .filter(item => item.category_name === category)
                    .map(item => (
                      <div key={item.id}
                           className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <label className="flex items-center flex-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedItems.some(selected => selected.id === item.id)}
                            onChange={() => handleItemSelect(item)}
                            className="mr-3"
                          />
                          <span>{item.item_name}</span>
                        </label>
                        <span className={`w-6 h-6 flex items-center justify-center rounded border-2 ${
                          item.is_veg ? "border-green-500" : "border-red-500"
                        }`}>
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            item.is_veg ? "bg-green-500" : "bg-red-500"
                          }`}></span>
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="lg:sticky lg:top-6 lg:col-span-1 mt-5 mr-5">
        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Your Selection
          </h2>

          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Guests:</span>
            <button
              onClick={handleGuestDecrement}
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
              onClick={handleGuestIncrement}
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
              onClick={handleProceedToOrder}
              className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white transition-colors"
            >
              <CreditCard size={20} />
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>

      {/* Alert Modal */}
     {showGuestLimitPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-start mb-4">
              <AlertCircle className="w-6 h-6 text-orange-500 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Guest Limit Exceeded</h3>
                <p className="text-gray-600 mb-6">
                  We can only accommodate up to 50 guests with Superfast Event Caterers. If you'd like to add more than 50 guests, we recommend switching to regular Event Caterers. Please note that delivery times may vary based on the number of guests and the delivery location.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleGuestLimitCancel}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRedirectToBox}
                className="px-4 py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
              >
                Yes, continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversalMenu;