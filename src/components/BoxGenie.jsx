import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Coffee, Sun, Moon, Plus, Minus } from "lucide-react";
import CheckOutform from "./CheckOutform";
import ScrollToTop from "./ScrollToTop";

const packageData = {
    breakfast: {
        "3CP": [
            {
                id: "b1",
                name: "South Indian Breakfast",
                image: "https://5.imimg.com/data5/AH/LH/SZ/SELLER-5331327/dinearth-10-3cp-11-4cp-round-plate-500x500.jpg",
                items: ["Idli", "Vada", "Chutney", "Coffee"],
                price: "₹200",
                rating: 4.5,
                time: "30 mins",
            },
            {
                id: "b2",
                name: "Continental Breakfast",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8LKxWwfFgeTFHaXaxvXAVYbihR62TU7rIZA&s",
                items: ["Bread", "Eggs", "Cereals", "Juice"],
                price: "₹250",
                rating: 4.6,
                time: "35 mins",
            },
            {
                id: "b3",
                name: "Healthy Morning",
                image: "https://www.eatingwell.com/thmb/eMVOdsl3W0lRYj4Vyo9QlJGnLFE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/ewl-251317-oatmeal-with-fruit-nuts-4000x2700-1661582aac034fa1ab3f1c1442b8b4d7.jpg",
                items: ["Oatmeal", "Fruits", "Nuts", "Green Tea"],
                price: "₹220",
                rating: 4.4,
                time: "25 mins",
            }
        ],
        "5CP": [
            {
                id: "b4",
                name: "Premium Breakfast Combo",
                image: "https://e7.pngegg.com/pngimages/464/169/png-clipart-masala-dosa-south-indian-cuisine-idli-dish-soup-food-thumbnail.png",
                items: ["Masala Dosa", "Upma", "Pongal", "Coffee", "Fruits"],
                price: "₹350",
                rating: 4.7,
                time: "40 mins",
            },
            {
                id: "b5",
                name: "Executive Breakfast",
                image: "https://i.ytimg.com/vi/N3seYS1Vc44/maxresdefault.jpg",
                items: ["Poha", "Paratha", "Yogurt", "Juice", "Fruits"],
                price: "₹380",
                rating: 4.8,
                time: "45 mins",
            }
        ],
        "8CP": [
            {
                id: "b6",
                name: "Deluxe Breakfast Feast",
                image: "https://m.media-amazon.com/images/I/71eeCcPX9ZL._AC_UF894,1000_QL80_.jpg",
                items: ["Masala Dosa", "Poori", "Kesari Bath", "Coffee", "Fruits", "Juice", "Chutney", "Sambar"],
                price: "₹450",
                rating: 4.8,
                time: "45 mins",
            },
            {
                id: "b7",
                name: "Grand Morning Platter",
                image: "https://www.shutterstock.com/image-photo/group-south-indian-food-dosa-260nw-388496599.jpg",
                items: ["Idli", "Vada", "Dosa", "Upma", "Pongal", "Coffee", "Juice", "Fruits"],
                price: "₹480",
                rating: 4.9,
                time: "50 mins",
            }
        ]
    },
    lunch: {
        "3CP": {
            veg: [
                {
                    id: "l1",
                    name: "Classic Veg Lunch",
                    image: "https://5.imimg.com/data5/SELLER/Default/2023/2/BX/WK/QF/5331327/3cp-meal-tray-natraj-1000x1000.jpg",
                    items: ["Veg Biryani", "Raita", "Dal"],
                    price: "₹300",
                    rating: 4.5,
                    time: "45 mins",
                },
                {
                    id: "l2",
                    name: "North Indian Veg",
                    image: "https://neeyog.com/wp-content/uploads/2018/12/Screenshot_20190302-103929_Instagram.jpg",
                    items: ["Roti", "Paneer Curry", "Dal"],
                    price: "₹320",
                    rating: 4.6,
                    time: "40 mins",
                }
            ],
            nonVeg: [
                {
                    id: "l3",
                    name: "Classic Non-Veg Lunch",
                    image: "https://neeyog.com/wp-content/uploads/2018/12/Screenshot_20190302-103929_Instagram.jpg",
                    items: ["Chicken Biryani", "Raita", "Gravy"],
                    price: "₹350",
                    rating: 4.7,
                    time: "50 mins",
                },
                {
                    id: "l4",
                    name: "Grilled Chicken Meal",
                    image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_366/RX_THUMBNAIL/IMAGES/VENDOR/2024/10/18/ff22d08e-8419-4e1f-b1a9-4aaed9f7b716_387620.jpg",
                    items: ["Grilled Chicken", "Rice", "Curry"],
                    price: "₹380",
                    rating: 4.6,
                    time: "45 mins",
                }
            ]
        },
        "5CP": {
            veg: [
                {
                    id: "l5",
                    name: "Premium Veg Thali",
                    image: "https://5.imimg.com/data5/SELLER/Default/2023/2/YX/EA/JD/5331327/5cp-meal-tray-natraj-white.jpg",
                    items: ["Rice", "Dal", "Paneer", "Roti", "Dessert"],
                    price: "₹400",
                    rating: 4.8,
                    time: "55 mins",
                }
            ],
            nonVeg: [
                {
                    id: "l6",
                    name: "Premium Non-Veg Thali",
                    image: "https://neeyog.com/wp-content/uploads/2018/12/Screenshot_20181122-232956_Zomato.jpg",
                    items: ["Biryani", "Chicken Curry", "Roti", "Raita", "Dessert"],
                    price: "₹450",
                    rating: 4.8,
                    time: "60 mins",
                }
            ]
        },
        "8CP": {
            veg: [
                {
                    id: "l7",
                    name: "Deluxe Veg Feast",
                    image: "https://5.imimg.com/data5/SELLER/Default/2024/2/390739195/ON/KY/XL/12882037/8cp-meal-tray-250x250.jpeg",
                    items: ["Rice", "Dal", "Paneer", "Roti", "Curry", "Salad", "Raita", "Dessert"],
                    price: "₹500",
                    rating: 4.9,
                    time: "65 mins",
                }
            ],
            nonVeg: [
                {
                    id: "l8",
                    name: "Royal Non-Veg Feast",
                    image: "https://cheetah.cherishx.com/uploads/1722579633_large.jpg",
                    items: ["Biryani", "Chicken", "Fish", "Roti", "Dal", "Salad", "Raita", "Dessert"],
                    price: "₹600",
                    rating: 4.9,
                    time: "70 mins",
                }
            ]
        }
    },
    dinner: {
        "3CP": {
            veg: [
                {
                    id: "d1",
                    name: "Light Veg Dinner",
                    image: "https://b.zmtcdn.com/data/dish_photos/34e/a46d8562780d21a8d4809814e7da134e.jpeg",
                    items: ["Roti", "Dal", "Sabzi"],
                    price: "₹280",
                    rating: 4.5,
                    time: "40 mins",
                },
                {
                    id: "d2",
                    name: "Healthy Veg Bowl",
                    image: "https://5.imimg.com/data5/SELLER/Default/2024/7/433427466/FL/GI/JO/3869089/3cp-meal-tray.jpeg",
                    items: ["Mixed Veg", "Brown Rice", "Soup"],
                    price: "₹300",
                    rating: 4.6,
                    time: "35 mins",
                }
            ],
            nonVeg: [
                {
                    id: "d3",
                    name: "Classic Non-Veg Dinner",
                    image: "https://5.imimg.com/data5/SELLER/Default/2023/2/PG/UI/UN/5331327/3cp-oracle-meal-tray-500x500.jpg",
                    items: ["Chicken Curry", "Roti", "Salad"],
                    price: "₹350",
                    rating: 4.7,
                    time: "45 mins",
                }
            ]
        },
        "5CP": {
            veg: [
                {
                    id: "d4",
                    name: "Premium Veg Dinner",
                    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRacW513-BQ7g1YAh_eOGHD4ZXuhb03sKI6INIzhqMoOJFOZ3rOP8wn93kgoftJJ9IypMQ&usqp=CAU",
                    items: ["Paneer", "Roti", "Dal", "Rice", "Dessert"],
                    price: "₹400",
                    rating: 4.8,
                    time: "50 mins",
                }
            ],
            nonVeg: [
                {
                    id: "d5",
                    name: "Premium Non-Veg Dinner",
                    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRacW513-BQ7g1YAh_eOGHD4ZXuhb03sKI6INIzhqMoOJFOZ3rOP8wn93kgoftJJ9IypMQ&usqp=CAU",
                    items: ["Butter Chicken", "Roti", "Dal", "Rice", "Dessert"],
                    price: "₹450",
                    rating: 4.8,
                    time: "55 mins",
                }
            ]
        },
        "8CP": {
            veg: [
                {
                    id: "d6",
                    name: "Royal Veg Dinner",
                    image: "https://imgmedia.lbb.in/media/2019/10/5d9a756aff37ab388e154d0a_1570403690976.jpg",
                    items: ["Paneer", "Roti", "Dal", "Rice", "Curry", "Salad", "Raita", "Dessert"],
                    price: "₹500",
                    rating: 4.9,
                    time: "60 mins",
                }
            ],
            nonVeg: [
                {
                    id: "d7",
                    name: "Royal Non-Veg Dinner",
                    image: "https://example.com/dinner7.jpg",
                    items: ["Mutton", "Chicken", "Roti", "Rice", "Dal", "Salad", "Raita", "Dessert"],
                    price: "₹600",
                    rating: 4.9,
                    time: "65 mins",
                }
            ]
        }
    }
};

const packageImages = {
    "3CP": "https://new.caterninja.com/PackedMealBox/3cp.png",
    "5CP": "https://new.caterninja.com/PackedMealBox/5cp.png",
    "8CP": "https://new.caterninja.com/PackedMealBox/8cp.png",
};

const MealBox = () => {
    const navigate = useNavigate();
    const [selectedMealType, setSelectedMealType] = useState("breakfast");
    const [selectedPackage, setSelectedPackage] = useState("3CP");
    const [isVeg, setIsVeg] = useState(true);
    const [cart, setCart] = useState({});
    const [showCheckout, setShowCheckout] = useState(false);

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


    const renderMealItems = () => {
        if (selectedMealType === "breakfast") {
            return packageData.breakfast[selectedPackage].map((item) => (
                <div key={item.id} className="p-4 border rounded-xl flex items-center justify-between border-orange-200">
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
                                    <span className="text-sm text-gray-500">• ★ {item.rating}</span>
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
        } else {
            const items = packageData[selectedMealType][selectedPackage][isVeg ? "veg" : "nonVeg"];
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
                            <h3 className={`font-semibold ${isVeg ? "text-green-700" : "text-red-700"}`}>
                                {item.name}
                            </h3>
                            <p className="text-gray-600 w-15 mb-3">{item.items.join(", ")}</p>
                            <div className="flex items-center gap-2 text-gray-600">
                                <div className={`border-2 ${
                                    isVeg ? "border-green-500" : "border-red-500"
                                } p-1 rounded`}>
                                    <div className={`w-3 h-3 rounded-full ${
                                        isVeg ? "bg-green-500" : "bg-red-500"
                                    }`}></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{item.price}</span>
                                    <span className="text-sm text-gray-500">• {item.time}</span>
                                    <span className="text-sm text-gray-500">• ★ {item.rating}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {cart[item.id] ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => updateQuantity(item.id, cart[item.id].quantity - 1)}
                                className={`${isVeg ? "bg-green-500" : "bg-red-500"} text-white rounded-full p-1`}
                            >
                                <Minus size={16} />
                            </button>
                            <span>{cart[item.id].quantity}</span>
                            <button
                                onClick={() => updateQuantity(item.id, cart[item.id].quantity + 1)}
                                className={`${isVeg ? "bg-green-500" : "bg-red-500"} text-white rounded-full p-1`}
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
                            )}

                            <h2 className="text-lg font-semibold mb-4">Package Type</h2>
                            <div className="space-y-3">
                                {Object.keys(packageData[selectedMealType]).map((pkg) => (
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
                                {Object.entries(groupedCartItems).map(([pkg, items]) => (
                                    <div key={pkg} className="mb-4">
                                        <div className="flex items-center mb-2">
                                            <img
                                                src={packageImages[pkg]}
                                                alt={`${pkg} Package`}
                                                className="w-12 h-12 mr-2 object-contain"
                                            />
                                            <h4 className="font-semibold">{pkg} Package</h4>
                                        </div>
                                        {items.map(({ itemId, details, quantity }) => (
                                            <div key={itemId} className="flex justify-between mb-2 text-sm">
                                                <span>{details.name} ({quantity})</span>
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
