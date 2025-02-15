import React, { useState, useEffect } from 'react';
import { ChevronLeft, Users, CreditCard } from 'lucide-react';
import { useAuth } from "./AuthSystem";

const SuperfastDelboxCheckout = ({ superselecteditems, onBack, guestCount, formData: initialFormData, totals }) => {
    const { user } = useAuth();
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [minDate, setMinDate] = useState('');
    const [minTime, setMinTime] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [formData, setFormData] = useState({
        name: initialFormData?.name || '',
        phone1: initialFormData?.phone1 || '',
        phone2: initialFormData?.phone2 || '',
        email: initialFormData?.email || '',
        address: initialFormData?.address || '',
        landmark: initialFormData?.landmark || '',
        date: initialFormData?.date || '',
        time: initialFormData?.time || ''
    });

    // Pre-fill form with user data
    useEffect(() => {
        if (user) {
            setFormData(prevData => ({
                ...prevData,
                name: user.name || "",
                phone1: user.phone || "",
                email: user.email || "",
                address: user.address || ""
            }));
        }
    }, [user]);

    // Load Razorpay script
    useEffect(() => {
        const loadRazorpay = async () => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => setRazorpayLoaded(true);
            document.body.appendChild(script);
        };
        loadRazorpay();
        
        // Cleanup
        return () => {
            const script = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
            if (script) {
                document.body.removeChild(script);
            }
        };
    }, []);

    // Initialize date/time constraints
    useEffect(() => {
        updateDateTimeConstraints();
    }, []);

    const updateDateTimeConstraints = () => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const minDateStr = tomorrow.toISOString().split('T')[0];
        setMinDate(minDateStr);

        const minTimeDate = new Date(now.getTime() + (15 * 60 * 60 * 1000));
        const hours = minTimeDate.getHours().toString().padStart(2, '0');
        const minutes = minTimeDate.getMinutes().toString().padStart(2, '0');
        setMinTime(`${hours}:${minutes}`);

        if (!formData.date) {
            setFormData(prev => ({
                ...prev,
                date: minDateStr,
                time: `${hours}:${minutes}`
            }));
        } else if (formData.date === minDateStr && formData.time < `${hours}:${minutes}`) {
            setFormData(prev => ({ ...prev, time: `${hours}:${minutes}` }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'date') {
            const selectedDate = new Date(value);
            const today = new Date();

            if (selectedDate.toDateString() === today.toDateString()) {
                setFormData(prev => ({
                    ...prev,
                    [name]: value,
                    time: minTime
                }));
                return;
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const isFormValid = () => {
        if (!formData.name || !formData.phone1 || !formData.address || !formData.date || !formData.time) {
            return false;
        }

        const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
        const minDateTime = new Date(Date.now() + (15 * 60 * 60 * 1000));

        return selectedDateTime > minDateTime;
    };

    const handlePaymentSuccess = async (response) => {
        try {
            setIsLoading(true);
            console.log("Payment successful, response:", response);

            const orderPayload = {
                razorpay_order_id: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount: Math.round(totals.total * 100 ),
                customerDetails: {
                    name: formData.name.trim(),
                    phone1: formData.phone1.trim(),
                    phone2: formData.phone2?.trim() || '',
                    email: formData.email?.trim() || '',
                    address: formData.address.trim(),
                    landmark: formData.landmark?.trim() || '',
                    deliveryDate: formData.date,
                    deliveryTime: formData.time
                },
                orderDetails: superselecteditems.map(item => ({
                    name: item.title,
                    price: item.price,
                    quantity: item.quantity
                }))
            };

            console.log("Sending order payload:", orderPayload);

            try {
                const orderResponse = await fetch(
                    'https://mahaspice.desoftimp.com/ms3/payment/create_sup_home.php',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(orderPayload)
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
                    throw new Error(`HTTP error! status: ${orderResponse.status}, message: ${orderData.message || responseText}`);
                }

                if (orderData.status !== "success") {
                    throw new Error(orderData.message || "Failed to create order");
                }

                setIsSuccess(true);

                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);

            } catch (error) {
                console.error("Error saving order:", error);
                throw new Error(`Failed to save order: ${error.message}`);
            }

        } catch (error) {
            console.error("Error in payment success handler:", error);
            alert(`Error processing order. Please take a screenshot and contact support:\n\nPayment ID: ${response.razorpay_payment_id}\nError: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!isFormValid()) return;

        try {
            setIsLoading(true);

            if (!window.Razorpay) {
                throw new Error("Razorpay SDK failed to load. Please refresh the page and try again.");
            }

            const options = {
                key: "rzp_live_Mjm1GpVqxzwjQL",
                amount: Math.round(totals.total * 100 ),
                currency: "INR",
                name: "Mahaspice Caterers",
                description: "Delbox Order Payment",
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone1
                },
                handler: handlePaymentSuccess,
                modal: {
                    ondismiss: function() {
                        setIsLoading(false);
                    }
                },
                theme: {
                    color: "#22c55e"
                }
            };

            const razorpayInstance = new window.Razorpay(options);
            razorpayInstance.open();
            
        } catch (error) {
            console.error('Payment Error:', error);
            alert('Payment initiation failed: ' + error.message);
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Successful!</h2>
                    <p className="text-gray-600 mb-6">Your order has been placed successfully. Redirecting to home page...</p>
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent mx-auto"></div>
                </div>
            </div>
        );
    }

    if (!superselecteditems || superselecteditems.length === 0) {
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
                            <span className="font-medium">Number of Guests: {guestCount}</span>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }} className="space-y-4">
                            {/* Form fields remain the same */}
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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Delivery Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        min={minDate}
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Delivery Time *
                                    </label>
                                    <input
                                        type="time"
                                        name="time"
                                        required
                                        min={formData.date === minDate ? minTime : '00:00'}
                                        value={formData.time}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                                    />
                                    {formData.date === minDate && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Minimum delivery time: {new Date(`1970-01-01T${minTime}:00`).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true,
                                            })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                        <div className="max-h-[40vh] overflow-y-auto mb-6 pr-2">
                            {superselecteditems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center py-3 border-b">
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
                                <span>Gst({totals.gstpercent}%)</span>
                                <span>₹{totals.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery Charges</span>
                                <span>₹{totals.deliveryCharge.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t pt-4">
                                <span>Total</span>
                                <span>₹{totals.total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={!isFormValid()}
                            className="w-full mt-6 bg-green-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            <CreditCard className="h-5 w-5" />
                            Proceed to Pay
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

export default SuperfastDelboxCheckout;