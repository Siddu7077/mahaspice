
// Royal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Royal = () => {
   const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isVeg, setIsVeg] = useState(true);

  useEffect(() => {
    fetchItems('ROYAL');
  }, []);

  const fetchItems = async (type) => {
    try {
      const response = await axios.get('https://mahaspice.desoftimp.com/ms3/getsf_items_with_category.php');
      if (response.data.success) {
        const classicItems = response.data.items.filter(item => item.type === type);
        setItems(classicItems);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  };

  const toggleVeg = () => {
    setIsVeg(prevState => !prevState);
  };

  const toggleItem = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(prevState => prevState.filter(i => i.id !== item.id));
    } else {
      setSelectedItems(prevState => [...prevState, item]);
    }
  };

  return (
    <div>
      <h2>Platinum</h2>
      <div className="veg-toggle">
        <span className={`veg-option ${isVeg ? 'active' : ''}`} onClick={toggleVeg}>Veg</span>
        <span className={`veg-option ${!isVeg ? 'active' : ''}`} onClick={toggleVeg}>Non-Veg</span>
      </div>
      <div className="menu-items">
        {items.filter(item => isVeg ? item.is_veg : true).map(item => (
          <div
            key={item.id}
            className={`menu-item ${selectedItems.includes(item) ? 'selected' : ''}`}
            onClick={() => toggleItem(item)}
          >
            <span className="item-name">{item.name}</span>
            <span className="item-type">{item.is_veg ? 'Veg' : 'Non-Veg'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Royal;
