import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Coffee, Sun, Moon, Plus, Minus } from "lucide-react";
import CheckOutform from "./CheckOutform";
import ScrollToTop from "./ScrollToTop";

const packageImages = {
    "3CP": "https://new.caterninja.com/PackedMealBox/3cp.png",
    "4CP": "https://new.caterninja.com/PackedMealBox/3cp.png",
    "5CP": "https://new.caterninja.com/PackedMealBox/5cp.png",
    "6CP": "https://new.caterninja.com/PackedMealBox/8cp.png",
};

const MealBox = () => {
    const navigate = useNavigate();
    const [selectedMealType, setSelectedMealType] = useState("breakfast");
    const [selectedPackage, setSelectedPackage] = useState("3CP");
    const [isVeg, setIsVeg] = useState(true);
    const [cart, setCart] = useState({});
    const [showCheckout, setShowCheckout] = useState(false);
    const [mealData, setMealData] = useState([]);

    useEffect(() => {
        const fetchMealData = async () => {
            try {
                const response = await fetch("https://mahaspice.desoftimp.com/ms3/cptypes.php");
                const data = await response.json();
                // Filter out items where is_superfast is "Yes"
                const filteredData = data.filter(item => item.is_superfast === "No");
                setMealData(filteredData);
            } catch (error) {
                console.error("Error fetching meal data:", error);
            }
        };

        fetchMealData();
    }, []);

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
                    package: item.cp_type,
                    mealType: item.meal_time.toLowerCase(),
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
            const itemPrice = parseFloat(itemData.details.price);
            return total + itemPrice * itemData.quantity;
        }, 0);
    };

    const calculateGST = () => {
        return Math.round(calculateCartTotal() * 0.18);
    };

    const filteredMealItems = mealData.filter(item => 
        item.meal_time.toLowerCase() === selectedMealType &&
        item.cp_type.toUpperCase() === selectedPackage &&
        ((isVeg && item.veg_non_veg === "Veg") || (!isVeg && item.veg_non_veg === "Non-Veg"))
    );

    const renderMealItems = () => {
        return filteredMealItems.map((item) => (
            <div key={item.id} className="p-4 border rounded-xl flex items-center justify-between border-orange-200">
                <div className="flex items-center">
                    <img
                        src={`https://mahaspice.desoftimp.com/ms3${item.image_address}`}
                        alt={item.cp_name}
                        className="w-24 h-24 object-cover rounded-lg mr-4"
                    />
                    <div>
                        <h3 className="font-semibold text-orange-700">{item.cp_name}</h3>
                        <p className="text-gray-600 w-15 mb-3">{item.description}</p>
                        <div className="flex items-center gap-2 text-gray-600">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">₹{item.price}</span>
                                <div className={`border-2 ${
                                    item.veg_non_veg === "Veg" ? "border-green-500" : "border-red-500"
                                } p-1 rounded`}>
                                    <div className={`w-3 h-3 rounded-full ${
                                        item.veg_non_veg === "Veg" ? "bg-green-500" : "bg-red-500"
                                    }`}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {cart[item.id] ? (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => updateQuantity(item.id, cart[item.id].quantity - 1)}
                            className="bg-orange-500 text-white rounded-full p-1"
                        >
                            <Minus size={16} />
                        </button>
                        <span>{cart[item.id].quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.id, cart[item.id].quantity + 1)}
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
    };

    // Get unique package types from the filtered data
    const availablePackages = [...new Set(mealData.map(item => item.cp_type.toUpperCase()))];

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
                            <div className="mb-6">
                                <div className="w-full bg-gray-200 p-1 rounded-full relative flex items-center cursor-pointer mb-4">
                                    <motion.div
                                        className="absolute left-0 top-0 bottom-0 w-1/2 rounded-full bg-white shadow-md"
                                        animate={{
                                            x: isVeg ? 0 : "100%",
                                            backgroundColor: isVeg ? "#14cc2a" : "#EF4444",
                                        }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    />
                                    <div
                                        className="w-full flex justify-between text-sm z-10 relative"
                                        onClick={() => setIsVeg(!isVeg)}
                                    >
                                        <div className={`flex-1 text-center py-2 px-4 text-sm rounded-full transition-colors ${
                                            isVeg ? "text-white font-semibold" : "text-gray-700 font-medium"
                                        }`}>
                                            Veg
                                        </div>
                                        <div className={`flex-1 text-center py-2 px-4 text-sm rounded-full transition-colors ${
                                            !isVeg ? "text-white font-semibold" : "text-gray-700 font-medium"
                                        }`}>
                                            NonVeg
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-lg font-semibold mb-4">Package Type</h2>
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
                                            src={packageImages[pkg]}
                                            alt={`${pkg} Package`}
                                            className="w-1/3 h-auto mb-2 rounded"
                                        />
                                        {pkg} Package
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Middle Column - Menu Items */}
                    <div className="col-span-7">
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="space-y-4">
                                {renderMealItems()}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Cart */}
                    <div className="col-span-3">
                        {Object.keys(cart).length > 0 && (
                            <div className="bg-white rounded-lg shadow p-4 sticky top-24">
                                <h3 className="text-lg font-semibold mb-4">Cart Summary</h3>
                                {Object.entries(cart).map(([itemId, itemData]) => (
                                    <div key={itemId} className="mb-4">
                                        <div className="flex justify-between mb-2 text-sm">
                                            <span>{itemData.details.cp_name} ({itemData.quantity})</span>
                                            <span className="font-medium">₹{itemData.details.price}</span>
                                        </div>
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
                                    onClick={() => setShowCheckout(true)}
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