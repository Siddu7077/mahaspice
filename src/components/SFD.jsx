import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SFD = () => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const deliveryData = {
        title: "Superfast Delivery",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTivrL8reKCj8qSZ2nxcQBETtngJ4aL2NzuTg&s",
        link: "/superfastDelivery",
    };

    const handleNavigation = () => {
        navigate(deliveryData.link);
    };

    return (
        <div
            className="flex fixed right-0 bottom-44 z-50 transition-all duration-300 ease-in-out"
            style={{ paddingRight: '20px' }}
        >
            <div
                className={`flex items-center gap-4 p-4 bg-gray-200 text-black rounded-lg shadow-lg cursor-pointer transition-all duration-300 ease-in-out
                    `}
                // onMouseEnter={() => setIsHovered(true)}
                // onMouseLeave={() => setIsHovered(false)}
                onClick={handleNavigation}
            >
                {/* Icon */}
                <img
                    src={deliveryData.image}
                    alt={deliveryData.title}
                    className={`rounded-full shadow-lg transition-all duration-300
                        ${isHovered ? 'w-20 h-20' : 'w-12 h-12'}`}
                />

                {/* Text */}
                <div
                    className={`flex flex-col transition-all duration-300 text-center ${isHovered ? 'text-xl font-bold' : 'text-base'}`}
                >
                    {deliveryData.title}
                    <button
                    className="mt-2 px-4 py-2 bg-white text-black rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                    Order Now
                </button>
                </div>
                
            </div>
        </div>
    );
};
export default SFD;
