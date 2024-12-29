import React, { useState, useEffect } from 'react';
import { ChevronLeft, Users } from 'lucide-react';

const DelboxCheckout = ({ selectedItems: initialItems, totals: initialTotals, onBack, guestCount }) => {
  // Previous state declarations
  const [selectedItems, setSelectedItems] = useState([]);
  const [totals, setTotals] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [formData, setFormData] = useState(() => {
    const savedForm = localStorage.getItem('checkoutFormData');
    return savedForm ? JSON.parse(savedForm) : {
      name: '',
      phone1: '',
      phone2: '',
      email: '',
      address: '',
      landmark: '',
      date: '',
      time: ''
    };
  });

  // Previous useEffects remain the same
  useEffect(() => {
    const savedItems = localStorage.getItem('selectedItems');
    const savedTotals = localStorage.getItem('orderTotals');
    
    if (savedItems && savedTotals) {
      setSelectedItems(JSON.parse(savedItems));
      setTotals(JSON.parse(savedTotals));
    } else {
      setSelectedItems(initialItems);
      setTotals(initialTotals);
    }
    setIsLoading(false);
  }, [initialItems, initialTotals]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
      localStorage.setItem('orderTotals', JSON.stringify(totals));
      localStorage.setItem('checkoutFormData', JSON.stringify(formData));
    }
  }, [selectedItems, totals, formData, isLoading]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPaymentModal(true);
    // Simulate redirect to payment gateway after 2 seconds
    setTimeout(() => {
      // Replace this with actual payment gateway integration
      console.log('Redirecting to PhonePe...');
      // window.location.href = 'YOUR_PHONEPE_GATEWAY_URL';
    }, 2000);
  };

  const isFormValid = () => {
    return formData.name && 
           formData.phone1 && 
           formData.address && 
           formData.date && 
           formData.time;
  };

  // Payment Gateway Modal Component
  const PaymentModal = () => {
    if (!showPaymentModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Connecting to Payment Gateway</h3>
          <p className="text-gray-600">Please wait while we connect to PhonePe servers...</p>
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your order...</p>
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
      {/* Payment Gateway Modal */}
      <PaymentModal />

      <div className="max-w-6xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Menu
        </button>

        {/* Rest of the component remains the same */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Delivery Details Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Delivery Details</h2>
            {/* Guest Count Display */}
            <div className="mb-6 flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
              <Users className="text-gray-600" />
              <span className="font-medium">Number of Guests: {guestCount}</span>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            
            {/* Scrollable Items List */}
            <div className="max-h-[40vh] overflow-y-auto mb-6 pr-2">
              {selectedItems.map((item) => (
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

            {/* Price Summary */}
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (18%)</span>
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
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className="w-full bg-green-500 text-white py-3 rounded-lg mt-6 hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelboxCheckout;
