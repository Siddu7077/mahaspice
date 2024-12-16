import React, { useState } from 'react';

function AddMenu() {
  const [menuType, setMenuType] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('menu_type', menuType);
    formData.append('image_address', image);

    try {
      const response = await fetch('http://orchid-grasshopper-305065.hostingersite.com/ms3/AddMenu.php', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setMessage(result.message);

      if (response.ok) {
        alert('Menu item added successfully!');
        setMenuType('');  // Optionally, reset form fields
        setImage(null);  // Optionally, reset image
        setImagePreview(null);  // Optionally, reset image preview
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-full max-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-indigo-600 mb-6">Add New Menu Item</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label htmlFor="menu_type" className="text-lg font-medium text-gray-700">Menu Type</label>
            <input
              type="text"
              id="menu_type"
              value={menuType}
              onChange={(e) => setMenuType(e.target.value)}
              required
              placeholder="Enter menu type"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="image_address" className="text-lg font-medium text-gray-700 flex items-center space-x-2">
              <span>Upload Image</span>
            </label>
            <input
              type="file"
              id="image_address"
              onChange={handleImageChange}
              required
              className="w-full p-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {imagePreview && (
            <div className="mt-4 flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Image Preview</h3>
              <img
                src={imagePreview}
                alt="Preview"
                className="h-48 object-cover rounded-lg shadow-md"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white text-lg font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
          >
            Add Menu Item
          </button>

          {/* {message && (
            <div className="mt-4 text-center">
              <p
                className={`text-lg font-semibold ${
                  message.includes('successfully') ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {message}
              </p>
            </div>
          )} */}
        </form>
      </div>
    </div>
  );
}

export default AddMenu;
