import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Platinum = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isVeg, setIsVeg] = useState(true);
  const [maxSelection, setMaxSelection] = useState(5); // Maximum number of items that can be selected

  useEffect(() => {
     fetchItems('Platinum');
    fetchCategories();
  }, []);

  // Fetch items from the getsf_items.php API
  const fetchItems = async () => {
    try {
      const response = await axios.get('https://mahaspice.desoftimp.com/ms3/getsf_items.php');
      if (response.data.success) {
        const platinumItems = response.data.items.filter(item => item.type === 'platinum');
        setItems(platinumItems);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  };

  // Fetch categories from the getsf_category.php API
  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://mahaspice.desoftimp.com/ms3/getsf_category.php');
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Toggle between Veg and Non-Veg
  const toggleVeg = () => {
    setIsVeg(prevState => !prevState);
  };

  // Handle item selection and deselection
  const toggleItem = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(prevState => prevState.filter(i => i.id !== item.id));
    } else {
      if (selectedItems.length < maxSelection) {
        setSelectedItems(prevState => [...prevState, item]);
      } else {
        alert(`You can select up to ${maxSelection} items only.`);
      }
    }
  };

  return (
    <div className="platinum-menu ">
      <h2 className="platinum-title">Platinum Menu</h2>
      
      {/* Veg/Non-Veg Toggle */}
      <div className="veg-toggle">
        <span className={`veg-option ${isVeg ? 'active' : ''}`} onClick={toggleVeg}>Veg</span>
        <span className={`veg-option ${!isVeg ? 'active' : ''}`} onClick={toggleVeg}>Non-Veg</span>
      </div>

      {/* Menu Items */}
      <div className="menu-items">
        {items
          .filter(item => isVeg ? item.is_veg : true)
          .sort((a, b) => a.position - b.position) // Sort by position in ascending order
          .map(item => (
            <div key={item.id} className="menu-item">
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-type">{item.is_veg ? 'Veg' : 'Non-Veg'}</p>
                <div className="category">
                  <span>Category: {categories.find(c => c.id === item.category_id)?.name || 'Unknown'}</span>
                </div>
              </div>
              
              <div className="item-actions">
                {/* Checkbox for selecting/deselecting items */}
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item)}
                  onChange={() => toggleItem(item)}
                  disabled={selectedItems.length >= maxSelection && !selectedItems.includes(item)}
                />
                <span className={`select-button ${selectedItems.includes(item) ? 'selected' : ''}`}>
                  {selectedItems.includes(item) ? 'Deselect' : 'Select'}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Platinum;
