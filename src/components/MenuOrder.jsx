import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DELIVERY_FEE = 500;
const CATERING_STAFF_BASE_PRICE = 500;
const TABLE_BASE_PRICE = 200;

// Valid coupon codes and their discount percentages
const VALID_COUPONS = {
  "GSR10": 10,
  "GSR15": 15
};

const MenuOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    selectedItems = [],
    extraItems = [],
    platePrice = 0,
    guestCount = 0,
    totalAmount = 0
  } = location.state || {};

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [showCouponSuccess, setShowCouponSuccess] = useState(false);

  const calculateBaseStaff = () => {
    return Math.max(2, Math.ceil(guestCount / 100));
  };

  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    alternateNumber: "",
    city: "",
    address: "",
    date: "",
    time: "",
    numberOfTables: Math.max(1, Math.ceil(guestCount / 50)),
    numberOfCateringStaff: calculateBaseStaff(),
    additionalStaff: 0
  });

  const timeSlots = [
    "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM",
    "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"
  ];

  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const today = new Date();
    let daysToAdd = guestCount > 200 ? 3 : guestCount > 100 ? 2 : 1;
    const minAllowedDate = new Date(today);
    minAllowedDate.setDate(today.getDate() + daysToAdd);
    setMinDate(minAllowedDate.toISOString().split("T")[0]);
  }, [guestCount]);

  const calculateTotals = () => {
    const baseStaff = calculateBaseStaff();
    const additionalStaff = Math.max(0, userDetails.additionalStaff);
    const totalStaff = baseStaff + additionalStaff;
    const staffCost = totalStaff * CATERING_STAFF_BASE_PRICE;

    const requiredTables = Math.max(1, Math.ceil(guestCount / 50));
    const additionalTables = Math.max(0, userDetails.numberOfTables - requiredTables);
    const tablesCost = (requiredTables + additionalTables) * TABLE_BASE_PRICE;

    const baseCost = platePrice * guestCount;
    const extraItemsCost = extraItems.length * 50;
    
    const subtotal = baseCost + extraItemsCost + staffCost + tablesCost;
    
    let discount = 0;
    if (appliedCoupon) {
      discount = (subtotal * VALID_COUPONS[appliedCoupon]) / 100;
    }
    
    const discountedSubtotal = subtotal - discount;
    const gst = discountedSubtotal * 0.18;
    const total = discountedSubtotal + gst + DELIVERY_FEE;

    return {
      baseCost,
      extraItemsCost,
      staffCost,
      tablesCost,
      subtotal,
      discount,
      gst,
      total,
      totalStaff
    };
  };

  const handleCouponApply = () => {
    setCouponError("");
    setShowCouponSuccess(false);

    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    if (VALID_COUPONS[couponCode]) {
      setAppliedCoupon(couponCode);
      setShowCouponSuccess(true);
      setTimeout(() => setShowCouponSuccess(false), 3000);
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const requiredFields = [
      "fullName", "email", "phoneNumber", "city",
      "address", "date", "time"
    ];

    const missingFields = requiredFields.filter(field => !userDetails[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    console.log("Order submitted:", { userDetails, totals: calculateTotals() });
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Customer Details Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Customer Details</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name *"
                  value={userDetails.fullName}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  value={userDetails.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number *"
                  value={userDetails.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md"
                />
                <input
                  type="tel"
                  name="alternateNumber"
                  placeholder="Alternate Number"
                  value={userDetails.alternateNumber}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md"
                />
              </div>

              <select
                name="city"
                value={userDetails.city}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md"
              >
                <option value="">Select City *</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Pune">Pune</option>
              </select>

              <textarea
                name="address"
                placeholder="Delivery Address *"
                value={userDetails.address}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md h-24"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  name="date"
                  value={userDetails.date}
                  onChange={handleInputChange}
                  min={minDate}
                  className="w-full p-3 border rounded-md"
                />
                <select
                  name="time"
                  value={userDetails.time}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md"
                >
                  <option value="">Select Time *</option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              {/* Tables and Staff Selection */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="block font-medium">Number of Tables</label>
                    <span className="text-sm text-gray-500">
                      Minimum {Math.ceil(guestCount / 50)} required
                    </span>
                  </div>
                  <input
                    type="number"
                    name="numberOfTables"
                    value={userDetails.numberOfTables}
                    onChange={handleInputChange}
                    min={Math.ceil(guestCount / 50)}
                    className="w-24 p-2 border rounded-md"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <label className="block font-medium">Additional Staff</label>
                    <span className="text-sm text-gray-500">
                      Base staff: {calculateBaseStaff()}
                    </span>
                  </div>
                  <input
                    type="number"
                    name="additionalStaff"
                    value={userDetails.additionalStaff}
                    onChange={handleInputChange}
                    min="0"
                    className="w-24 p-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            {/* Selected Items */}
            <div className="mb-6 max-h-64 overflow-y-auto">
              <h3 className="font-semibold mb-2">Selected Items</h3>
              <div className="space-y-2">
                {selectedItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.item_name}</span>
                    {item.isExtra && (
                      <span className="text-orange-600">+₹50</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Coupon Section */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Apply Coupon</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 p-2 border rounded-md"
                  disabled={appliedCoupon !== null}
                />
                {appliedCoupon ? (
                  <button
                    onClick={removeCoupon}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    ✕
                  </button>
                ) : (
                  <button
                    onClick={handleCouponApply}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Apply
                  </button>
                )}
              </div>
              
              {couponError && (
                <div className="mt-2 p-3 bg-red-50 text-red-600 rounded-md flex items-center gap-2">
                  <span>⚠️</span>
                  <div>
                    <p className="font-semibold">Error</p>
                    <p>{couponError}</p>
                  </div>
                </div>
              )}
              
              {showCouponSuccess && (
                <div className="mt-2 p-3 bg-green-50 text-green-800 rounded-md flex items-center gap-2">
                  <span>✓</span>
                  <div>
                    <p className="font-semibold">Success</p>
                    <p>Coupon applied successfully! You got {VALID_COUPONS[appliedCoupon]}% off</p>
                  </div>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Base Cost (₹{platePrice} × {guestCount})</span>
                <span>₹{totals.baseCost.toFixed(2)}</span>
              </div>
              
              {totals.extraItemsCost > 0 && (
                <div className="flex justify-between">
                  <span>Extra Items</span>
                  <span>₹{totals.extraItemsCost.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Staff Charges</span>
                <span>₹{totals.staffCost.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Table Charges</span>
                <span>₹{totals.tablesCost.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between font-medium">
                <span>Subtotal</span>
                <span>₹{totals.subtotal.toFixed(2)}</span>
              </div>
              
              {totals.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({VALID_COUPONS[appliedCoupon]}% off)</span>
                  <span>-₹{totals.discount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>₹{totals.gst.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₹{DELIVERY_FEE.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span>₹{totals.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full mt-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
            >
              Proceed to Payment
            </button>

            <div className="mt-4 text-sm text-gray-500">
              <p>* Required fields</p>
              <p>Note: Base staff count is calculated as 1 per 100 guests (minimum 2)</p>
              <p>Minimum tables are calculated as 1 per 50 guests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Terms and Conditions</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>1. Orders must be placed at least {guestCount > 200 ? "3 days" : guestCount > 100 ? "2 days" : "1 day"} in advance.</p>
            <p>2. Cancellations within 24 hours of the event will incur a 50% charge.</p>
            <p>3. Changes to the order can be made up to 48 hours before the event.</p>
            <p>4. Delivery time may vary based on location and traffic conditions.</p>
            <p>5. Additional charges may apply for locations outside service area.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuOrder;