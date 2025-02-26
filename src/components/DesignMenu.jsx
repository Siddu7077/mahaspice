import React, { useState, useEffect } from 'react';
import {
  Mail,
  Users,
  MinusCircle,
  PlusCircle,
  X,
  CheckCircle
} from 'lucide-react';

// Alert Message Component
const AlertMessage = ({ message, onClose }) => {
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1));
    }, 1000);

    const redirectTimer = setTimeout(() => {
      window.location.href = '/';
    }, 15000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
        <div className="flex flex-col items-center text-center gap-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
          <h3 className="text-xl font-bold text-gray-800">Success!</h3>
          <p className="text-gray-600">{message}</p>
          <p className="text-sm text-gray-500">Redirecting in {countdown} seconds...</p>
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const API_BASE_URL = 'https://adminmahaspice.in/ms3/design';

const DesignMenu = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [guests, setGuests] = useState(20);
  const [menuPreference, setMenuPreference] = useState('veg');
  const [inputValue, setInputValue] = useState(guests.toString());
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    delivery_date: ''
  });
  const [selectedItems, setSelectedItems] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/get_items.php`);
      const data = await response.json();
      console.log('Fetched items:', data);
      if (data.status === 'success' && Array.isArray(data.data)) {
        setItems(data.data);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_categories_for_items.php`);
      const data = await response.json();
      console.log('Fetched categories:', data);
      if (data.status === 'success' && Array.isArray(data.data)) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleGuestsChange = (value) => {
    const newValue = Math.max(20, value);
    setGuests(newValue);
    setInputValue(newValue.toString());
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setInputValue(value);
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue >= 20) {
        setGuests(numValue);
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Transform selected items into the correct format with category_name
    const selectedItemsList = Object.entries(selectedItems)
      .flatMap(([categoryId, itemsObj]) => {
        const category = categories.find(cat => cat.id === categoryId);
        return Object.entries(itemsObj)
          .filter(([_, isSelected]) => isSelected)
          .map(([itemId, _]) => {
            const itemData = items.find(item => item.id === itemId);
            return {
              category: category?.category_name || '',
              category_id: categoryId,
              category_name: category?.category_name || '',
              name: itemData?.name || '',
              type: itemData?.veg_nonveg || ''
            };
          });
      });

    try {
      const response = await fetch(`${API_BASE_URL}/enquiry.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          selectedItems: selectedItemsList,
          guests
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        setShowEnquiryForm(false);
        setShowAlert(true);
        setFormData({ name: '', email: '', phone: '', delivery_date: '' });
        setSelectedItems({});
      } else {
        throw new Error(data.message || 'Error submitting enquiry');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message);
      setShowErrorAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    if (menuPreference === 'veg') {
      return item.veg_nonveg === 'Veg';
    }
    return true;
  });

  const VegNonVegIndicator = ({ type }) => (
    <span className={`w-4 h-4 border-2 ${type === 'Veg' ? 'border-green-500' : 'border-red-500'} flex items-center justify-center`}>
      <span className={`w-2 h-2 ${type === 'Veg' ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></span>
    </span>
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-6 items-center justify-between">
            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
              <h1 className="text-3xl font-bold text-gray-800">Menu Selection</h1>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setMenuPreference('veg')}
                className={`px-4 py-2 rounded-lg transition-colors ${menuPreference === 'veg'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                  }`}
              >
                Veg
              </button>
              <button
                onClick={() => setMenuPreference('nonveg')}
                className={`px-4 py-2 rounded-lg transition-colors ${menuPreference === 'nonveg'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                  }`}
              >
                Non-Veg
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Selection Area */}
          <div className="lg:col-span-2">
            {categories.map((category) => {
              const categoryItems = filteredItems.filter(item =>
                String(item.category_id) === String(category.id)
              );

              return (
                <div key={category.id} className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
                  <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-800">{category.category_name}</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedItems(prev => ({
                            ...prev,
                            [category.id]: {
                              ...(prev[category.id] || {}),
                              [item.id]: !prev[category.id]?.[item.id]
                            }
                          }))}
                          className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all duration-200 ${selectedItems[category.id]?.[item.id]
                              ? 'bg-blue-50 border-2 border-blue-500'
                              : 'border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/50'
                            }`}
                        >
                          <input
                            type="checkbox"
                            checked={!!selectedItems[category.id]?.[item.id]}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300"
                            readOnly
                          />
                          <span className="flex-1 font-medium text-gray-700">{item.name}</span>
                          <VegNonVegIndicator type={item.veg_nonveg} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selection Panel */}
          <div className="lg:sticky lg:top-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Menu Details</h2>

              {/* Guests Counter */}
              <div className="flex items-center gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                <Users className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Guests:</span>
                <button
                  onClick={() => handleGuestsChange(guests - 10)}
                  className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <MinusCircle className="w-6 h-6" />
                </button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="w-20 text-center font-semibold bg-white border border-gray-200 rounded-md py-1"
                />
                <button
                  onClick={() => handleGuestsChange(guests + 10)}
                  className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <PlusCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Enquire Button */}
              <button
                onClick={() => setShowEnquiryForm(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Enquire Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Form Modal */}
      {showEnquiryForm && (
        <div className="fixed inset-0  flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Contact Details</h3>
              <button
                onClick={() => setShowEnquiryForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleEnquirySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Date
                </label>
                <input
                  type="date"
                  name="delivery_date"
                  value={formData.delivery_date}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Submitting...'
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Submit Enquiry
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
      {showAlert && (
        <AlertMessage
          message="Thank you for your enquiry! We will get back to you soon."
          onClose={() => {
            setShowAlert(false);
            window.location.href = '/';
          }}
        />
      )}

      {showErrorAlert && (
        <AlertMessage
          message={errorMessage || "An error occurred while submitting your enquiry."}
          onClose={() => setShowErrorAlert(false)}
        />
      )}
    </div>
  );
};

export default DesignMenu;