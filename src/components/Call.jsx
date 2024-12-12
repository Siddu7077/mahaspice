import React, { useState } from 'react';
import { Phone } from 'lucide-react';

const CallButton = () => {
    const handleCall = () => {
        // Multiple approaches to handle call initiation
        try {
            
            window.location.href = 'tel:+917288041656';

            
            const a = document.createElement('a');
            a.href = 'tel:+917288041656';
            a.click();
        } catch (error) {
            
            alert('Call +91 72880 41656');
        }
    };

    return (
        <div
            className="fixed bottom-16 right-6 z-50 cursor-pointer"
            onClick={handleCall}
        >
            <div className="bg-green-500 mb-3 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all duration-300 ease-in-out transform hover:scale-110">
                <Phone
                    size={24}
                    strokeWidth={2}
                    className="animate-pulse"
                />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-red-500  text-white text-xs px-2 py-1 rounded-full">
                Support
            </div>
        </div>
    );
};

export default CallButton;