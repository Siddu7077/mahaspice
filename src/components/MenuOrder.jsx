import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DELIVERY_FEE = 500;
const CATERING_STAFF_BASE_PRICE = 500;
const TABLE_BASE_PRICE = 200;

const MenuOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    selectedItems,
    extraItems,
    platePrice,
    userBasicDetails,
    guestCount,
  } = location.state || {};

  // Calculate base staff count
  const calculateBaseStaff = () => {
    return Math.max(2, Math.ceil(guestCount / 100));
  };

  const [userDetails, setUserDetails] = useState({
    fullName: userBasicDetails?.name || "",
    email: "",
    phoneNumber: userBasicDetails?.phone || "",
    alternateNumber: "",
    city: "",
    address: "",
    date: "",
    time: "",
    numberOfTables: 1,
    numberOfCateringStaff: calculateBaseStaff(),
    additionalStaff: 0
  });

  // Time slots
  const timeSlots = [
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
  ];

  // Date validation
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    // Calculate minimum date based on guest count
    const today = new Date();
    let daysToSkip = 0;

    if (guestCount > 200) {
      daysToSkip = 3;
    } else if (guestCount > 100) {
      daysToSkip = 2;
    }

    const minAllowedDate = new Date(today);
    minAllowedDate.setDate(today.getDate() + daysToSkip);

    // Format date as YYYY-MM-DD
    const formattedMinDate = minAllowedDate.toISOString().split("T")[0];
    setMinDate(formattedMinDate);
  }, [guestCount]);

  // Calculate additional costs
  const calculateAdditionalCosts = () => {
    // Base staff required
    const baseStaff = Math.max(2, Math.ceil(guestCount / 100));

    // Additional staff cost
    const additionalStaff = Math.max(0, userDetails.additionalStaff);
    const staffCost = additionalStaff * CATERING_STAFF_BASE_PRICE;
    const staffCost2 = baseStaff * CATERING_STAFF_BASE_PRICE;

    // Additional tables cost (min 1 table per 50 guests)
    const requiredTables = Math.max(1, Math.ceil(guestCount / 50));
    const additionalTables = Math.max(
      0,
      userDetails.numberOfTables - requiredTables
    );
    const tablesCost = additionalTables * TABLE_BASE_PRICE;
    const tablesCost2 = requiredTables * TABLE_BASE_PRICE;

    return { 
      staffCost, 
      staffCost2, 
      tablesCost, 
      tablesCost2, 
      totalStaff: baseStaff + additionalStaff 
    };
  };

  const calculatePrices = () => {
    const { staffCost,staffCost2, tablesCost,tablesCost2, totalStaff } = calculateAdditionalCosts();
    const extraItemsTotal = Object.values(extraItems || {}).flat().length * 50;
    const subtotal =
      platePrice * guestCount + extraItemsTotal +staffCost2+staffCost+tablesCost2+tablesCost ;
    const gst = subtotal * 0.18;
    const total = subtotal + gst + DELIVERY_FEE;

    return { subtotal, gst, total, staffCost,staffCost2, tablesCost,tablesCost2, totalStaff };
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;

    // Special handling for tables
    if (name === "numberOfTables") {
      // Minimum tables based on guest count
      const requiredTables = Math.max(1, Math.ceil(guestCount / 50));
      const parsedValue = Math.max(requiredTables, Number(value));

      setUserDetails((prev) => ({
        ...prev,
        [name]: parsedValue,
      }));
      return;
    }

    // Special handling for additional staff
    if (name === "additionalStaff") {
      const parsedValue = Math.max(0, Number(value));

      setUserDetails((prev) => ({
        ...prev,
        [name]: parsedValue,
      }));
      return;
    }

    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { subtotal, gst, total, staffCost,staffCost2, tablesCost,tablesCost2, totalStaff } = calculatePrices();

  const submitOrder = () => {
    // Validate user details
    const requiredFields = [
      "fullName",
      "email",
      "phoneNumber",
      "city",
      "address",
      "date",
      "time",
    ];
    const missingFields = requiredFields.filter((field) => !userDetails[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    // Prepare message for WhatsApp
    const message = encodeURIComponent(
      `Catering Order Details:\n\n` +
        `Customer Details:\n` +
        `Name: ${userDetails.fullName}\n` +
        `Email: ${userDetails.email}\n` +
        `Phone: ${userDetails.phoneNumber}\n` +
        `Alternate Number: ${userDetails.alternateNumber || "Not Provided"}\n` +
        `City: ${userDetails.city}\n` +
        `Address: ${userDetails.address}\n` +
        `Event Date: ${userDetails.date}\n` +
        `Event Time: ${userDetails.time}\n\n` +
        `Order Summary:\n` +
        `Plate Price: ₹${platePrice}\n` +
        `Guests: ${guestCount}\n` +
        `Total Catering Staff: ${totalStaff}\n` +
        `Subtotal: ₹${subtotal.toFixed(2)}\n` +
        `GST (18%): ₹${gst.toFixed(2)}\n` +
        `Delivery Fee: ₹${DELIVERY_FEE}\n` +
        `Total: ₹${total.toFixed(2)}\n\n` +
        `Selected Items:\n` +
        Object.entries(selectedItems || {})
          .map(
            ([section, items]) =>
              `${section.toUpperCase()}:\n${
                (items || []).map((item) => `- ${item}`).join("\n") || "None"
              }`
          )
          .join("\n")
    );

    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/917288041656?text=${message}`, "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid  md:grid-cols-2 gap-8">
        {/* Order Details Form */}
        <div className="bg-white h-fit p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-green-700">
            Complete Your Order
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name*"
              value={userDetails.fullName}
              onChange={handleDetailsChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email*"
              value={userDetails.email}
              onChange={handleDetailsChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number*"
              value={userDetails.phoneNumber}
              onChange={handleDetailsChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="tel"
              name="alternateNumber"
              placeholder="Alternate Number"
              value={userDetails.alternateNumber}
              onChange={handleDetailsChange}
              className="w-full p-2 border rounded"
            />
            <select
              name="city"
              value={userDetails.city}
              onChange={handleDetailsChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select City*</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Chennai">Chennai</option>
              <option value="Pune">Pune</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Other">Other</option>
            </select>
            <textarea
              name="address"
              placeholder="Full Address*"
              value={userDetails.address}
              onChange={handleDetailsChange}
              className="w-full p-2 border rounded"
              required
            />
            <div className="flex space-x-4">
              <input
                type="date"
                name="date"
                value={userDetails.date}
                onChange={handleDetailsChange}
                min={minDate}
                className="w-full p-2 border rounded"
                required
              />

              {/* Time Dropdown */}
              <select
                name="time"
                value={userDetails.time}
                onChange={handleDetailsChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Time Slot*</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            {/* Number of Tables */}
            <div className="flex items-center space-x-4">
              <label className="w-full">
                Number of Tables
                <span className="text-sm text-gray-500 block">
                  Minimum {Math.max(1, Math.ceil(guestCount / 50))} tables
                  required
                </span>
              </label>
              <input
                type="number"
                name="numberOfTables"
                value={userDetails.numberOfTables}
                onChange={handleDetailsChange}
                min={Math.max(Math.ceil(guestCount / 50))}
                className="w-20 p-2 border rounded"
                required
              />
            </div>
            <div className=" p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold">
                  Catering Staff
                  <span className="text-sm text-gray-500 block">
                    Base staff: {calculateBaseStaff()} (1 per 100 guests)
                  </span>
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Additional Staff:</span>
                  <input
                    type="number"
                    name="additionalStaff"
                    value={userDetails.additionalStaff}
                    onChange={handleDetailsChange}
                    min="0"
                    className="w-20 p-2 border rounded"
                  />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Total Staff: {totalStaff} | Additional Staff Cost: ₹{staffCost}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-green-50 p-6 rounded-lg h-fit overflow-scroll">
          <h3 className="text-xl font-bold mb-4 text-green-700">
            Order Summary
          </h3>

          {/* Guest Count Display */}
          <div className="mb-4">
            <div className="flex justify-between">
              <span className="font-semibold">Number of Guests</span>
              <span>{guestCount}</span>
            </div>
          </div>

          {/* Detailed Selected Items */}
          <div className="mb-4 h-[300px] border bottom-3 border-black rounded-md p-2 overflow-scroll">
            <h4 className="text-lg font-semibold mb-2">Selected Items</h4>
            {Object.entries(selectedItems || {}).map(
              ([section, items]) =>
                items.length > 0 && (
                  <div key={section} className="mb-2">
                    <h5 className="font-medium text-green-600 capitalize">
                      {section.replace(/([A-Z])/g, " $1").toLowerCase()}
                    </h5>
                    <ul className="list-disc list-inside text-sm">
                      {items.map((item, index) => (
                        <li key={index}>
                          {item}
                          {extraItems[section]?.includes(item) && (
                            <span className="text-red-500 ml-2 text-xs">
                              {" "}
                              (Extra Item)
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
            )}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Plate Price</span>
              <span>₹{platePrice.toFixed(2)}</span>
            </div>
            {Object.values(extraItems || {}).flat().length > 0 && (
              <div className="flex justify-between">
                <span>Extra Items</span>
                <span>
                  ₹
                  {(Object.values(extraItems || {}).flat().length * 50).toFixed(
                    2
                  )}
                </span>
              </div>
            )}

            {/* Additional costs breakdown */}
            {staffCost > 0 && (
              <div className="flex justify-between">
                <span>Additional Catering Staff</span>
                <span>₹{staffCost.toFixed(2)}</span>
              </div>
            )}
            
            
              <div className="flex justify-between">
                <span>Tables Cost</span>
                <span>₹{tablesCost2}</span>
              </div>
              
              <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

              {tablesCost > 0 && (
              <div className="flex justify-between">
                <span>Additional Tables</span>
                <span>₹{tablesCost}</span>
              </div>
            )}

            

            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{DELIVERY_FEE}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit Order Button */}
          <button
            onClick={submitOrder}
            className="w-full mt-6 bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition duration-300"
          >
            Submit Order via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuOrder;
