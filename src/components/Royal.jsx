import React, { useState, useEffect } from 'react';
import { Plus, Minus, ShoppingCart, CreditCard, AlertTriangle } from 'lucide-react';

const Royal = () => {
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

  const baseUrl = 'https://adminmahaspice.in/ms3/';

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

        // Filter categories for royal type only
        const royalCategories = categoriesData.categories.filter(
          cat => cat.type.toLowerCase() === 'royal'
        );
        
        // Filter menu items to only include those in royal categories
        const royalCategoryNames = royalCategories.map(cat => cat.category.toLowerCase());
        const royalItems = itemsData.filter(item => 
          royalCategoryNames.includes(item.category_name.toLowerCase())
        );

        setMenuData(royalItems);
        setCategoryData(royalCategories);
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
  }, []);

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

  const calculatePlatePrice = () => {
    if (!pricingData) return 0;
    
    const royalPricing = pricingData.find(
      price => price.crpb_name.toLowerCase() === 'royal'
    );

    if (!royalPricing) return 0;

    const basePrice = menuPreference === "veg" 
      ? parseFloat(royalPricing.veg_price)
      : parseFloat(royalPricing.non_veg_price);

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
    // Only get categories that are of type 'royal'
    const royalCategories = categoryData.map(cat => cat.category);
    const filteredItems = getFilteredItems();
    const uniqueCategories = [...new Set(filteredItems.map(item => item.category_name))]
      .filter(category => royalCategories.includes(category));

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

  if (loading) return <div className="p-8 text-center">Loading menu...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 grid grid-cols-3 gap-1">
      <div className="col-span-2 p-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
              <h1 className="text-3xl font-bold text-gray-800">Royal Menu</h1>
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

      <div className="p-6">
        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Your Selection</h2>

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
            {Object.entries(
              selectedItems.reduce((acc, item) => {
                if (!acc[item.category_name]) acc[item.category_name] = [];
                acc[item.category_name].push(item);
                return acc;
              }, {})
            ).map(([category, items]) => (
              <div key={category} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-gray-700 mb-2">{category}</h3>
                <ul className="space-y-2">
                  {items.map(item => (
                    <li key={item.id} className="text-gray-600">
                      {item.item_name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-3">
            {/* <button className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors">
              <ShoppingCart size={20} />
              Add to Cart
            </button> */}
            <button className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white transition-colors">
              <CreditCard size={20} />
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>

      {showAlert && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-orange-500" size={24} />
              <h3 className="text-lg font-bold">Alert</h3>
            </div>
            <p className="text-gray-600 mb-6">{showAlert.message}</p>
            <button
              onClick={() => setShowAlert(null)}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Royal;