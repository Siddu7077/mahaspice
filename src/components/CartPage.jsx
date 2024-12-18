import React, { useState } from "react";

const CartPage = () => {
  const [isVeg, setIsVeg] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState("mealbox");

  const packageData = {
    mealbox: {
      veg: [
        {
          id: 1,
          name: "Veg Mealbox A",
          items: ["Paneer", "Rice", "Dal"],
          price: "₹150",
          image: "https://5.imimg.com/data5/SELLER/Default/2023/2/BX/WK/QF/5331327/3cp-meal-tray-natraj-1000x1000.jpg",
        },
        {
          id: 2,
          name: "Veg Mealbox B",
          items: ["Vegetable Curry", "Chapati", "Rice"],
          price: "₹170",
          image: "https://5.imimg.com/data5/SELLER/Default/2023/2/BX/WK/QF/5331327/3cp-meal-tray-natraj-1000x1000.jpg",
        },
      ],
      nonVeg: [
        {
          id: 3,
          name: "Chicken Mealbox A",
          items: ["Chicken Curry", "Rice", "Dal"],
          price: "₹200",
          image: "https://5.imimg.com/data5/SELLER/Default/2023/2/BX/WK/QF/5331327/3cp-meal-tray-natraj-1000x1000.jpg",
        },
        {
          id: 4,
          name: "Chicken Mealbox B",
          items: ["Grilled Chicken", "Naan", "Salad"],
          price: "₹250",
          image: "https://5.imimg.com/data5/SELLER/Default/2023/2/BX/WK/QF/5331327/3cp-meal-tray-natraj-1000x1000.jpg",
        },
      ],
    },
    deliverybox: {
      veg: [
        {
          id: 5,
          name: "Veg Delivery Box A",
          items: ["Salad", "Rice", "Curry"],
          price: "₹180",
          image: "https://5.imimg.com/data5/SELLER/Default/2023/2/BX/WK/QF/5331327/3cp-meal-tray-natraj-1000x1000.jpg",
        },
        {
          id: 6,
          name: "Veg Delivery Box B",
          items: ["Paneer Butter Masala", "Naan", "Rice"],
          price: "₹220",
          image: "https://5.imimg.com/data5/SELLER/Default/2023/2/BX/WK/QF/5331327/3cp-meal-tray-natraj-1000x1000.jpg",
        },
      ],
      nonVeg: [
        {
          id: 7,
          name: "Non-Veg Delivery Box A",
          items: ["Fish Curry", "Rice", "Gravy"],
          price: "₹250",
          image: "https://5.imimg.com/data5/SELLER/Default/2023/2/BX/WK/QF/5331327/3cp-meal-tray-natraj-1000x1000.jpg",
        },
        {
          id: 8,
          name: "Non-Veg Delivery Box B",
          items: ["Mutton Biryani", "Salad", "Raitha"],
          price: "₹300",
          image: "https://5.imimg.com/data5/SELLER/Default/2023/2/BX/WK/QF/5331327/3cp-meal-tray-natraj-1000x1000.jpg",
        },
      ],
    },
    catering: {
      veg: [
        {
          id: 9,
          name: "Veg Catering A",
          items: ["Paneer Butter Masala", "Rice", "Naan"],
          price: "₹300",
          image: "https://5.imimg.com/data5/SELLER/Default/2023/2/BX/WK/QF/5331327/3cp-meal-tray-natraj-1000x1000.jpg",
        },
        {
          id: 10,
          name: "Veg Catering B",
          items: ["Vegetable Pulao", "Salad", "Raitha"],
          price: "₹350",
          image: "https://5.imimg.com/data5/SELLER/Default/2023/2/BX/WK/QF/5331327/3cp-meal-tray-natraj-1000x1000.jpg",
        },
      ],
      nonVeg: [
        {
          id: 11,
          name: "Non-Veg Catering A",
          items: ["Chicken Curry", "Naan", "Rice"],
          price: "₹400",
          image: "https://5.imimg.com/data5/SELLER/Default/2023/2/BX/WK/QF/5331327/3cp-meal-tray-natraj-1000x1000.jpg",
        },
        {
          id: 12,
          name: "Non-Veg Catering B",
          items: ["Mutton Curry", "Rice", "Pickles"],
          price: "₹450",
          image: "https://5.imimg.com/data5/SELLER/Default/2023/2/BX/WK/QF/5331327/3cp-meal-tray-natraj-1000x1000.jpg",
        },
      ],
    },
  };

  const handleProceedToPay = (item) => {
    console.log("Proceeding to pay for:", item);
    alert(`Proceeding to pay for ${item.name}`);
  };

  return (
    <div className="min-w-[550px] mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-7 m-4">
        {/* Package Selection */}
        <div className="flex justify-between items-center mb-6">
          <div className="space-x-4">
            {["mealbox", "deliverybox", "catering"].map((pkg) => (
              <button
                key={pkg}
                onClick={() => setSelectedPackage(pkg)}
                className={`px-4 py-2 text-white font-medium rounded-lg ${
                  selectedPackage === pkg
                    ? "bg-blue-600"
                    : "bg-gray-400 hover:bg-gray-500"
                }`}
              >
                {pkg.charAt(0).toUpperCase() + pkg.slice(1)}
              </button>
            ))}
          </div>

          {/* Veg/Non-Veg Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsVeg(true)}
              className={`px-3 py-1 rounded-lg ${
                isVeg ? "bg-green-500 text-white" : "bg-gray-300"
              }`}
            >
              Veg
            </button>
            <button
              onClick={() => setIsVeg(false)}
              className={`px-3 py-1 rounded-lg ${
                !isVeg ? "bg-red-500 text-white" : "bg-gray-300"
              }`}
            >
              Non-Veg
            </button>
          </div>
        </div>

        {/* Display All Menus */}
        <div className="grid grid-cols-1 gap-6">
          {packageData[selectedPackage][isVeg ? "veg" : "nonVeg"].map(
            (item) => (
              <div
                key={item.id}
                className="p-4 border rounded-xl flex items-center justify-between"
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
                    <p className="text-gray-600 w-15 mb-3">
                      {item.items.join(", ")}
                    </p>
                    <div className="text-gray-600">{item.price}</div>
                  </div>
                </div>

                {/* Proceed to Pay Button */}
                <button
                  onClick={() => handleProceedToPay(item)}
                  className={`px-4 py-2 ${
                    isVeg ? "bg-green-500" : "bg-red-500"
                  } text-white rounded-lg`}
                >
                  Proceed to Pay
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
