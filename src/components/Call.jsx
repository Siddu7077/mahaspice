import React, { useState } from 'react';
import { Phone } from 'lucide-react';

const CallButton = () => {
    const handleCall = () => {
        // Multiple approaches to handle call initiation
        try {
            
            window.location.href = 'tel:+919697798888';

            
            const a = document.createElement('a');
            a.href = 'tel:+919697798888';
            a.click();
        } catch (error) { 
            
            alert('Call +91 969779 8888');
        }
    };

    return (
        <div
            className="fixed bottom-24 right-2 z-50 cursor-pointer"
            onClick={handleCall}
        >
            <div className="bg-green-500  mr-4 mb-3 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all duration-300 ease-in-out transform hover:scale-110">
                <Phone
                    size={24}
                    strokeWidth={2}
                    className="animate-pulse"
                />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-red-500 w-24  text-white text-xs px-2 py-1 rounded-full">
            969779 8888
            </div>
        </div>
    );
};

export default CallButton;