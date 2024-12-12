import React from 'react';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaPinterestP, FaShareAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SocialIcons = () => {
    const navigate = useNavigate();

    const handleNavigation = (url) => {
        window.open(url, '_blank');
    };
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Check this out!',
                url: window.location.href,
            });
        } else {
            // Fallback to clipboard copy
            navigator.clipboard.writeText(window.location.href);
            alert('URL copied to clipboard.');
        }
    };

    return (
        <div className="fixed top-1/2 -translate-y-1/2 ml-6 rounded bg-[#e5e5e5] right-4 p-4 z-10 flex flex-col gap-4">
            <button
                onClick={() => handleNavigation('https://www.facebook.com')}
                className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
            >
                <FaFacebookF />
            </button>
            <button
                onClick={() => handleNavigation('https://twitter.com')}
                className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
            >
                <FaTwitter />
            </button>
            <button
                onClick={() => handleNavigation('https://www.whatsapp.com')}
                className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors"
            >
                <FaWhatsapp />
            </button>
            <button
                onClick={() => handleNavigation('https://www.pinterest.com')}
                className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
            >
                <FaPinterestP />
            </button>
            <button
                onClick={handleShare}
                className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
            >
                <FaShareAlt />
            </button>
        </div>
    );
};

export default SocialIcons;
