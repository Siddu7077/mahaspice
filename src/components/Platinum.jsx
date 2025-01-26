import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Minus,
  ShoppingCart,
  CreditCard,
  AlertTriangle,
} from "lucide-react";

const Platinum = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [menuPreference, setMenuPreference] = useState("veg");
  const [guestCount, setGuestCount] = useState(10);
  const [inputValue, setInputValue] = useState(guestCount.toString());
  const [showAlert, setShowAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [crpbPrices, setCrpbPrices] = useState(null);

  useEffect(() => {
    const storedSelectedItems = localStorage.getItem("selectedPlatinumItems");
    const storedMenuPreference = localStorage.getItem("platinumMenuPreference");

    if (storedSelectedItems) {
      setSelectedItems(JSON.parse(storedSelectedItems));
    }
    if (storedMenuPreference) {
      setMenuPreference(storedMenuPreference);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch CRPB prices first
        const crpbResponse = await axios.get(
          "https://mahaspice.desoftimp.com/ms3/getcrpb.php"
        );
        const platinumPackage = crpbResponse.data.find(
          (pkg) => pkg.name === "Platinum"
        );
        if (platinumPackage) {
          setCrpbPrices({
            vegPrice: parseFloat(platinumPackage.veg_price),
            nonvegPrice: parseFloat(platinumPackage.nonveg_price),
          });
        }

        const itemsResponse = await axios.get(
          "https://mahaspice.desoftimp.com/ms3/getsf_items.php"
        );
        const categoriesResponse = await axios.get(
          "https://mahaspice.desoftimp.com/ms3/getsf_categories.php"
        );

        if (itemsResponse.data.success) {
          const platinumItems = itemsResponse.data.items.filter((item) => {
            const category = categoriesResponse.data.categories.find(
              (cat) => cat.id === item.category_id
            );
            return category && category.type === "platinum";
          });

          const mappedItems = platinumItems.map((item) => ({
            ...item,
            id: item.id,
            name: item.item_name,
            is_veg: item.is_veg === "veg" ? "1" : "0",
            category_id: item.category_id,
            price: parseFloat(item.item_price) || 0,
          }));
          setItems(mappedItems);
        }

        if (categoriesResponse.data.success) {
          const platinumCategories = categoriesResponse.data.categories.filter(
            (cat) => cat.type === "platinum"
          );
          const mappedCategories = platinumCategories.map((cat) => ({
            ...cat,
            name: cat.category,
            id: cat.id,
            position: cat.position,
          }));
          setCategories(mappedCategories);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load menu data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "selectedPlatinumItems",
      JSON.stringify(selectedItems)
    );
    localStorage.setItem("platinumMenuPreference", menuPreference);
  }, [selectedItems, menuPreference]);

  const handleMenuPreferenceChange = (preference) => {
    setMenuPreference(preference);
    setSelectedItems([]);
  };

  const getSortedCategories = () => {
    const filteredItems = items.filter((item) =>
      menuPreference === "nonveg" ? true : item.is_veg === "1"
    );

    const uniqueCategories = [
      ...new Set(
        filteredItems.map(
          (item) =>
            categories.find((cat) => cat.id === item.category_id)?.name ||
            "Uncategorized"
        )
      ),
    ];

    return uniqueCategories.sort((a, b) => {
      const catA = categories.find((cat) => cat.name === a);
      const catB = categories.find((cat) => cat.name === b);
      const posA = catA ? parseInt(catA.position) || 0 : 0;
      const posB = catB ? parseInt(catB.position) || 0 : 0;
      return posA - posB;
    });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setInputValue(value);
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue >= 10 && numValue <= 100) {
        setGuestCount(numValue);
      }
    }
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue);
    if (isNaN(numValue) || numValue < 10) {
      setInputValue("10");
      setGuestCount(10);
    } else if (numValue > 100) {
      setInputValue("100");
      setGuestCount(100);
    }
  };

  const handleIncrementGuests = () => {
    if (guestCount < 100) {
      const newGuestCount = guestCount + 1;
      setGuestCount(newGuestCount);
      setInputValue(newGuestCount.toString());
    }
  };

  const handleDecrementGuests = () => {
    if (guestCount > 10) {
      const newGuestCount = guestCount - 1;
      setGuestCount(newGuestCount);
      setInputValue(newGuestCount.toString());
    }
  };

  const handleItemSelectWithConfirmation = (item) => {
    const maxSelectionPerCategory = 3;
    const categoryItems = selectedItems.filter(
      (selected) =>
        categories.find((cat) => cat.id === selected.category_id)?.name ===
        categories.find((cat) => cat.id === item.category_id)?.name
    );

    if (selectedItems.some((selected) => selected.id === item.id)) {
      handleItemSelect(item);
      return;
    }

    if (categoryItems.length >= maxSelectionPerCategory) {
      setShowAlert({
        message: `You've reached the limit of ${maxSelectionPerCategory} items for this category.`,
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
    if (selectedItems.some((selected) => selected.id === item.id)) {
      // Remove the item
      const updatedItems = selectedItems.filter(
        (selected) => selected.id !== item.id
      );
      setSelectedItems(updatedItems);
    } else {
      // Adding a new item
      setSelectedItems([...selectedItems, item]);
    }
  };

  const calculateTotal = () => {
    if (!crpbPrices) return 0;
  
    // Determine base price based on menu preference
    const basePrice =
      menuPreference === "veg" ? crpbPrices.vegPrice : crpbPrices.nonvegPrice;
  
    // Discount calculation: 1 Rs off per 10 guests
    const guestDiscount = Math.floor(guestCount / 10);
    const adjustedBasePrice = basePrice - guestDiscount;
  
    // Calculate total from individual item prices
    const itemPrices = selectedItems.reduce(
      (total, item) => total + (item.price || 0),
      0
    );
    // const deliveryCharge = 500;
  
    // Subtotal before tax
    const subTotalValue = adjustedBasePrice * guestCount;
  
    // GST calculation (18%)
    const gst = subTotalValue * 0.18;
  
    // Final total with GST
    return subTotalValue + gst;
  };
  
  const calculateSubtotal = () => {
    if (!crpbPrices) return 0;
  
    // Determine base price based on menu preference
    const basePrice =
      menuPreference === "veg" ? crpbPrices.vegPrice : crpbPrices.nonvegPrice;
  
    // Discount calculation: 1 Rs off per 10 guests
    const guestDiscount = Math.floor(guestCount / 10);
    const adjustedBasePrice = basePrice - guestDiscount;
  
    // Calculate total from individual item prices
    const itemPrices = selectedItems.reduce(
      (total, item) => total + (item.price || 0),
      0
    );
    // const deliveryCharge = 500;
  
    // Subtotal before tax
    return adjustedBasePrice * guestCount;
  };
  
  

  if (loading) return <div className="p-8 text-center">Loading menu...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-aliceBlue grid grid-cols-3 gap-1">
      {/* Header section */}
      <div className="max-w-full mx-auto p-6 lg:col-span-2 ">
        <div className="max-w-full bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
              <h1 className="text-3xl font-bold text-gray-800">
                Platinum Menu
              </h1>
              <span className="text-gray-600">Base Price:</span>
              <span className="text-2xl font-bold text-blue-600">
                ₹
                {crpbPrices
                  ? menuPreference === "veg"
                    ? crpbPrices.vegPrice
                    : crpbPrices.nonvegPrice
                  : "Loading..."}
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
          {getSortedCategories().map((category) => {
            const selectedCount = selectedItems.filter(
              (item) =>
                categories.find((cat) => cat.id === item.category_id)?.name ===
                category
            ).length;
            const maxSelectionPerCategory = 3; // Adjust as needed

            return (
              <div
                key={category}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">
                      {category} (ANY {maxSelectionPerCategory})
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        selectedCount >= maxSelectionPerCategory
                          ? "bg-orange-100 text-orange-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {selectedCount}/{maxSelectionPerCategory} selected
                    </span>
                  </div>
                </div>

                <div className="p-4 min-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items
                    .filter(
                      (item) =>
                        categories.find((cat) => cat.id === item.category_id)
                          ?.name === category &&
                        (menuPreference === "nonveg" || item.is_veg === "1")
                    )
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
                              className={`w-5 h-5 border-2 rounded transition-colors ${
                                selectedItems.some(
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
                          <span className="flex-1">{item.name}</span>
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
              onClick={handleDecrementGuests}
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
              maxLength={3}
            />
            <button
              onClick={handleIncrementGuests}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            <h3 className="font-bold">Selected Items</h3>
            {Object.entries(
              selectedItems.reduce((acc, item) => {
                const categoryName =
                  categories.find((cat) => cat.id === item.category_id)?.name ||
                  "Uncategorized";
                if (!acc[categoryName]) acc[categoryName] = [];
                acc[categoryName].push(item);
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
                        <span className="text-gray-600">{item.name}</span>
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
                  Plate Cost (₹
                  {crpbPrices
                    ? menuPreference === "veg"
                      ? crpbPrices.vegPrice
                      : crpbPrices.nonvegPrice
                    : "Loading..."}{" "}
                  × {guestCount})
                </span>
                <span>
                  ₹
                  {crpbPrices
                    ? (
                        crpbPrices[menuPreference + "Price"] * guestCount
                      ).toFixed(2)
                    : "Loading..."}
                </span>
              </div>
              {/* <div className="flex justify-between text-gray-600">
                <span>Extra Items</span>
                <span>₹{(selectedItems.length * 100).toFixed(2)}</span>
              </div> */}
              <div className="flex justify-between text-gray-600">
                <span>GST: </span>
                <span>₹{calculateSubtotal()*0.18.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2 border-t">
                <span>Total</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white transition-colors">
              <CreditCard size={20} />
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Platinum;
