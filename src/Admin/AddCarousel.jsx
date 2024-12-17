import React, { useState } from 'react';
import { X, Plus, Upload, Trash2 } from 'lucide-react';

const AddCarousel = () => {
  // State for form fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [buttonText, setButtonText] = useState('');
  const [platformButtons, setPlatformButtons] = useState([{ name: '', url: '' }]);
  const [priceInfo, setPriceInfo] = useState([{ label: '', value: '' }]);
  const [isActive, setIsActive] = useState(false);

  // Error state
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  // Type options
  const typeOptions = [
    { value: '', label: 'Select Type' },
    { value: null, label: 'None' },
    { value: 'featured', label: 'Featured' },
    { value: 'new', label: 'New' },
    { value: 'promotional', label: 'Promotional' }
  ];

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic file type and size validation
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev, 
          image: 'Invalid file type. Please upload JPEG, PNG, or WebP.'
        }));
        return;
      }

      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev, 
          image: 'File size exceeds 5MB limit.'
        }));
        return;
      }

      setImageFile(file);
      // Clear previous image error
      const { image, ...rest } = errors;
      setErrors(rest);
    }
  };

  // Manage platform buttons
  const addPlatformButton = () => {
    setPlatformButtons([...platformButtons, { name: '', url: '' }]);
  };

  const updatePlatformButton = (index, field, value) => {
    const updatedButtons = [...platformButtons];
    updatedButtons[index][field] = value;
    setPlatformButtons(updatedButtons);
  };

  const removePlatformButton = (index) => {
    const updatedButtons = platformButtons.filter((_, i) => i !== index);
    setPlatformButtons(updatedButtons);
  };

  // Manage price information
  const addPriceInfo = () => {
    setPriceInfo([...priceInfo, { label: '', value: '' }]);
  };

  const updatePriceInfo = (index, field, value) => {
    const updatedPrices = [...priceInfo];
    updatedPrices[index][field] = value;
    setPriceInfo(updatedPrices);
  };

  const removePriceInfo = (index) => {
    const updatedPrices = priceInfo.filter((_, i) => i !== index);
    setPriceInfo(updatedPrices);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    // Image validation
    if (!imageFile) {
      newErrors.image = 'Image is required';
    }

    // Platform buttons validation
    platformButtons.forEach((btn, index) => {
      if (btn.name && !btn.url) {
        newErrors[`platformButton${index}`] = 'URL is required if name is provided';
      }
      if (!btn.name && btn.url) {
        newErrors[`platformButton${index}`] = 'Name is required if URL is provided';
      }
    });

    // Price info validation
    priceInfo.forEach((price, index) => {
      if (price.label && !price.value) {
        newErrors[`priceInfo${index}`] = 'Value is required if label is provided';
      }
      if (!price.label && price.value) {
        newErrors[`priceInfo${index}`] = 'Label is required if value is provided';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitError(null);

  // Validate form
  if (!validateForm()) {
    return;
  }

  // Prepare form data
  const formData = new FormData();
  formData.append('title', title);
  formData.append('subtitle', subtitle || '');
  formData.append('description', description || '');
  formData.append('type', type || '');
  formData.append('buttonText', buttonText || '');
  formData.append('isActive', isActive);
  
  // Append image
  if (imageFile) {
    formData.append('image', imageFile);
  }

  // Append complex fields as JSON
  formData.append('platformButtons', JSON.stringify(platformButtons));
  formData.append('priceInfo', JSON.stringify(priceInfo));

  try {
    // Use your actual backend URL
    const response = await fetch('http://localhost/ms3/addCarousel.php', {
      method: 'POST',
      body: formData
    });

    // Get raw response text for debugging
    const responseText = await response.text();
    console.log('Raw Response:', responseText);

    // Try to parse as JSON
    try {
      const result = JSON.parse(responseText);
      
      if (!response.ok) {
        // Handle server-side errors
        throw new Error(result.message || 'Server error occurred');
      }

      // Success handling
      if (result.success) {
        // Reset form
        setTitle('');
        setSubtitle('');
        setDescription('');
        setType('');
        setImageFile(null);
        setButtonText('');
        setPlatformButtons([{ name: '', url: '' }]);
        setPriceInfo([{ label: '', value: '' }]);
        setIsActive(false);
        setErrors({});
        
        // Show success message
        alert('Carousel slide added successfully!');
      }
    } catch (jsonError) {
      console.error('JSON Parsing Error:', jsonError);
      setSubmitError('Received an invalid response from the server');
    }
  } catch (error) {
    console.error('Submission error:', error);
    setSubmitError(error.message || 'An unexpected error occurred');
  }
};
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Carousel Slide</h2>
      
      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{submitError}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="block mb-2 font-medium">
            Title <span className="text-red-500">*</span>
          </label>
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full p-2 border rounded ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter slide title"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Subtitle Input */}
        <div>
          <label className="block mb-2 font-medium">Subtitle</label>
          <input 
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Optional subtitle"
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block mb-2 font-medium">Description</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Optional description"
            rows="3"
          />
        </div>

        {/* Type Dropdown */}
        <div>
          <label className="block mb-2 font-medium">Type</label>
          <select 
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-2 font-medium">
            Image Upload <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center">
            <input 
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
              id="imageUpload"
            />
            <label 
              htmlFor="imageUpload" 
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
            >
              <Upload className="mr-2" size={20} />
              Choose File
            </label>
            {imageFile && (
              <span className="ml-4 text-sm text-gray-600">
                {imageFile.name}
              </span>
            )}
          </div>
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
        </div>

        {/* Button Text */}
        <div>
          <label className="block mb-2 font-medium">Button Text</label>
          <input 
            type="text"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Optional button text"
          />
        </div>

        {/* Platform Buttons */}
        <div>
          <label className="block mb-2 font-medium">Platform Buttons</label>
          {platformButtons.map((button, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input 
                type="text"
                value={button.name}
                onChange={(e) => updatePlatformButton(index, 'name', e.target.value)}
                className={`w-1/2 p-2 border rounded ${errors[`platformButton${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Button Name"
              />
              <input 
                type="text"
                value={button.url}
                onChange={(e) => updatePlatformButton(index, 'url', e.target.value)}
                className={`w-1/2 p-2 border rounded ${errors[`platformButton${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Button URL"
              />
              {index > 0 && (
                <button 
                  type="button"
                  onClick={() => removePlatformButton(index)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
          {platformButtons.map((_, index) => 
            errors[`platformButton${index}`] && (
              <p key={index} className="text-red-500 text-sm mt-1">
                {errors[`platformButton${index}`]}
              </p>
            )
          )}
          <button 
            type="button"
            onClick={addPlatformButton}
            className="flex items-center text-blue-500 hover:text-blue-600 mt-2"
          >
            <Plus className="mr-2" /> Add Platform Button
          </button>
        </div>

        {/* Price Information */}
        <div>
          <label className="block mb-2 font-medium">Price Information</label>
          {priceInfo.map((price, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input 
                type="text"
                value={price.label}
                onChange={(e) => updatePriceInfo(index, 'label', e.target.value)}
                className={`w-1/2 p-2 border rounded ${errors[`priceInfo${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Price Label"
              />
              <input 
                type="text"
                value={price.value}
                onChange={(e) => updatePriceInfo(index, 'value', e.target.value)}
                className={`w-1/2 p-2 border rounded ${errors[`priceInfo${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Price Value"
              />
              {index > 0 && (
                <button 
                  type="button"
                  onClick={() => removePriceInfo(index)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
          {priceInfo.map((_, index) => 
            errors[`priceInfo${index}`] && (
              <p key={index} className="text-red-500 text-sm mt-1">
                {errors[`priceInfo${index}`]}
              </p>
            )
          )}
          <button 
            type="button"
            onClick={addPriceInfo}
            className="flex items-center text-blue-500 hover:text-blue-600 mt-2"
          >
            <Plus className="mr-2" /> Add Price Information
          </button>
        </div>

        {/* Active Status Toggle */}
        <div className="flex items-center">
          <label className="mr-4 font-medium">Active Status</label>
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`w-16 h-8 rounded-full p-1 transition-colors duration-300 ${
              isActive ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                isActive ? 'translate-x-8' : 'translate-x-0'
              }`}
            />
          </button>
          <span className="ml-4 text-sm text-gray-600">
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button 
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors"
          >
            Add Carousel Slide
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCarousel;