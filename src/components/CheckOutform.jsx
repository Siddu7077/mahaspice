import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Home,
  Navigation,
  CreditCard, 
  Package,
} from "lucide-react";

const CheckOutform = ({ cart, onBack }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone1: "",
    phone2: "",
    email: "",
    address: "",
    landmark: "",
  });

  const cartTotal = Object.values(cart).reduce((total, item) => {
    const itemPrice = parseFloat(item.details.price.replace("₹", ""));
    return total + itemPrice * item.quantity;
  }, 0);
  
  const gstAmount = +(cartTotal * 0.18).toFixed(2);
  const totalAmount = cartTotal + gstAmount;
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Group cart items by package (keeping your existing grouping logic)
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

  useEffect(() => {
    const loadRazorpayScript = async () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = resolve;
        document.body.appendChild(script);
      });
    };
    loadRazorpayScript();
  }, []);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone1.trim()) {
      newErrors.phone1 = "Primary phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone1)) {
      newErrors.phone1 = "Enter valid 10-digit number";
    }

    if (formData.phone2 && !/^\d{10}$/.test(formData.phone2)) {
      newErrors.phone2 = "Enter valid 10-digit number";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter valid email address";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);

      // First, create a basic order to get order_id
      const options = {
        key: "rzp_live_Mjm1GpVqxzwjQL",
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        name: "Mahaspice Caterers",
        description: "Order Payment",
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone1
        },
        handler: async function(response) {
          // Only send the order data after successful payment
          try {
            // First verify the payment
            const verifyPayload = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verifyResponse = await fetch(
              'https://mahaspice.desoftimp.com/ms3/payment/verify_payment.php',
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json"
                },
                body: JSON.stringify(verifyPayload),
              }
            );

            const verifyData = await verifyResponse.json();

            if (verifyData.status === "success") {
              
              const orderPayload = {
                paymentId: response.razorpay_payment_id,
                amount: Math.round(totalAmount * 100),
                customerDetails: {
                  name: formData.name.trim(),
                  phone1: formData.phone1.trim(),
                  phone2: formData.phone2?.trim() || '',
                  email: formData.email?.trim() || '',
                  address: formData.address.trim(),
                  landmark: formData.landmark?.trim() || ''
                },
                orderDetails: Object.entries(cart).map(([id, item]) => ({
                  name: item.details.name,
                  price: parseFloat(item.details.price.replace(/[^\d.]/g, '')),
                  quantity: parseInt(item.quantity),
                  package: item.package
                }))
              };

              const orderResponse = await fetch('https://mahaspice.desoftimp.com/ms3/payment/create_order.php', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify(orderPayload)
              });

              if (!orderResponse.ok) {
                throw new Error('Failed to create order. Please contact support.');
              }

              alert("Payment successful! Order has been placed.");
              // Add any additional success handling here
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error('Order Creation Error:', error);
            alert('Payment successful ,Our customer care support will contact you soon.');
          }
        },
        modal: {
          ondismiss: () => setIsLoading(false)
        },
        theme: {
          color: "#22c55e"
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error('Payment Error:', error);
      alert(error.message || 'Payment failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handlePayment();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
                {errors.phone2 && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone2}</p>
                )}
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
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
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
          {/* Selected Items */}
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

          {/* Price Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Price Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (18%)</span>
                <span>₹{gstAmount}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span>₹{totalAmount}</span>
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
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
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

export default CheckOutform;