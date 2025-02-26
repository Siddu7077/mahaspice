import React, { useState, useEffect } from "react";
import { ChevronLeft, Users, CreditCard } from "lucide-react";
import { useAuth } from "./AuthSystem";
import { useNavigate } from "react-router-dom";

const DelboxCheckout = ({
  selectedItems,
  onBack,
  guestCount,
  formData: initialFormData,
  totals,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [minDate, setMinDate] = useState("");
  const [minTime, setMinTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [locations, setLocations] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [dateError, setDateError] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  const [formData, setFormData] = useState({
    name: initialFormData?.name || "",
    phone1: initialFormData?.phone1 || "",
    phone2: initialFormData?.phone2 || "",
    email: initialFormData?.email || "",
    address: initialFormData?.address || "",
    landmark: initialFormData?.landmark || "",
    date: initialFormData?.date || "",
    time: initialFormData?.time || "",
    location: initialFormData?.location || "",
  });

  
  // Pre-fill form with user data
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

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = async () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      document.body.appendChild(script);
    };
    loadRazorpay();

    // Cleanup
    return () => {
      const script = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const getAvailableTimeSlots = () => {
    if (!formData.date) return [];

    const today = new Date();
    const selectedDate = new Date(formData.date);
    const isToday =
      selectedDate.toISOString().split("T")[0] ===
      today.toISOString().split("T")[0];

    // Base time slots
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

    const istOffset = 330; // IST offset in minutes
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

      // Calculate if slot is at least 4 hours ahead
      const slotTotalMinutes = hours * 60;
      const currentTotalMinutes = currentHour * 60 + currentMinutes;
      return slotTotalMinutes - currentTotalMinutes >= 240 && hours <= 19; // 19 is 7 PM
    });
  };

  // Fetch locations and blocked dates
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(
          "https://adminmahaspice.in/ms3/displayDeloc.php"
        );
        const data = await response.json();

        if (data.success && data.locations) {
          const boxGenieLocations = data.locations
            .filter((loc) => loc.service_type === "home_delivery")
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

    const fetchBlockedDates = async () => {
      try {
        const response = await fetch(
          "https://adminmahaspice.in/ms3/dateblocking.php"
        );
        const data = await response.json();

        const mealboxBlockedDates = data.filter(
          (item) => item.for === "Deliverybox"
        );
        setBlockedDates(mealboxBlockedDates);
      } catch (error) {
        console.error("Error fetching blocked dates:", error);
      }
    };

    fetchLocations();
    fetchBlockedDates();
  }, []);

  const handleLocationChange = (e) => {
    const selectedLocation = locations.find(
      (loc) => loc.location === e.target.value
    );
    if (selectedLocation) {
      setDeliveryCharge(selectedLocation.price);
    }
    handleInputChange(e);
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split("T")[0];

    if (selectedDate === today && isPastFourPM()) {
      setDateError(
        "We cannot deliver orders today after 4 PM IST. Please select another date."
      );
      setFormData((prev) => ({
        ...prev,
        date: selectedDate,
        time: "",
      }));
      return;
    }

    const blockedDate = blockedDates.find((date) => date.date === selectedDate);
    if (blockedDate) {
      setDateError(blockedDate.reason);
      setFormData((prev) => ({
        ...prev,
        date: selectedDate,
        time: "",
      }));
      return;
    }

    setDateError("");
    setFormData((prev) => ({
      ...prev,
      date: selectedDate,
      time: "",
    }));
  };

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

  const isFormValid = () => {
    // Create an array of validation checks
    const validationChecks = [
      {
        field: "name",
        value: formData.name?.trim(),
        message: "Name is required",
      },
      {
        field: "phone1",
        value: formData.phone1?.trim(),
        message: "Phone 1 is required",
      },
      {
        field: "address",
        value: formData.address?.trim(),
        message: "Address is required",
      },
      { field: "date", value: formData.date, message: "Date is required" },
      { field: "time", value: formData.time, message: "Time is required" },
      {
        field: "location",
        value: formData.location,
        message: "Location is required",
      },
    ];

    // Check each validation rule
    for (const check of validationChecks) {
      if (!check.value) {
        console.log(`Form validation failed: ${check.message}`);
        return false;
      }
    }

    // Validate date is not blocked
    if (dateError) {
      console.log("Form validation failed: Date is blocked or invalid");
      return false;
    }

    // Validate date and time
    if (formData.date && formData.time) {
      // Convert time to 24-hour format for comparison
      const [time, period] = formData.time.split(" ");
      let [hours, minutes] = time.split(":");
      hours = parseInt(hours);
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      const selectedDateTime = new Date(formData.date);
      selectedDateTime.setHours(hours, parseInt(minutes) || 0);

      const now = new Date();
      const minDateTime = new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 hours from now

      if (selectedDateTime < minDateTime) {
        console.log(
          "Form validation failed: Selected time is less than 4 hours from now"
        );
        return false;
      }
    }

    console.log("Form validation passed");
    return true;
  };

  const debugFormState = () => {
    console.log("Current Form State:", {
      name: formData.name,
      phone1: formData.phone1,
      address: formData.address,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      dateError,
      isValid: isFormValid(),
    });
  };

  const finalTotal = totals.total + deliveryCharge;

  const handlePayment = async () => {
    debugFormState(); // Log form state when payment is attempted

    if (!isFormValid()) {
      alert("Please fill in all required fields correctly");
      return;
    }

    try {
      setIsLoading(true);

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay SDK failed to load. Please refresh the page and try again."
        );
      }

      const options = {
        key: "rzp_live_Mjm1GpVqxzwjQL",
        amount: Math.round(finalTotal * 100 / 500),
        currency: "INR",
        name: "Mahaspice Caterers",
        description: "Home Delivery Order Payment",
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentSuccess = async (response) => {
    try {
      setIsLoading(true);
      console.log("Payment successful, response:", response);

      const orderPayload = {
        razorpay_order_id: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount: Math.round(finalTotal * 100 ),
        customerDetails: {
          name: formData.name.trim(),
          phone1: formData.phone1.trim(),
          phone2: formData.phone2?.trim() || "",
          email: formData.email?.trim() || "",
          address: formData.address.trim(),
          landmark: formData.landmark?.trim() || "",
          deliveryDate: formData.date,
          deliveryTime: formData.time,
          location: formData.location,
        },
        orderDetails: selectedItems.map((item) => ({
          name: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      console.log("Sending order payload:", orderPayload);

      try {
        const orderResponse = await fetch(
          "https://adminmahaspice.in/ms3/payment/create_home_order.php",
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
        console.error("Error saving order:", error);
        throw new Error(`Failed to save order: ${error.message}`);
      }
    } catch (error) {
      console.error("Error in payment success handler:", error);
      alert(
        `Error processing order. Please take a screenshot and contact support:\n\nPayment ID: ${response.razorpay_payment_id}\nError: ${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
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

  if (!selectedItems || selectedItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">No Items in Cart</h2>
            <p className="text-gray-600 mb-6">Your shopping cart is empty.</p>
            <button
              onClick={onBack}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Return to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Menu
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Delivery Details Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Delivery Details</h2>
            <div className="mb-6 flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
              <Users className="text-gray-600" />
              <span className="font-medium">
                Number of Guests: {guestCount}
              </span>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePayment();
              }}
              className="space-y-4"
            >
              {/* Rest of the form fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone 1 *
                </label>
                <input
                  type="tel"
                  name="phone1"
                  required
                  value={formData.phone1}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone 2 (Optional)
                </label>
                <input
                  type="tel"
                  name="phone2"
                  value={formData.phone2}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Date*
                  </label>
                  <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-green-500">
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleDateChange}
                      min={getMinDate()}
                      className="w-full p-3 border-0 focus:ring-0 focus:outline-none"
                    />
                  </div>
                  {dateError && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex gap-2">
                        <div>
                          <p className="text-red-800 font-medium">
                            Date Unavailable
                          </p>
                          <p className="text-red-700 text-sm mt-1">
                            Please choose another date. {dateError}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* {errors.date && !dateError && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                )} */}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Time*
                  </label>
                  <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-green-500">
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className={`w-full p-3 border-0 focus:ring-0 focus:outline-none ${
                        dateError ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                      disabled={!formData.date || dateError}
                      required
                    >
                      <option value="">Select delivery time</option>
                      {formData.date &&
                        !dateError &&
                        getAvailableTimeSlots().map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                    </select>
                  </div>

                  {formData.date &&
                    !dateError &&
                    getAvailableTimeSlots().length === 0 && (
                      <p className="text-red-500 text-sm mt-1">
                        No available delivery slots for today. Please select
                        another date.
                      </p>
                    )}
                </div>
              </div>

              {/* Location Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Location *
                </label>
                <select
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleLocationChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select a location</option>
                  {locations.map((loc) => (
                    <option key={loc.location} value={loc.location}>
                      {loc.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address *
                </label>
                <textarea
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your complete delivery address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Landmark
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="max-h-[40vh] overflow-y-auto mb-6 pr-2">
              {selectedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-3 border-b"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-600">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold ml-4">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Gst</span>
                <span>₹{totals.gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charges</span>
                <span>₹{deliveryCharge}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-4">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={!isFormValid()}
              className="w-full mt-6 bg-green-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <CreditCard className="h-5 w-5" />
              {isFormValid()
                ? "Proceed to Pay"
                : "Please Fill All Required Fields"}
            </button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Connecting to Payment Gateway
            </h3>
            <p className="text-sm text-gray-500 text-center">
              Please wait while we securely connect you to our payment partner
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DelboxCheckout;