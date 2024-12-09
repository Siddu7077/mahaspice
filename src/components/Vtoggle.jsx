import React, { useState } from 'react';

const VegNonVegToggle = ({ onToggle }) => {
  const [isVeg, setIsVeg] = useState(true);

  const handleToggle = () => {
    const newVegStatus = !isVeg;
    setIsVeg(newVegStatus);
    onToggle(newVegStatus);
  };

  return (
    <div className="flex items-center m-2 space-x-3">
      <span className={`font-medium ${!isVeg ? 'text-green-600' : 'text-gray-400'}`}>
        Veg
      </span>
      <button 
        onClick={handleToggle}
        className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${
          isVeg ? 'bg-red-500' : 'bg-green-500'
        }`}
      >
        <div 
          className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            isVeg ? 'translate-x-7' : 'translate-x-0'
          }`}
        ></div>
      </button>
      <span className={`font-medium ${isVeg ? 'text-red-600' : 'text-gray-400'}`}>
        Non-Veg
      </span>
    </div>
  );
};

export default VegNonVegToggle;