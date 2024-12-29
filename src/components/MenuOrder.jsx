import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin, X, Check, AlertCircle } from "lucide-react";

const DELIVERY_FEE = 500;
const STAFF_PRICE = 500;
const HELPER_PRICE = 500;
const TABLE_PRICE = 200;

const VALID_COUPONS = {
  "GSR10": 10,
  "GSR15": 15
};



const HYDERABAD_LOCATIONS = [
  "Hitech City",
  "Gachibowli",
  "Madhapur",
  "Jubilee Hills",
  "Banjara Hills",
  "Kukatpally",
  "Ameerpet",
  "Secunderabad",
  "Begumpet",
  "Kondapur"
];

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

  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [showCouponSuccess, setShowCouponSuccess] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const timeSlots = [
    "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", 
    "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"
  ];

  const getAvailableTimeSlots = () => {
    if (guestCount < 30) {
      // For less than 30 guests, allow times after 1 PM for next day
      return timeSlots.filter(slot => {
        const hour = parseInt(slot.split(":")[0]);
        return hour >= 1;
      });
    } else if (guestCount < 100) {
      // For 30-100 guests, allow times after 7 PM for next day
      return timeSlots.filter(slot => {
        const hour = parseInt(slot.split(":")[0]);
        return hour >= 7;
      });
    }
    // For more than 100 guests, show all time slots (but date will be after tomorrow)
    return timeSlots;
  };

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    
    // Set minimum date based on guest count
    if (guestCount > 100) {
      // More than 100 guests need to book at least 2 days in advance
      tomorrow.setDate(today.getDate() + 2);
    } else {
      // Less than 100 guests can book for tomorrow
      tomorrow.setDate(today.getDate() + 1);
    }
    
    setMinDate(tomorrow.toISOString().split("T")[0]);

    // Reset time if it doesn't match new constraints
    const availableSlots = getAvailableTimeSlots();
    if (!availableSlots.includes(userDetails.time)) {
      setUserDetails(prev => ({
        ...prev,
        time: ""
      }));
    }
  }, [guestCount]);

  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    alternateNumber: "",
    city: "",
    address: "",
    landmark: "",
    date: "",
    time: "",
    numberOfTables: 0,
    numberOfStaff: 0,
    numberOfHelpers: 0
  });

  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + (guestCount < 20 ? 1 : 2));
    setMinDate(tomorrow.toISOString().split("T")[0]);
  }, [guestCount]);

  const detectLocation = () => {
    setIsLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
            );
            const data = await response.json();
            setUserDetails(prev => ({
              ...prev,
              address: data.display_name || "Location detected (Please add specific details)"
            }));
          } catch (error) {
            console.error("Error fetching address:", error);
          } finally {
            setIsLoadingLocation(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoadingLocation(false);
        }
      );
    }
  };

  const calculateTotals = () => {
    const staffCost = userDetails.numberOfStaff * STAFF_PRICE;
    const helperCost = userDetails.numberOfHelpers * HELPER_PRICE;
    const tablesCost = userDetails.numberOfTables * TABLE_PRICE;
    
    const baseCost = platePrice * guestCount;
    const extraItemsCost = extraItems.length * 50;
    
    const subtotal = baseCost + extraItemsCost + staffCost + helperCost + tablesCost;
    
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
      helperCost,
      tablesCost,
      subtotal,
      discount,
      gst,
      total
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
      "address", "landmark", "date", "time"
    ];

    const missingFields = requiredFields.filter(field => !userDetails[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    setShowPaymentSuccess(true);
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
                <option value="">Select Area *</option>
                {HYDERABAD_LOCATIONS.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>

              <div className="relative">
                
                <button
                  onClick={detectLocation}
                  className="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 flex items-center gap-2"
                >
                  <MapPin size={16} />
                  {isLoadingLocation ? "Detecting..." : "Use current location"}
                </button>
                <textarea
                  name="address"
                  placeholder="Delivery Address *"
                  value={userDetails.address}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md h-24"
                />
              </div>

              <input
                type="text"
                name="landmark"
                placeholder="Landmark *"
                value={userDetails.landmark}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md"
              />

              <input
                type="number"
                name="landmark"
                placeholder="Landmark *"
                value={guestCount}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md"
              />


<div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date *</label>
          <input
            type="date"
            name="date"
            value={userDetails.date}
            onChange={handleInputChange}
            min={minDate}
            className="w-full p-3 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Time *</label>
          <select
            name="time"
            value={userDetails.time}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-md"
          >
            <option value="">Select Time</option>
            {getAvailableTimeSlots().map(slot => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Add this helper text */}
      <div className="mt-2 text-sm text-gray-600">
        {guestCount < 30 && (
          <p>For orders under 30 guests: Available for tomorrow after 1:00 PM</p>
        )}
        {guestCount >= 30 && guestCount < 100 && (
          <p>For orders between 30-100 guests: Available for tomorrow after 7:00 PM</p>
        )}
        {guestCount >= 100 && (
          <p>For orders over 100 guests: Available starting day after tomorrow</p>
        )}
      </div>


              {/* Staff and Tables Section */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tables</label>
                    <input
                      type="number"
                      name="numberOfTables"
                      value={userDetails.numberOfTables}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full p-2 border rounded-md"
                    />
                    <span className="text-xs text-gray-500">₹200 each</span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Staff</label>
                    <input
                      type="number"
                      name="numberOfStaff"
                      value={userDetails.numberOfStaff}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full p-2 border rounded-md"
                    />
                    <span className="text-xs text-gray-500">₹500 each</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Helpers</label>
                    <input
                      type="number"
                      name="numberOfHelpers"
                      value={userDetails.numberOfHelpers}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full p-2 border rounded-md"
                    />
                    <span className="text-xs text-gray-500">₹500 each</span>
                  </div>
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
        {showPaymentSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600 mb-6">
                Thank you for your order. Our executive will call you shortly for confirmation.
              </p>
              <button
                onClick={() => {
                  setShowPaymentSuccess(false);
                  navigate('/');
                }}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
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