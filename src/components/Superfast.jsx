import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import SuperfastMealBox from './SuperfastMeal';
import SuperfastDeliveryMenu from './SuperfastDelbox';

const Superfast = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone1: '',  // Changed from 'phone' to 'phone1' to match checkout form
    email: '',
    date: '',
    time: '',
    location: '',
    mealType: '',
    guestCount: '',
    boxType: '',
    coordinates: null,
  });

  const [minDate, setMinDate] = useState('');
  const [showNextComponent, setShowNextComponent] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [locationError, setLocationError] = useState(false);

  // Set minimum date when component mounts
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDateStr = tomorrow.toISOString().split('T')[0];
    setMinDate(minDateStr);

    // Set default date to tomorrow
    setFormData(prev => ({
      ...prev,
      date: minDateStr
    }));
  }, []);

  const serviceableAreas = [
    'hitech city',
    'madhapur',
    'gachibowli',
    'jubilee hills',
    'banjara hills',
    'kondapur'
  ];

  const isLocationServiceable = (location) => {
    return serviceableAreas.some(area =>
      location.toLowerCase().includes(area)
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLocationServiceable(formData.location)) {
      setLocationError(true);
      return;
    }

    // Transform the form data to match SuperfastDelboxCheckout's expected format
    const transformedFormData = {
      name: formData.name,
      phone1: formData.phone,  // Map phone to phone1
      email: formData.email,
      date: formData.date,
      time: formData.time,
      address: formData.location,  // Map location to address
      guestCount: parseInt(formData.guestCount),
    };

    setFormData(transformedFormData);
    setShowNextComponent(true);

    if (formData.mealType === 'breakfast') {
      setSelectedComponent('SuperfastMealbox');
    } else if (formData.boxType === 'mealbox') {
      setSelectedComponent('SuperfastMealbox');
    } else if (formData.boxType === 'deliverybox') {
      setSelectedComponent('SuperfastDelbox');
    }
  };

  const handleAutoDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();

            setFormData(prevData => ({
              ...prevData,
              location: data.address.road && data.address.suburb ?
                `${data.address.road}, ${data.address.suburb}` :
                `${data.address.suburb || data.address.road || 'Location detected'}`,
              coordinates: { lat: latitude, lng: longitude }
            }));
          } catch (error) {
            console.error('Error fetching location:', error);
            setFormData(prevData => ({
              ...prevData,
              location: 'Error detecting location'
            }));
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setFormData(prevData => ({
            ...prevData,
            location: 'Error detecting location'
          }));
        }
      );
    } else {
      setFormData(prevData => ({
        ...prevData,
        location: 'Geolocation not supported'
      }));
    }
  };

  if (locationError) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <div className="text-6xl mb-4">🏗️</div>
        <h2 className="text-2xl font-bold mb-4">Sit Tight! We're Coming Soon!</h2>
        <p className="text-gray-600 mb-6">
          Our team is working tirelessly to bring 10 minute deliveries to your location.
        </p>
        <button
          onClick={() => setLocationError(false)}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Try Another Location
        </button>
      </div>
    );
  }

  if (showNextComponent) {
    return (
      <div>
        {selectedComponent === 'SuperfastMealbox' && (
          <div className="p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Superfast Mealbox</h2>
            <SuperfastMealBox formData={formData} />
          </div>
        )}
        {selectedComponent === 'SuperfastDelbox' && (
          <div className="p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Superfast Delivery box</h2>
            <SuperfastDeliveryMenu formData={formData} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl my-4 mx-auto p-6 bg-aliceblue rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Details</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={minDate}
                className="w-full pl-10 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full pl-10 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
              <span className="text-sm text-gray-500 ml-2">(Serviceable areas: Hitech City, Madhapur, Gachibowli, Jubilee Hills, Banjara Hills, Kondapur)</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full pl-10 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Enter your location"
                />
              </div>
              <button
                type="button"
                onClick={handleAutoDetect}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Auto Detect
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
            <select
              name="mealType"
              value={formData.mealType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select meal type</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>

          {(formData.mealType === 'lunch' || formData.mealType === 'dinner') && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Box Type</label>
                <select
                  name="boxType"
                  value={formData.boxType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select box type</option>
                  <option value="mealbox">Meal Box</option>
                  <option value="deliverybox">Delivery Box</option>
                </select>
              </div>

              {formData.boxType === 'deliverybox' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guest Count</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      name="guestCount"
                      value={formData.guestCount}
                      onChange={handleInputChange}
                      className="w-full pl-10 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                      min="1"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default Superfast;