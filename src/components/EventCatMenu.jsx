// import React, { useState } from 'react';

// const occasions = [
//   'Birthday', 
//   'Wedding', 
//   'Corporate Event', 
//   'Anniversary', 
//   'Other'
// ];

// const EventCatMenu = () => {
//   const [isModalOpen, setIsModalOpen] = useState(true);
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     email: '',
//     guests: 1,
//     date: '',
//     time: '',
//     occasion: ''
//   });
//   const [formErrors, setFormErrors] = useState({});

//   const [selectedCategory, setSelectedCategory] = useState('Appetizers');
//   const [selectedItems, setSelectedItems] = useState({});
//   const [foodFilter, setFoodFilter] = useState('all');

//   const menuCategories = {
//     'Appetizers': [
//       { name: 'Samosa', type: 'veg' },
//       { name: 'Chicken Tikka', type: 'non-veg' },
//       { name: 'Paneer Pakora', type: 'veg' },
//       { name: 'Chicken Wings', type: 'non-veg' },
//       { name: 'Vegetable Spring Rolls', type: 'veg' }
//     ],
//     'Main Course': [
//       { name: 'Butter Chicken', type: 'non-veg' },
//       { name: 'Vegetable Biryani', type: 'veg' },
//       { name: 'Fish Curry', type: 'non-veg' },
//       { name: 'Paneer Butter Masala', type: 'veg' },
//       { name: 'Lamb Rogan Josh', type: 'non-veg' }
//     ],
//     'Desserts': [
//       { name: 'Gulab Jamun', type: 'veg' },
//       { name: 'Rasmalai', type: 'veg' },
//       { name: 'Chocolate Mousse', type: 'veg' },
//       { name: 'Kulfi', type: 'veg' }
//     ]
//   };

//   const validateForm = () => {
//     const errors = {};
    
//     if (!formData.name.trim()) {
//       errors.name = 'Name is required';
//     }

//     if (!formData.phone.trim()) {
//       errors.phone = 'Phone number is required';
//     } else if (!/^\d{10}$/.test(formData.phone.trim())) {
//       errors.phone = 'Phone number must be 10 digits';
//     }

//     if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
//       errors.email = 'Invalid email format';
//     }

//     if (!formData.date) {
//       errors.date = 'Date is required';
//     }

//     if (!formData.time) {
//       errors.time = 'Time is required';
//     }

//     if (!formData.occasion) {
//       errors.occasion = 'Occasion is required';
//     }

//     if (formData.guests < 1) {
//       errors.guests = 'Guests must be at least 1';
//     }

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       setIsModalOpen(false);
//     }
//   };

//   const handleItemSelect = (category, item) => {
//     setSelectedItems(prev => ({
//       ...prev,
//       [category]: prev[category] 
//         ? prev[category].includes(item)
//           ? prev[category].filter(i => i !== item)
//           : [...prev[category], item]
//         : [item]
//     }));
//   };

//   const filteredMenuItems = selectedCategory 
//     ? menuCategories[selectedCategory].filter(item => 
//         foodFilter === 'all' || item.type === foodFilter
//       )
//     : [];

//   // Rest of the previous component remains the same...
//   // (Keeping the existing render logic from the previous implementation)

//   return (
//     <>
//       {/* Initial Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl">
//             <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
//               Event Details
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Name <span className="text-red-500">*</span>
//                 </label>
//                 <input 
//                   type="text" 
//                   value={formData.name}
//                   onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
//                   className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
//                     formErrors.name ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                   placeholder="Enter Full Name"
//                 />
//                 {formErrors.name && (
//                   <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Phone <span className="text-red-500">*</span>
//                 </label>
//                 <input 
//                   type="tel" 
//                   value={formData.phone}
//                   onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
//                   className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
//                     formErrors.phone ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                   placeholder="10-digit Phone Number"
//                 />
//                 {formErrors.phone && (
//                   <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Email (Optional)
//                 </label>
//                 <input 
//                   type="email" 
//                   value={formData.email}
//                   onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
//                   className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
//                     formErrors.email ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                   placeholder="Enter Email (Optional)"
//                 />
//                 {formErrors.email && (
//                   <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Number of Guests <span className="text-red-500">*</span>
//                 </label>
//                 <input 
//                   type="number" 
//                   min="1"
//                   value={formData.guests}
//                   onChange={(e) => setFormData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
//                   className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
//                     formErrors.guests ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                 />
//                 {formErrors.guests && (
//                   <p className="text-red-500 text-sm mt-1">{formErrors.guests}</p>
//                 )}
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Date <span className="text-red-500">*</span>
//                   </label>
//                   <input 
//                     type="date" 
//                     value={formData.date}
//                     onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
//                     className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
//                       formErrors.date ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                   />
//                   {formErrors.date && (
//                     <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Time <span className="text-red-500">*</span>
//                   </label>
//                   <input 
//                     type="time" 
//                     value={formData.time}
//                     onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
//                     className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
//                       formErrors.time ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                   />
//                   {formErrors.time && (
//                     <p className="text-red-500 text-sm mt-1">{formErrors.time}</p>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Occasion <span className="text-red-500">*</span>
//                 </label>
//                 <select 
//                   value={formData.occasion}
//                   onChange={(e) => setFormData(prev => ({ ...prev, occasion: e.target.value }))}
//                   className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
//                     formErrors.occasion ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                 >
//                   <option value="">Select Occasion</option>
//                   {occasions.map(occasion => (
//                     <option key={occasion} value={occasion}>
//                       {occasion}
//                     </option>
//                   ))}
//                 </select>
//                 {formErrors.occasion && (
//                   <p className="text-red-500 text-sm mt-1">{formErrors.occasion}</p>
//                 )}
//               </div>

//               <button 
//                 type="submit"
//                 className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
//               >
//                 Continue to Menu
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Only render the main menu if modal is closed */}
//       {!isModalOpen && (
//         <div className="min-h-screen bg-[#F5F9FD] p-8">
//           {/* Existing render logic from previous implementation */}
//           <div className="flex space-x-6">
//             {/* Left Column */}
//             <div className="w-1/5 space-y-6">
//               {/* Categories */}
//               <div className="bg-white p-6 rounded-xl shadow-md">
//                 <h2 className="text-xl font-bold mb-4 text-gray-800">Categories</h2>
//                 <div className="space-y-2">
//                   {Object.keys(menuCategories).map(category => (
//                     <button
//                       key={category}
//                       onClick={() => setSelectedCategory(category)}
//                       className={`w-full p-2 rounded-lg transition text-left ${
//                         selectedCategory === category 
//                           ? 'bg-green-600 text-white' 
//                           : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                       }`}
//                     >
//                       {category}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Food Type Filter */}
//               <div className="bg-white p-6 rounded-xl shadow-md">
//                 <h2 className="text-xl font-bold mb-4 text-gray-800">Food Type</h2>
//                 <div className="grid grid-cols-3 gap-2">
//                   <button
//                     onClick={() => setFoodFilter('all')}
//                     className={`p-2 rounded-lg transition ${
//                       foodFilter === 'all' 
//                         ? 'bg-green-600 text-white' 
//                         : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                     }`}
//                   >
//                     All
//                   </button>
//                   <button
//                     onClick={() => setFoodFilter('veg')}
//                     className={`p-2 rounded-lg transition ${
//                       foodFilter === 'veg' 
//                         ? 'bg-green-600 text-white' 
//                         : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                     }`}
//                   >
//                     Veg
//                   </button>
//                   <button
//                     onClick={() => setFoodFilter('non-veg')}
//                     className={`p-2 rounded-lg transition ${
//                       foodFilter === 'non-veg' 
//                         ? 'bg-green-600 text-white' 
//                         : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                     }`}
//                   >
//                     Non-Veg
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Center Column */}
//             <div className="w-3/5 bg-white p-6 rounded-xl shadow-md">
//               <h2 className="text-2xl font-bold mb-6 text-gray-800">
//                 {selectedCategory} Menu
//               </h2>
//               <div className="grid grid-cols-2 gap-4">
//                 {filteredMenuItems.map(item => (
//                   <div 
//                     key={item.name} 
//                     className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
//                   >
//                     <div>
//                       <h3 className="font-semibold">{item.name}</h3>
//                       <p className={`text-sm ${
//                         item.type === 'veg' ? 'text-green-600' : 'text-red-600'
//                       }`}>
//                         {item.type === 'veg' ? '🥗 Vegetarian' : '🍗 Non-Vegetarian'}
//                       </p>
//                     </div>
//                     <input 
//                       type="checkbox"
//                       checked={
//                         selectedItems[selectedCategory]?.includes(item.name) || false
//                       }
//                       onChange={() => handleItemSelect(selectedCategory, item.name)}
//                       className="form-checkbox h-5 w-5 text-green-600"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Right Column */}
//             <div className="w-1/5 bg-white p-6 rounded-xl shadow-md">
//               <h2 className="text-xl font-bold mb-4 text-gray-800">Selected Items</h2>
//               <div className="space-y-4">
//                 {Object.entries(selectedItems).map(([category, items]) => (
//                   <div key={category} className="bg-gray-50 p-4 rounded-lg">
//                     <h3 className="font-semibold text-gray-700 mb-2">{category}</h3>
//                     {items.map(item => (
//                       <div 
//                         key={item} 
//                         className="flex justify-between items-center py-2 border-b last:border-b-0"
//                       >
//                         <span className="text-sm">{item}</span>
//                         <button 
//                           onClick={() => {
//                             setSelectedItems(prev => {
//                               const updatedCategory = prev[category].filter(i => i !== item);
//                               return updatedCategory.length > 0
//                                 ? { ...prev, [category]: updatedCategory }
//                                 : Object.fromEntries(
//                                     Object.entries(prev).filter(([k]) => k !== category)
//                                   );
//                             });
//                           }}
//                           className="text-red-500 hover:text-red-700 text-sm"
//                         >
//                           ✕
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 ))}
//                 <button 
//                   className="w-full mt-4 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
//                   disabled={Object.keys(selectedItems).length === 0}
//                   onClick={() => {
//                     alert('Proceeding to checkout with selected items');
//                   }}
//                 >
//                   Proceed to Checkout
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default EventCatMenu;

import React, { useState } from 'react';

const occasions = [
  'Birthday', 
  'Wedding', 
  'Corporate Event', 
  'Anniversary', 
  'Other'
];

const EventCatMenu = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    guests: 1,
    date: '',
    time: '',
    occasion: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const [selectedCategory, setSelectedCategory] = useState('Appetizers');
  const [selectedItems, setSelectedItems] = useState({});
  const [foodFilter, setFoodFilter] = useState('all');

  const menuCategories = {
    'Appetizers': [
      { name: 'Samosa', type: 'veg' },
      { name: 'Chicken Tikka', type: 'non-veg' },
      { name: 'Paneer Pakora', type: 'veg' },
      { name: 'Chicken Wings', type: 'non-veg' },
      { name: 'Vegetable Spring Rolls', type: 'veg' }
    ],
    'Main Course': [
      { name: 'Butter Chicken', type: 'non-veg' },
      { name: 'Vegetable Biryani', type: 'veg' },
      { name: 'Fish Curry', type: 'non-veg' },
      { name: 'Paneer Butter Masala', type: 'veg' },
      { name: 'Lamb Rogan Josh', type: 'non-veg' }
    ],
    'Desserts': [
      { name: 'Gulab Jamun', type: 'veg' },
      { name: 'Rasmalai', type: 'veg' },
      { name: 'Chocolate Mousse', type: 'veg' },
      { name: 'Kulfi', type: 'veg' }
    ]
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      errors.phone = 'Phone number must be 10 digits';
    }

    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.date) {
      errors.date = 'Date is required';
    }

    if (!formData.time) {
      errors.time = 'Time is required';
    }

    if (!formData.occasion) {
      errors.occasion = 'Occasion is required';
    }

    if (formData.guests < 1) {
      errors.guests = 'Guests must be at least 1';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsModalOpen(false);
      setIsEditingDetails(false);
    }
  };

  const handleItemSelect = (category, item) => {
    setSelectedItems(prev => ({
      ...prev,
      [category]: prev[category] 
        ? prev[category].includes(item)
          ? prev[category].filter(i => i !== item)
          : [...prev[category], item]
        : [item]
    }));
  };

  const filteredMenuItems = selectedCategory 
    ? menuCategories[selectedCategory].filter(item => 
        foodFilter === 'all' || item.type === foodFilter
      )
    : [];

  return (
    <>
      {/* Initial Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Event Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter Full Name"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                    formErrors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="10-digit Phone Number"
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email (Optional)
                </label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter Email (Optional)"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Number of Guests <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  min="1"
                  value={formData.guests}
                  onChange={(e) => setFormData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                  className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                    formErrors.guests ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.guests && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.guests}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                      formErrors.date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.date && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="time" 
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                      formErrors.time ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.time && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.time}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Occasion <span className="text-red-500">*</span>
                </label>
                <select 
                  value={formData.occasion}
                  onChange={(e) => setFormData(prev => ({ ...prev, occasion: e.target.value }))}
                  className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                    formErrors.occasion ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Occasion</option>
                  {occasions.map(occasion => (
                    <option key={occasion} value={occasion}>
                      {occasion}
                    </option>
                  ))}
                </select>
                {formErrors.occasion && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.occasion}</p>
                )}
              </div>

              <button 
                type="submit"
                className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
              >
                Continue to Menu
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Menu Content */}
      {!isModalOpen && (
        <div className="min-h-screen bg-[#F5F9FD] p-8">
          {/* User Details Section */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Event Details</h2>
              <button 
                onClick={() => setIsEditingDetails(true)}
                className="text-green-600 hover:text-green-800 transition"
              >
                Edit Details
              </button>
            </div>

            {/* Editing Mode */}
            {isEditingDetails ? (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                        formErrors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter Full Name"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                        formErrors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="10-digit Phone Number"
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email (Optional)
                    </label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter Email"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Number of Guests <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="number" 
                      min="1"
                      value={formData.guests}
                      onChange={(e) => setFormData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                      className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                        formErrors.guests ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.guests && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.guests}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                        formErrors.date ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.date && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="time" 
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                      className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                        formErrors.time ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.time && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.time}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Occasion <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={formData.occasion}
                    onChange={(e) => setFormData(prev => ({ ...prev, occasion: e.target.value }))}
                    className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                      formErrors.occasion ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Occasion</option>
                    {occasions.map(occasion => (
                      <option key={occasion} value={occasion}>
                        {occasion}
                      </option>
                    ))}
                  </select>
                  {formErrors.occasion && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.occasion}</p>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button 
                    type="submit"
                    className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
                  >
                    Save Changes
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsEditingDetails(false)}
                    className="w-full bg-gray-200 text-gray-800 p-3 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              // Details Display Mode
              <div className="mt-4 grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold">{formData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{formData.phone}</p>
                </div>
                {formData.email && (
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold">{formData.email}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Guests</p>
                  <p className="font-semibold">{formData.guests}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold">{formData.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-semibold">{formData.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Occasion</p>
                  <p className="font-semibold">{formData.occasion}</p>
                </div>
              </div>
            )}
          </div>

          {/* Existing menu content */}
          <div className="flex space-x-6">
          <div className="w-1/5 space-y-6">
               {/* Categories */}
               <div className="bg-white p-6 rounded-xl shadow-md">
                 <h2 className="text-xl font-bold mb-4 text-gray-800">Categories</h2>
                 <div className="space-y-2">
                   {Object.keys(menuCategories).map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full p-2 rounded-lg transition text-left ${
                        selectedCategory === category 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Food Type Filter */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Food Type</h2>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setFoodFilter('all')}
                    className={`p-2 rounded-lg transition ${
                      foodFilter === 'all' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFoodFilter('veg')}
                    className={`p-2 rounded-lg transition ${
                      foodFilter === 'veg' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Veg
                  </button>
                  <button
                    onClick={() => setFoodFilter('non-veg')}
                    className={`p-2 rounded-lg transition ${
                      foodFilter === 'non-veg' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Non-Veg
                  </button>
                </div>
              </div>
            </div>

            {/* Center Column */}
            <div className="w-3/5 bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {selectedCategory} Menu
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {filteredMenuItems.map(item => (
                  <div 
                    key={item.name} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className={`text-sm ${
                        item.type === 'veg' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.type === 'veg' ? '🥗 Vegetarian' : '🍗 Non-Vegetarian'}
                      </p>
                    </div>
                    <input 
                      type="checkbox"
                      checked={
                        selectedItems[selectedCategory]?.includes(item.name) || false
                      }
                      onChange={() => handleItemSelect(selectedCategory, item.name)}
                      className="form-checkbox h-5 w-5 text-green-600"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="w-1/5 bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Selected Items</h2>
              <div className="space-y-4">
                {Object.entries(selectedItems).map(([category, items]) => (
                  <div key={category} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2">{category}</h3>
                    {items.map(item => (
                      <div 
                        key={item} 
                        className="flex justify-between items-center py-2 border-b last:border-b-0"
                      >
                        <span className="text-sm">{item}</span>
                        <button 
                          onClick={() => {
                            setSelectedItems(prev => {
                              const updatedCategory = prev[category].filter(i => i !== item);
                              return updatedCategory.length > 0
                                ? { ...prev, [category]: updatedCategory }
                                : Object.fromEntries(
                                    Object.entries(prev).filter(([k]) => k !== category)
                                  );
                            });
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
                <button 
                  className="w-full mt-4 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
                  disabled={Object.keys(selectedItems).length === 0}
                  onClick={() => {
                    alert('Proceeding to checkout with selected items');
                  }}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventCatMenu;