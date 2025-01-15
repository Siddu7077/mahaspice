import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Coffee, Sun, Moon, Plus, Minus } from "lucide-react";
import CheckOutform from "./CheckOutform";
import ScrollToTop from "./ScrollToTop";

const transformApiData = (apiData) => {
  // Get unique CP types from the API data
  const cpTypes = [
    ...new Set(apiData.map((item) => item.cp_type.toUpperCase())),
  ];

  const transformed = {
    breakfast: {},
    lunch: {},
    dinner: {},
  };

  // Initialize the structure with discovered CP types
  cpTypes.forEach((cpType) => {
    transformed.breakfast[cpType] = [];
    transformed.lunch[cpType] = { veg: [], nonVeg: [] };
    transformed.dinner[cpType] = { veg: [], nonVeg: [] };
  });

  // Transform the data
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
  // Default image if specific type not found
  const defaultImage = "https://new.caterninja.com/PackedMealBox/3cp.png";

  // Map of package types to images
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
  const [cart, setCart] = useState({});
  const [showCheckout, setShowCheckout] = useState(false);

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
        setSelectedPackage(cpTypes[0]); // Set first CP type as default
      } catch (error) {
        console.error("Error fetching package data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (packageData) {
      const availablePackages = getAvailablePackages();
      if (
        availablePackages.length > 0 &&
        !availablePackages.includes(selectedPackage)
      ) {
        setSelectedPackage(availablePackages[0]);
      }
    }
  }, [selectedMealType, isVeg, packageData]);

  const getAvailablePackages = () => {
    if (!packageData) return [];

    return Object.keys(packageData[selectedMealType]).filter((pkg) => {
      if (selectedMealType === "breakfast") {
        return packageData[selectedMealType][pkg].length > 0;
      } else {
        const hasVegItems = packageData[selectedMealType][pkg].veg.length > 0;
        const hasNonVegItems =
          packageData[selectedMealType][pkg].nonVeg.length > 0;
        return isVeg ? hasVegItems : hasNonVegItems;
      }
    });
  };

  if (!packageData) {
    return <div>Loading...</div>;
  }
  if (showCheckout) {
    return <CheckOutform cart={cart} onBack={() => setShowCheckout(false)} />;
  }

  const addToCart = (item) => {
    setCart((prevCart) => {
      const currentItem = prevCart[item.id] || { quantity: 0, details: item };
      return {
        ...prevCart,
        [item.id]: {
          quantity: currentItem.quantity + 1,
          details: item,
          package: selectedPackage,
          mealType: selectedMealType,
        },
      };
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    setCart((prevCart) => {
      if (newQuantity === 0) {
        const { [itemId]: removedItem, ...restCart } = prevCart;
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
  };

  const calculateCartTotal = () => {
    return Object.entries(cart).reduce((total, [itemId, itemData]) => {
      const itemPrice = parseFloat(itemData.details.price.replace("₹", ""));
      return total + itemPrice * itemData.quantity;
    }, 0);
  };

  const calculateGST = () => {
    return Math.round(calculateCartTotal() * 0.18);
  };

  const groupedCartItems = Object.entries(cart).reduce(
    (groups, [itemId, itemData]) => {
      const pkg = itemData.package;
      if (!groups[pkg]) {
        groups[pkg] = [];
      }
      groups[pkg].push({ itemId, ...itemData });
      return groups;
    },
    {}
  );

  const handleCheckout = () => {
    if (Object.keys(cart).length === 0) {
      alert("Your cart is empty!");
      return;
    }
    setShowCheckout(true);
  };

  if (showCheckout) {
    return (
      <CheckOutform
        cart={cart}
        onBack={() => setShowCheckout(false)}
        cartTotal={calculateCartTotal()}
        gstAmount={calculateGST()}
        totalAmount={calculateCartTotal() + calculateGST()}
      />
    );
  }

  const renderPackageButtons = () => {
    const availablePackages = getAvailablePackages();

    return (
      <div className="space-y-3">
        {availablePackages.map((pkg) => (
          <button
            key={pkg}
            onClick={() => setSelectedPackage(pkg)}
            className={`w-full flex items-center justify-around p-4 rounded-xl border-2 text-sm transition-all ${
              selectedPackage === pkg
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-green-200"
            }`}
          >
            <img
              src={getPackageImage(pkg)}
              alt={`${pkg} Package`}
              className="w-1/3 h-auto mb-2 rounded"
            />
            {pkg} Package
          </button>
        ))}
      </div>
    );
  };
//   console.log(getAvailablePackages());

  const renderMealItems = () => {
    if (selectedMealType === "breakfast") {
      return packageData.breakfast[selectedPackage].map((item) => (
        <div
          key={item.id}
          className="p-4 border rounded-xl flex items-center justify-between border-orange-200"
        >
          <div className="flex items-center">
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-lg mr-4"
            />
            <div>
              <h3 className="font-semibold text-orange-700">{item.name}</h3>
              <p className="text-gray-600 w-15 mb-3">{item.items.join(", ")}</p>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{item.price}</span>
                  <span className="text-sm text-gray-500">• {item.time}</span>
                  <span className="text-sm text-gray-500">
                    • ★ {item.rating}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {cart[item.id] ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateQuantity(item.id, cart[item.id].quantity - 1)
                }
                className="bg-orange-500 text-white rounded-full p-1"
              >
                <Minus size={16} />
              </button>
              <span>{cart[item.id].quantity}</span>
              <button
                onClick={() =>
                  updateQuantity(item.id, cart[item.id].quantity + 1)
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
      ));
    } else {
      const items =
        packageData[selectedMealType][selectedPackage][
          isVeg ? "veg" : "nonVeg"
        ];
      return items.map((item) => (
        <div
          key={item.id}
          className={`p-4 border rounded-xl flex items-center justify-between ${
            isVeg ? "border-green-200" : "border-red-200"
          }`}
        >
          <div className="flex items-center">
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-lg mr-4"
            />
            <div>
              <h3
                className={`font-semibold ${
                  isVeg ? "text-green-700" : "text-red-700"
                }`}
              >
                {item.name}
              </h3>
              <p className="text-gray-600 w-15 mb-3">{item.items.join(", ")}</p>
              <div className="flex items-center gap-2 text-gray-600">
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
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{item.price}</span>
                  <span className="text-sm text-gray-500">• {item.time}</span>
                  <span className="text-sm text-gray-500">
                    • ★ {item.rating}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {cart[item.id] ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateQuantity(item.id, cart[item.id].quantity - 1)
                }
                className={`${
                  isVeg ? "bg-green-500" : "bg-red-500"
                } text-white rounded-full p-1`}
              >
                <Minus size={16} />
              </button>
              <span>{cart[item.id].quantity}</span>
              <button
                onClick={() =>
                  updateQuantity(item.id, cart[item.id].quantity + 1)
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
      ));
    }
  };

  if (showCheckout) {
    return (
      <CheckOutform
        cart={cart}
        calculateCartTotal={calculateCartTotal}
        calculateGST={calculateGST}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />

      {/* Header with Meal Type Selection */}
      <div className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="flex justify-center gap-4 p-4">
          <button
            onClick={() => {
              setSelectedMealType("breakfast");
              setSelectedPackage("3CP");
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
              setSelectedPackage("3CP");
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
              setSelectedPackage("3CP");
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
      </div>

      {/* Main Content Grid */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Package Selection */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow p-4">
              {selectedMealType !== "breakfast" && (
                <div className="mb-6">
                  <div className="w-full bg-gray-200 p-1 rounded-full relative flex items-center cursor-pointer mb-4">
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

              <h2 className="text-lg font-semibold mb-4">Package Type</h2>
              {renderPackageButtons()}
            </div>
          </div>

          {/* Middle Column - Menu Items */}
          <div className="col-span-7">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="space-y-4">{renderMealItems()}</div>
            </div>
          </div>

          {/* Right Column - Cart */}
          <div className="col-span-3">
            {Object.keys(cart).length > 0 && (
              <div className="bg-white rounded-lg shadow p-4 sticky top-24">
                <h3 className="text-lg font-semibold mb-4">Cart Summary</h3>
                {Object.entries(groupedCartItems).map(([pkg, items]) => (
                  <div key={pkg} className="mb-4">
                    <div className="flex items-center mb-2">
                      <img
                        src={getPackageImage(pkg)}
                        alt={`${pkg} Package`}
                        className="w-12 h-12 mr-2 object-contain"
                      />
                      <h4 className="font-semibold">{pkg} Package</h4>
                    </div>
                    {items.map(({ itemId, details, quantity }) => (
                      <div
                        key={itemId}
                        className="flex justify-between mb-2 text-sm"
                      >
                        <span>
                          {details.name} ({quantity})
                        </span>
                        <span className="font-medium">{details.price}</span>
                      </div>
                    ))}
                  </div>
                ))}

                <div className="border-t mt-4 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{calculateCartTotal()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>GST (18%)</span>
                    <span>₹{calculateGST()}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{calculateCartTotal() + calculateGST()}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealBox;
