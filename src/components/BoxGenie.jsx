import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Coffee, Sun, Moon, Plus, Minus, Trash2, X } from "lucide-react";
import CheckOutform from "./CheckOutform";
import ScrollToTop from "./ScrollToTop";
import { useAuth } from './AuthSystem';

// Keeping the existing helper functions
const transformApiData = (apiData) => {
  const cpTypes = [
    ...new Set(apiData.map((item) => item.cp_type.toUpperCase())),
  ];
  const transformed = {
    breakfast: {},
    lunch: {},
    dinner: {},
  };

  cpTypes.forEach((cpType) => {
    transformed.breakfast[cpType] = [];
    transformed.lunch[cpType] = { veg: [], nonVeg: [] };
    transformed.dinner[cpType] = { veg: [], nonVeg: [] };
  });

  apiData.forEach((item) => {
    const mealTime = item.meal_time.toLowerCase();
    const cpType = item.cp_type.toUpperCase();
    const isVeg = item.veg_non_veg === "Veg";

    const transformedItem = {
      id: item.id.toString(),
      name: item.cp_name,
      image: `https://mahaspice.desoftimp.com/ms3${item.image_address}`,
      items: item.description.split(","),
      price: `₹${item.price}`,
      rating: 4.5,
      time: item.is_superfast === "Yes" ? "30 mins" : "45 mins",
    };

    if (mealTime === "breakfast") {
      transformed.breakfast[cpType].push(transformedItem);
    } else {
      if (isVeg) {
        transformed[mealTime][cpType].veg.push(transformedItem);
      } else {
        transformed[mealTime][cpType].nonVeg.push(transformedItem);
      }
    }
  });

  return { data: transformed, cpTypes };
};

const getPackageImage = (cpType) => {
  const defaultImage = "https://new.caterninja.com/PackedMealBox/3cp.png";
  const packageImages = {
    "3CP": "https://new.caterninja.com/PackedMealBox/3cp.png",
    "4CP": "https://new.caterninja.com/PackedMealBox/3cp.png",
    "5CP": "https://new.caterninja.com/PackedMealBox/5cp.png",
    "6CP": "https://new.caterninja.com/PackedMealBox/5cp.png",
    "8CP": "https://new.caterninja.com/PackedMealBox/8cp.png",
  };
  return packageImages[cpType] || defaultImage;
};

const MealBox = () => {
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [cpTypes, setCpTypes] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState("breakfast");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [isVeg, setIsVeg] = useState(true);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("mealCart");
    return savedCart ? JSON.parse(savedCart) : {};
  });
  const [showCheckout, setShowCheckout] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [error, setError] = useState("");
  const [gstPercentage, setGstPercentage] = useState(18);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  // Add missing getFinalTotal function
  const getFinalTotal = () => {
    return calculateCartTotal() - calculateDiscount() + calculateGST();
  };

  const serviceType = window.location.pathname === "/box" ? "box_genie" : "";

  useEffect(() => {
    // Fetch GST data
    fetch("https://mahaspice.desoftimp.com/ms3/displaygst.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const serviceGst = data.data.find(
            (item) => item.service_type === serviceType
          );
          if (serviceGst) {
            setGstPercentage(serviceGst.gst_percentage);
          }
        }
      })
      .catch((err) => console.error("Error fetching GST:", err));

    // Fetch coupons
    fetch("https://mahaspice.desoftimp.com/ms3/displaycoupons.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const validCoupons = data.coupons.filter(
            (coupon) =>
              coupon.coupon_type === serviceType &&
              coupon.is_active &&
              new Date(coupon.valid_from) <= new Date() &&
              new Date(coupon.valid_until) >= new Date() &&
              coupon.usage_count < coupon.usage_limit
          );
          setAvailableCoupons(validCoupons);
        }
      })
      .catch((err) => console.error("Error fetching coupons:", err));
  }, [serviceType]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://mahaspice.desoftimp.com/ms3/cptypes.php"
        );
        const data = await response.json();
        const { data: transformedData, cpTypes } = transformApiData(data);
        setPackageData(transformedData);
        setCpTypes(cpTypes);
        // Removed the setSelectedPackage(cpTypes[1]) line so no package is selected initially
      } catch (error) {
        console.error("Error fetching package data:", error);
      }
    };
    fetchData();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("mealCart", JSON.stringify(cart));
  }, [cart]);

  const [quantityInputs, setQuantityInputs] = useState(() => {
    const savedCart = JSON.parse(localStorage.getItem("mealCart") || "{}");
    return Object.keys(savedCart).reduce(
      (acc, itemId) => ({
        ...acc,
        [itemId]: savedCart[itemId].quantity.toString(),
      }),
      {}
    );
  });

  const handleQuantityChange = (itemId, value) => {
    const newValue = value.replace(/[^0-9]/g, "");
    setQuantityInputs((prev) => ({ ...prev, [itemId]: newValue }));

    if (newValue !== "") {
      const numValue = parseInt(newValue, 10);
      if (numValue >= 10 || numValue === 0) {
        // Allow 0 or minimum 10
        updateQuantity(itemId, numValue);
      } else if (numValue > 0) {
        updateQuantity(itemId, 10); // Set to minimum if below 10
      }
    }
  };

  const handleBlur = (itemId) => {
    const currentValue = parseInt(quantityInputs[itemId], 10);
    if (isNaN(currentValue) || currentValue === 0) {
      setQuantityInputs((prev) => ({ ...prev, [itemId]: "0" }));
      updateQuantity(itemId, 0);
    } else if (currentValue < 10) {
      setQuantityInputs((prev) => ({ ...prev, [itemId]: "10" }));
      updateQuantity(itemId, 10);
    }
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const { [itemId]: removedItem, ...restCart } = prevCart;
      return restCart;
    });
    setQuantityInputs((prev) => {
      const { [itemId]: removed, ...rest } = prev;
      return rest;
    });
  };

  // Helper function to group cart items by package
  const getGroupedCart = () => {
    return Object.entries(cart).reduce((acc, [itemId, itemData]) => {
      const packageType = itemData.package;
      if (!acc[packageType]) {
        acc[packageType] = [];
      }
      acc[packageType].push({ itemId, ...itemData });
      return acc;
    }, {});
  };

  // Helper function to calculate package subtotal
  const calculatePackageSubtotal = (items) => {
    return items
      .reduce(
        (total, { details, quantity }) =>
          total + parseFloat(details.price.replace("₹", "")) * quantity,
        0
      )
      .toFixed(2);
  };

  const getAvailablePackages = () => {
    if (!packageData) return [];

    return Object.keys(packageData[selectedMealType])
      .filter((pkg) => {
        if (selectedMealType === "breakfast") {
          return packageData[selectedMealType][pkg].length >= 0;
        } else {
          if (isVeg) {
            return packageData[selectedMealType][pkg].veg.length >= 0;
          } else {
            return packageData[selectedMealType][pkg].nonVeg.length >= 0;
          }
        }
      })
      .sort((a, b) => b.localeCompare(a)); // Sort in descending order
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
      const currentItem = prevCart[item.id] || { quantity: 0, details: item };
      return {
        ...prevCart,
        [item.id]: {
          quantity: 10,
          details: item,
          package: selectedPackage,
          mealType: selectedMealType,
        },
      };
    });
    setQuantityInputs((prev) => ({
      ...prev,
      [item.id]: "10",
    }));
  };

  const updateQuantity = (itemId, newQuantity) => {
    // Ensure minimum quantity of 10
    if (newQuantity > 0 && newQuantity < 10) {
      newQuantity = 10;
    }

    setCart((prevCart) => {
      if (newQuantity === 0) {
        const { [itemId]: removedItem, ...restCart } = prevCart;
        // Also update quantityInputs when removing item
        setQuantityInputs((prev) => {
          const { [itemId]: removed, ...rest } = prev;
          return rest;
        });
        return restCart;
      }
      return {
        ...prevCart,
        [itemId]: {
          ...prevCart[itemId],
          quantity: newQuantity,
        },
      };
    });
    setQuantityInputs((prev) => ({
      ...prev,
      [itemId]: newQuantity.toString(),
    }));
  };

  const calculateCartTotal = () => {
    return Object.entries(cart).reduce((total, [itemId, itemData]) => {
      const itemPrice = parseFloat(itemData.details.price.replace("₹", ""));
      return total + itemPrice * itemData.quantity;
    }, 0);
  };

  // const calculateGST = () => {
  //   return Math.round(calculateCartTotal() * 0.18);
  // };

  const { user } = useAuth();

  const handleCheckout = () => {
  
    if (Object.keys(cart).length === 0) {
      alert("Your cart is empty!");
      return;
    }
  
    if (!user) {
      // Store current path for redirect after login
      const currentPath = window.location.pathname;
      localStorage.setItem('checkoutRedirect', currentPath);
      
      if (confirm("Please login before going to Checkout")) {
        window.location.href = '/login';
      } else {
        return;
      }
    }
    
  
    // If we get here, cart is not empty and user is logged in
    setShowCheckout(true);
  };

  const handleApplyCoupon = () => {
    setError("");
    const coupon = availableCoupons.find(
      (c) => c.code === couponCode.toUpperCase()
    );

    if (!coupon) {
      setError("Invalid coupon code");
      setAppliedCoupon(null);
      return;
    }

    const subtotal = calculateCartTotal();
    if (subtotal < coupon.min_order_value) {
      setError(`Minimum order value of ₹${coupon.min_order_value} required`);
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(coupon);
    setError("");
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setError("");
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;

    const subtotal = calculateCartTotal();
    if (subtotal < appliedCoupon.min_order_value) {
      setAppliedCoupon(null);
      setError(
        `Minimum order value of ₹${appliedCoupon.min_order_value} required`
      );
      return 0;
    }

    let discount = 0;
    if (appliedCoupon.discount_type === "percentage") {
      discount = (subtotal * appliedCoupon.discount_value) / 100;
      if (appliedCoupon.max_discount) {
        discount = Math.min(discount, appliedCoupon.max_discount);
      }
    } else {
      discount = appliedCoupon.discount_value;
    }

    return Math.round(discount);
  };

  // Modify the calculateGST function
  const calculateGST = () => {
    const subtotal = calculateCartTotal() - calculateDiscount();
    return Math.round((subtotal * gstPercentage) / 100);
  };

  if (!packageData) return <div>Loading...</div>;
  if (showCheckout) {
    return (
      <CheckOutform
        cart={cart}
        onBack={() => setShowCheckout(false)}
        cartTotal={calculateCartTotal()}
        gstAmount={calculateGST()}
        gstPercentage={gstPercentage}
        calculateDiscount={calculateDiscount()}
        totalAmount={getFinalTotal()}
        appliedCoupon={appliedCoupon}
        discountAmount={calculateDiscount()}
      />
    );
  }

 

  


  const availablePackages = getAvailablePackages();

  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />

      {/* Header with Meal Type Selection */}
      <div className="sticky top-0 z-20 bg-white shadow-sm flex items-center justify-center">
        <div className="flex justify-center gap-4 p-4">
          <button
            onClick={() => {
              setSelectedMealType("breakfast");
              // setSelectedPackage(getAvailablePackages()[0]);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              selectedMealType === "breakfast"
                ? "bg-orange-100 text-orange-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Coffee className="w-5 h-5" />
            Breakfast
          </button>
          <button
            onClick={() => {
              setSelectedMealType("lunch");
              // setSelectedPackage(getAvailablePackages()[0]);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              selectedMealType === "lunch"
                ? "bg-orange-100 text-orange-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Sun className="w-5 h-5" />
            Lunch
          </button>
          <button
            onClick={() => {
              setSelectedMealType("dinner");
              // setSelectedPackage(getAvailablePackages()[0]);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              selectedMealType === "dinner"
                ? "bg-orange-100 text-orange-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Moon className="w-5 h-5" />
            Dinner
          </button>
        </div>
        {/* Veg/NonVeg Toggle for lunch and dinner */}
        {selectedMealType !== "breakfast" && (
          <div className="min-w-44 max-w-48">
            <div className="w-full bg-gray-200 p-1 rounded-full relative flex items-center cursor-pointer">
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-1/2 rounded-full bg-white shadow-md"
                animate={{
                  x: isVeg ? 0 : "100%",
                  backgroundColor: isVeg ? "#14cc2a" : "#EF4444",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              />
              <div
                className="w-full flex justify-between text-sm z-10 relative"
                onClick={() => setIsVeg(!isVeg)}
              >
                <div
                  className={`flex-1 text-center py-2 px-4 text-sm rounded-full transition-colors ${
                    isVeg
                      ? "text-white font-semibold"
                      : "text-gray-700 font-medium"
                  }`}
                >
                  Veg
                </div>
                <div
                  className={`flex-1 text-center py-2 px-4 text-sm rounded-full transition-colors ${
                    !isVeg
                      ? "text-white font-semibold"
                      : "text-gray-700 font-medium"
                  }`}
                >
                  NonVeg
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-7 gap-6">
          {/* Left Column - 80% */}
          <div className="col-span-5">
            {/* Package Buttons Row */}
            <div className="flex gap-4 mb-6 overflow-x-auto pb-4">
              {availablePackages.length > 0 ? (
                availablePackages
                  .sort((a, b) => a.localeCompare(b)) // Sort in ascending order
                  .map((pkg) => (
                    <button
                      key={pkg}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`flex flex-col items-center justify-between p-4 rounded-xl border-2 min-w-fit transition-all ${
                        selectedPackage === pkg
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-200"
                      }`}
                    >
                      <img
                        src={getPackageImage(pkg)}
                        alt={`${pkg} Package`}
                        className="w-24 h-auto mb-2 rounded"
                      />
                      <span className="whitespace-nowrap">{pkg} Package</span>
                    </button>
                  ))
              ) : (
                <div className="w-full text-center py-4 bg-gray-100 rounded-lg text-gray-600">
                  No packages available for this selection
                </div>
              )}
            </div>

            {/* Meal Items Grid */}
            {selectedPackage ? (
              <>
                <h1 className="font-bold text-xl text-orange-700 mb-2 capitalize">
                  {selectedMealType} for {selectedPackage}
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedMealType === "breakfast" &&
                    (packageData?.breakfast?.[selectedPackage]?.length > 0 ? (
                      packageData.breakfast[selectedPackage].map((item) => (
                        <div
                          key={item.id}
                          className="p-4 border rounded-xl border-orange-200 bg-white"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                          <h3 className="font-semibold text-orange-700 mb-2">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4">
                            {item.items.join(", ")}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">{item.price}</span>
                            {cart[item.id] ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    const newQuantity =
                                      cart[item.id].quantity - 1;
                                    updateQuantity(
                                      item.id,
                                      newQuantity < 10 && newQuantity !== 0
                                        ? 10
                                        : newQuantity
                                    );
                                  }}
                                  className="bg-orange-500 text-white rounded-full p-1"
                                >
                                  <Minus size={16} />
                                </button>
                                <input
                                  type="number"
                                  value={
                                    quantityInputs[item.id] ||
                                    cart[item.id].quantity
                                  }
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      item.id,
                                      e.target.value
                                    )
                                  }
                                  onBlur={() => handleBlur(item.id)}
                                  className="w-16 text-center border rounded"
                                  min="10"
                                  step="1"
                                />
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.id,
                                      cart[item.id].quantity + 1
                                    )
                                  }
                                  className="bg-orange-500 text-white rounded-full p-1"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(item)}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg"
                              >
                                Add
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="w-full text-center py-4 bg-gray-100 rounded-lg text-gray-600">
                        No packages available for this selection
                      </div>
                    ))}

                  {selectedMealType !== "breakfast" &&
                    (packageData?.[selectedMealType]?.[selectedPackage]?.[
                      isVeg ? "veg" : "nonVeg"
                    ]?.length > 0 ? (
                      packageData[selectedMealType][selectedPackage][
                        isVeg ? "veg" : "nonVeg"
                      ].map((item) => (
                        <div
                          key={item.id}
                          className={`p-4 border rounded-xl bg-white ${
                            isVeg ? "border-green-200" : "border-red-200"
                          }`}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                          <h3
                            className={`font-semibold mb-2 ${
                              isVeg ? "text-green-700" : "text-red-700"
                            }`}
                          >
                            {item.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4">
                            {item.items.join(", ")}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={`border-2 ${
                                  isVeg ? "border-green-500" : "border-red-500"
                                } p-1 rounded`}
                              >
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    isVeg ? "bg-green-500" : "bg-red-500"
                                  }`}
                                ></div>
                              </div>
                              <span className="font-semibold">
                                {item.price}
                              </span>
                            </div>
                            {cart[item.id] ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    const newQuantity =
                                      cart[item.id].quantity - 1;
                                    updateQuantity(
                                      item.id,
                                      newQuantity < 10 && newQuantity !== 0
                                        ? 10
                                        : newQuantity
                                    );
                                  }}
                                  className={`${
                                    isVeg ? "bg-green-500" : "bg-red-500"
                                  } text-white rounded-full p-1`}
                                >
                                  <Minus size={16} />
                                </button>
                                <input
                                  type="number"
                                  value={
                                    quantityInputs[item.id] ||
                                    cart[item.id].quantity
                                  }
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      item.id,
                                      e.target.value
                                    )
                                  }
                                  onBlur={() => handleBlur(item.id)}
                                  className="w-16 text-center border rounded"
                                  min="10"
                                  step="1"
                                />
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.id,
                                      cart[item.id].quantity + 1
                                    )
                                  }
                                  className={`${
                                    isVeg ? "bg-green-500" : "bg-red-500"
                                  } text-white rounded-full p-1`}
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(item)}
                                className={`px-4 py-2 ${
                                  isVeg ? "bg-green-500" : "bg-red-500"
                                } text-white rounded-lg`}
                              >
                                Add
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="w-full text-center py-4 bg-gray-100 rounded-lg text-gray-600">
                        No packages available for this selection
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 text-lg">
                  Please select a package to view available items
                </p>
              </div>
            )}
          </div>

          {/* Right Column - 20% */}
          <div className="col-span-2">
            {Object.keys(cart).length > 0 ? (
              <div className="bg-white rounded-lg shadow p-4 sticky top-24">
                <h3 className="text-lg font-semibold mb-4">Cart Summary</h3>

                {Object.entries(getGroupedCart()).map(
                  ([packageType, items]) => (
                    <div key={packageType} className="mb-6 last:mb-4">
                      <div className="flex items-center gap-3 mb-3 bg-gray-50 p-3 rounded-lg">
                        <img
                          src={getPackageImage(packageType)}
                          alt={packageType}
                          className="w-16 h-16 object-contain"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {packageType} Package
                          </h4>
                          <p className="text-sm text-gray-600">
                            {items.length}{" "}
                            {items.length === 1 ? "item" : "items"}
                          </p>
                        </div>
                      </div>

                      {items.map(({ itemId, details, quantity }) => (
                        <div key={itemId} className="mb-3 last:mb-0 pl-3">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-medium text-gray-700">
                              {details.name}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {details.price}
                              </span>
                              <button
                                onClick={() => removeFromCart(itemId)}
                                className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">
                                Quantity: {quantityInputs[itemId] || quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}

                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      placeholder="Enter coupon code"
                      className="flex-1 border rounded-lg px-3 py-2 text-sm"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      Apply
                    </button>
                  </div>
                  {error && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  {appliedCoupon && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm flex justify-between items-center">
                      <span>{appliedCoupon.description}</span>
                      <button
                        onClick={removeCoupon}
                        className="p-1 hover:bg-green-100 rounded-full"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-t mt-4 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{calculateCartTotal()}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-₹{calculateDiscount()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>GST ({gstPercentage}%)</span>
                    <span>₹{calculateGST()}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>
                      ₹
                      {calculateCartTotal() -
                        calculateDiscount() +
                        calculateGST()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  Proceed to Checkout
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-4 text-center text-gray-600">
                Your cart is empty
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealBox;
