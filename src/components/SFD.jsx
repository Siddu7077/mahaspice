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
            className="fixed right-14 top-1/2 transform -translate-y-1/2 z-50 
                transition-all duration-300 ease-in-out"
            style={{
                paddingRight: '20px'
            }}
        >
            <div
                className={`relative cursor-pointer transition-all duration-300 ease-in-out
                    ${isHovered ? 'scale-300' : 'scale-100'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleNavigation}
            >
                <div 
                    className="inline-block text-white px-4 py-2 
                    rounded-md transition-colors"
                >
                    <img
                        src={deliveryData.image}
                        alt={deliveryData.title}
                        className={`rounded-full shadow-lg transition-all duration-300 
                            ${isHovered ? 'w-48 h-48' : 'w-16 h-16'}`}
                    />
                </div>

                {/* Hover Expanded View */}
                {isHovered && (
                    <div
                        className="absolute top-full left-1/2 transform -translate-x-1/2
                        bg-white rounded-lg shadow-xl p-4 w-64 text-center 
                        transition-all duration-300 z-50"
                    >
                        <h3 className="text-xl font-bold">{deliveryData.title}</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SFD;