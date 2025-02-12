import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Home,
  Navigation,
  CreditCard,
  Package,
  MapPinned,
  Calendar,
  Clock,
} from "lucide-react";
import { useAuth } from "./AuthSystem";
import DownloadInvoice from "./DownloadInvoice";

const SuperfastCheckOutform = ({
  cart,
  onBack,
  cartTotal,
  gstAmount,
  totalAmount,
  appliedCoupon,
  discountAmount,
  gstPercentage,
  calculateDiscount,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone1: "",
    phone2: "",
    email: "",
    address: "",
    landmark: "",
    location: "",
    deliveryDate: "",
    deliveryTime: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [locations, setLocations] = useState([]);
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  const isPastFourPM = () => {
    const now = new Date();
    const istOffset = 330; // IST offset is UTC+5:30 (330 minutes)
    const istTime = new Date(
      now.getTime() + (istOffset + now.getTimezoneOffset()) * 60000
    );
    return istTime.getHours() >= 16;
  };

  const getMinDate = () => {
    const today = new Date();
    if (isPastFourPM()) {
      today.setDate(today.getDate() + 1);
    }
    return today.toISOString().split("T")[0];
  };

  const getAvailableTimeSlots = () => {
    const today = new Date();
    const selectedDate = new Date(formData.deliveryDate);
    const isToday =
      selectedDate.toISOString().split("T")[0] ===
      today.toISOString().split("T")[0];

    const allTimeSlots = [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
      "5:00 PM",
      "6:00 PM",
      "7:00 PM",
    ];

    if (!isToday) {
      return allTimeSlots;
    }

    const istOffset = 330;
    const istTime = new Date(
      today.getTime() + (istOffset + today.getTimezoneOffset()) * 60000
    );
    const currentHour = istTime.getHours();
    const currentMinutes = istTime.getMinutes();

    return allTimeSlots.filter((slot) => {
      const [time, period] = slot.split(" ");
      let [hours, minutes] = time.split(":");
      hours = parseInt(hours);
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      const slotTotalMinutes = hours * 60;
      const currentTotalMinutes = currentHour * 60 + currentMinutes;
      return slotTotalMinutes - currentTotalMinutes >= 240 && hours <= 19;
    });
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split("T")[0];

    if (selectedDate === today && isPastFourPM()) {
      alert(
        "We cannot deliver orders today after 4 PM IST. Please select another date."
      );
      return;
    }

    setFormData((prev) => ({
      ...prev,
      deliveryDate: selectedDate,
      deliveryTime: "",
    }));
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(
          "https://mahaspice.desoftimp.com/ms3/displayDeloc.php"
        );
        const data = await response.json();

        if (data.success && data.locations) {
          const boxGenieLocations = data.locations
            .filter((loc) => loc.service_type === "superfast")
            .reduce((acc, loc) => {
              acc[loc.location] = {
                location: loc.location,
                price: parseFloat(loc.price),
              };
              return acc;
            }, {});

          const sortedLocations = Object.values(boxGenieLocations).sort(
            (a, b) => a.location.localeCompare(b.location)
          );

          setLocations(sortedLocations);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const loadRazorpay = async () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      document.body.appendChild(script);
    };
    loadRazorpay();

    return () => {
      const script = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        name: user.name || "",
        phone1: user.phone || "",
        email: user.email || "",
        address: user.address || "",
      }));
    }
  }, [user]);

  const handleLocationChange = (e) => {
    const selectedLocation = locations.find(
      (loc) => loc.location === e.target.value
    );
    setDeliveryCharge(selectedLocation ? selectedLocation.price : 0);
    handleChange(e);
  };

  const finalTotal = totalAmount + deliveryCharge;

  const groupedCartItems = Object.entries(cart).reduce(
    (acc, [itemId, item]) => {
      const pkg = item.package || "Default";
      if (!acc[pkg]) {
        acc[pkg] = [];
      }
      acc[pkg].push({ itemId, details: item.details, quantity: item.quantity });
      return acc;
    },
    {}
  );

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone1.trim()) newErrors.phone1 = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.deliveryDate) newErrors.deliveryDate = "Delivery date is required";
    if (!formData.deliveryTime) newErrors.deliveryTime = "Delivery time is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentSuccess = async (response) => {
  try {
    setIsLoading(true);
    console.log("Payment successful, response:", response);

    const orderPayload = {
      razorpay_order_id: response.razorpay_order_id,
      paymentId: response.razorpay_payment_id,
      amount: Math.round(finalTotal * 100),
      customerDetails: {
        name: formData.name.trim(),
        phone1: formData.phone1.trim(),
        phone2: formData.phone2?.trim() || "",
        email: formData.email?.trim() || "",
        address: formData.address.trim(),
        landmark: formData.landmark?.trim() || "",
        location: formData.location,
        deliveryDate: formData.deliveryDate,
        deliveryTime: formData.deliveryTime,
      },
      orderDetails: Object.entries(cart).map(([id, item]) => ({
        name: item.details.name,
        price: parseFloat(item.details.price.replace(/[^\d.]/g, "")),
        quantity: parseInt(item.quantity),
        package: item.package,
      })),
      coupon: appliedCoupon
        ? {
            code: appliedCoupon.code,
            discount: discountAmount,
            type: appliedCoupon.discount_type,
          }
        : null,
    };

    console.log("Sending order payload:", orderPayload);

    const orderResponse = await fetch(
      "https://mahaspice.desoftimp.com/ms3/payment/create_sup_box.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      }
    );

    const responseText = await orderResponse.text();
    console.log("Raw response:", responseText);

    let orderData;
    try {
      orderData = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Invalid JSON response: ${responseText}`);
    }

    if (!orderResponse.ok) {
      throw new Error(
        `HTTP error! status: ${orderResponse.status}, message: ${
          orderData.message || responseText
        }`
      );
    }

    if (orderData.status !== "success") {
      throw new Error(orderData.message || "Failed to create order");
    }

    setIsSuccess(true);

    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  } catch (error) {
    console.error("Error in payment success handler:", error);
    alert(
      `Error processing order. Please take a screenshot and contact support:\n\nPayment ID: ${response.razorpay_payment_id}\nError: ${error.message}`
    );
  } finally {
    setIsLoading(false);
  }
};

  const handlePayment = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay SDK failed to load. Please refresh the page and try again."
        );
      }

      const options = {
        key: "rzp_live_Mjm1GpVqxzwjQL",
        amount: Math.round(finalTotal * 100 ),
        currency: "INR",
        name: "Mahaspice Caterers",
        description: appliedCoupon
          ? `Order Payment (Coupon: ${appliedCoupon.code})`
          : "Order Payment",
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone1,
        },
        handler: handlePaymentSuccess,
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
        theme: {
          color: "#22c55e",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment initiation failed: " + error.message);
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!razorpayLoaded) {
      alert(
        "Payment system is still loading. Please wait a moment and try again."
      );
      return;
    }
    handlePayment();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Order Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your order has been placed successfully. Redirecting to home page...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50">
      <button
        onClick={onBack}
        className="mb-6 text-gray-600 hover:text-gray-800 flex items-center gap-2"
      >
        ← Back to Menu
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Delivery Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name*
                </label>
                <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-green-500">
                  <Home className="ml-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border-0 focus:ring-0 focus:outline-none"
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number 1*
                </label>
                <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-green-500">
                  <Phone className="ml-3 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone1"
                    value={formData.phone1}
                    onChange={handleChange}
                    className="w-full p-3 border-0 focus:ring-0 focus:outline-none"
                    placeholder="Enter primary phone number"
                  />
                </div>
                {errors.phone1 && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone1}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number 2 (Optional)
                </label>
                <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-green-500">
                  <Phone className="ml-3 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone2"
                    value={formData.phone2}
                    onChange={handleChange}
                    className="w-full p-3 border-0 focus:ring-0 focus:outline-none"
                    placeholder="Enter alternate phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (Optional)
                </label>
                <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-green-500">
                  <Mail className="ml-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border-0 focus:ring-0 focus:outline-none"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Date*
                </label>
                <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-green-500">
                  <Calendar className="ml-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleDateChange}
                    min={getMinDate()}
                    className="w-full p-3 border-0 focus:ring-0 focus:outline-none"
                  />
                </div>
                {errors.deliveryDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.deliveryDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Time*
                </label>
                <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-green-500">
                  <Clock className="ml-3 h-5 w-5 text-gray-400" />
                  <select
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleChange}
                    className="w-full p-3 border-0 focus:ring-0 focus:outline-none"
                    disabled={!formData.deliveryDate}
                  >
                    <option value="">Select delivery time</option>
                    {formData.deliveryDate &&
                      getAvailableTimeSlots().map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                  </select>
                </div>
                {errors.deliveryTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.deliveryTime}</p>
                )}
                {formData.deliveryDate && getAvailableTimeSlots().length === 0 && (
                  <p className="text-red-500 text-sm mt-1">
                    No available delivery slots for today. Please select another date.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Location*
                </label>
                <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-green-500">
                  <MapPinned className="ml-3 h-5 w-5 text-gray-400" />
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleLocationChange}
                    className="w-full p-3 border-0 focus:ring-0 focus:outline-none"
                  >
                    <option value="">Select a location</option>
                    {locations.map((loc) => (
                      <option key={loc.location} value={loc.location}>
                        {loc.location}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address*
                </label>
                <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-green-500">
                  <MapPin className="ml-3 h-5 w-5 text-gray-400" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-3 border-0 focus:ring-0 focus:outline-none"
                    placeholder="Enter your delivery address"
                    rows="3"
                  />
                </div>
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Landmark
                </label>
                <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-green-500">
                  <Navigation className="ml-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full p-3 border-0 focus:ring-0 focus:outline-none"
                    placeholder="Enter a nearby landmark"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Selected Items</h2>
            <div className="space-y-6">
              {Object.entries(groupedCartItems).map(([pkg, items]) => (
                <div
                  key={pkg}
                  className="border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="h-5 w-5 text-gray-500" />
                    <h3 className="font-semibold text-lg">{pkg} Package</h3>
                  </div>
                  {items.map(({ itemId, details, quantity }) => (
                    <div
                      key={itemId}
                      className="flex justify-between items-center py-2"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={details.image}
                          alt={details.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div>
                          <p className="font-medium">{details.name}</p>
                          <p className="text-sm text-gray-500">
                            Quantity: {quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold">{details.price}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Price Summary</h2>
            <DownloadInvoice
              formData={formData}
              cart={cart}
              cartTotal={cartTotal}
              gstAmount={gstAmount}
              deliveryCharge={deliveryCharge}
              finalTotal={finalTotal}
              discountAmount={discountAmount}
              gstPercentage={gstPercentage}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Price Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST ({gstPercentage}%)</span>
                <span>₹{gstAmount}</span>
              </div>
              {calculateDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-₹{calculateDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge</span>
                <span>₹{deliveryCharge}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full mt-6 bg-green-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
              >
                <CreditCard className="h-5 w-5" />
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Processing Your Payment
            </h3>
            <p className="text-sm text-gray-500 text-center">
              Please wait while we securely process your payment
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperfastCheckOutform;