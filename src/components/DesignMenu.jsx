import React, { useState } from 'react';
import { menuItems } from './menuDataForDOM';
import { MinusCircle, PlusCircle, Users, ChevronDown, Mail, Filter } from 'lucide-react';

const DesignMenu = () => {
  const [filter, setFilter] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  const [guests, setGuests] = useState(20);

  const handleGuestsChange = (value) => {
    // Ensure the value is at least 20
    const newValue = Math.max(20, value);
    setGuests(newValue);
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || 20;
    handleGuestsChange(value);
  };

  const handleItemSelect = (category, item) => {
    const newItem = {
      ...item,
      category,
      timestamp: Date.now()
    };
    
    if (selectedItems.some(selected => selected.id === item.id)) {
      setSelectedItems(selectedItems.filter(selected => selected.id !== item.id));
    } else {
      setSelectedItems([newItem, ...selectedItems]);
    }
  };

  const filterItems = (items) => {
    if (filter === 'all') return items;
    return items.filter(item => item.type === filter);
  };

  const categoryHasItems = (items) => {
    return filterItems(items).length > 0;
  };

  const VegNonVegIndicator = ({ type }) => (
    <span className={`w-4 h-4 border-2 ${type === 'veg' ? 'border-green-500' : 'border-red-500'} flex items-center justify-center`}>
      <span className={`w-2 h-2 ${type === 'veg' ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></span>
    </span>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex-1">
        {/* Filter Section */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex items-center bg-white rounded-lg border border-gray-200 px-4 py-2 cursor-pointer">
            <Filter className="w-5 h-5 text-gray-500 mr-2" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-transparent pr-8 focus:outline-none cursor-pointer"
            >
              <option value="all">All Items</option>
              <option value="veg">Veg Only</option>
              <option value="non-veg">Non-Veg Only</option>
            </select>
            <ChevronDown className="absolute right-3 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Menu Categories */}
        <div className="space-y-8 overflow-y-auto max-h-[calc(100vh-150px)]">
          {Object.entries(menuItems).map(([category, { title, items }]) => (
            categoryHasItems(items) && (
              <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                  <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filterItems(items).map((item) => {
                      const isSelected = selectedItems.some(selected => selected.id === item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleItemSelect(category, item)}
                          className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? 'bg-blue-50 border-2 border-blue-500' 
                              : 'border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/50'
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            readOnly
                          />
                          <span className="flex-1 font-medium text-gray-700">{item.name}</span>
                          <VegNonVegIndicator type={item.type} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Selection Panel */}
      <div className="w-full lg:w-96 bg-white rounded-xl shadow-sm border border-gray-100 h-fit sticky top-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Selection</h2>
          
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
              type="number"
              value={guests}
              onChange={handleInputChange}
              min="20"
              step="10"
              className="w-20 text-center font-semibold bg-white border border-gray-200 rounded-md py-1"
            />
            <button 
              onClick={() => handleGuestsChange(guests + 10)}
              className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <PlusCircle className="w-6 h-6" />
            </button>
          </div>

          {/* Selected Items List */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="font-semibold text-gray-700 mb-3">Selected Items</h3>
            <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
              {selectedItems.map((item) => (
                <div 
                  key={item.timestamp} 
                  className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{item.category}</div>
                    <div className="text-gray-600">{item.name}</div>
                  </div>
                  <VegNonVegIndicator type={item.type} />
                </div>
              ))}
            </div>
          </div>

          {/* Enquire Now Button */}
          <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium shadow-sm transition-all duration-200 flex items-center justify-center gap-2">
            <Mail className="w-5 h-5" />
            Enquire Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesignMenu;