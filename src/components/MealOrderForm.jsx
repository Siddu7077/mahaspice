import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, ChevronRight, Calendar, Clock, ChevronDownIcon } from 'lucide-react';
import { Menu } from '@headlessui/react';
import MealBox from './BoxGenie';
import DeliveryMenu from './Delivery';

const CustomMenu = ({ options, value, onChange, placeholder, className, icon: Icon }) => (
  <Menu as="div" className="relative w-full">
    <Menu.Button className="w-full flex items-center justify-between px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
      <div className="flex items-center">
        {Icon && <Icon className="text-gray-400 mr-2" size={20} />}
        <span className={`${!value ? 'text-gray-500' : 'text-gray-900'}`}>
          {value || placeholder}
        </span>
      </div>
      <ChevronDownIcon className="size-5 text-gray-400" />
    </Menu.Button>
    <Menu.Items className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
      <div className={`py-1 max-h-48 overflow-auto ${className}`}>
        {options.map((option) => (
          <Menu.Item key={option}>
            {({ active }) => (
              <button
                onClick={() => onChange(option)}
                className={`${
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } w-full text-left px-4 py-2 text-sm`}
              >
                {option}
              </button>
            )}
          </Menu.Item>
        ))}
      </div>
    </Menu.Items>
  </Menu>
);


const MealOrderForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: '',
    guestCount: 1,
    location: '',
    date: '',
    time: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const locations = [
    'HITEC City', 'Kondapur', 'Manikonda', 'Gachibowli', 
    'Jubilee Hills', 'Raidurg', 'Miyapur', 'Hafeezpet', 
    'Kukatpally', 'Banjara Hills'
  ];

  const serviceTypes = ['Meal Box', 'Delivery Box', 'Catering'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleMenuChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formSubmissionData = new FormData();
      Object.keys(formData).forEach(key => {
        formSubmissionData.append(key, formData[key]);
      });

      const response = await fetch('https://mahaspice.desoftimp.com/ms3/superfast.php', {
        method: 'POST',
        body: formSubmissionData
      });

      const result = await response.json();
      
      if (result.success) {
        setFormSubmitted(true);
      } else {
        alert('Order submission failed: ' + result.message);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting order');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-row p-6">
      {!formSubmitted ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  required
                  pattern="[0-9]{10}"
                  className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email (Optional)"
                  className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <CustomMenu
                options={serviceTypes}
                value={formData.serviceType}
                onChange={(value) => handleMenuChange('serviceType', value)}
                placeholder="Select Service Type"
              />

              <div>
                <label className="block mb-2 text-sm text-gray-600">Guest Count</label>
                <input
                  type="number"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleInputChange}
                  min="1"
                  max="50"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <CustomMenu
                options={locations}
                value={formData.location}
                onChange={(value) => handleMenuChange('location', value)}
                placeholder="Select Delivery Location"
                className="max-h-6 overflow-auto"
                icon={MapPin}
              />

              <button 
                type="submit" 
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition flex items-center justify-center"
              >
                Next <ChevronRight className="ml-2" size={20} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-grow flex flex-col">
          <div className="w-full p-8 bg-gray-100">
            {formData.serviceType === 'Meal Box' && <MealBox />}
            {formData.serviceType === 'Delivery Box' && <DeliveryMenu />}
          </div>
        </div>
      )}
    </div>
  );
};

export default MealOrderForm;