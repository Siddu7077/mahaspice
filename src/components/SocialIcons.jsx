import React, { useState, useEffect } from 'react';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaPinterestP, FaShareAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const SocialIcons = () => {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        // Initial 10-second visibility
        const initialTimer = setTimeout(() => {
            setIsVisible(false);
        }, 10000);

        return () => clearTimeout(initialTimer);
    }, []);

    useEffect(() => {
        let timer;
        if (isHovered) {
            // Show for 5 seconds when hovered
            setIsVisible(true);
            timer = setTimeout(() => {
                setIsVisible(false);
                setIsHovered(false);
            }, 5000);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isHovered]);

    const handleNavigation = (url) => {
        window.open(url, '_blank');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Check this out!',
                url: window.location.href,
            }).catch(console.error);
        } else {
            // Fallback to clipboard copy
            navigator.clipboard.writeText(window.location.href)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                })
                .catch(err => console.error('Failed to copy: ', err));
        }
    };

    const socialButtons = [
        {
            icon: <FaFacebookF />,
            color: 'bg-blue-500 hover:bg-blue-600',
            url: 'https://www.facebook.com'
        },
        {
            icon: <FaTwitter />,
            color: 'bg-blue-400 hover:bg-blue-500',
            url: 'https://twitter.com'
        },
        {
            icon: <FaWhatsapp />,
            color: 'bg-green-500 hover:bg-green-600',
            url: 'https://www.whatsapp.com'
        },
        {
            icon: <FaPinterestP />,
            color: 'bg-red-500 hover:bg-red-600',
            url: 'https://www.pinterest.com'
        },
        {
            icon: <FaShareAlt />,
            color: 'bg-blue-400 hover:bg-blue-500',
            onClick: handleShare
        }
    ];

    return (
        <>
            
            <div 
                className={`fixed right-4 top-1/2 -translate-y-1/2 z-10 transition-all duration-300 
                    ${isVisible ? 'w-auto opacity-100' : 'w-12 opacity-70'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    if (!isVisible) {
                        setTimeout(() => setIsHovered(false), 100);
                    }
                }}
            >
                {isVisible ? (
                    <div className="rounded bg-[#e5e5e5] p-4 flex flex-col gap-4">
                        {socialButtons.map((button, index) => (
                            <button
                                key={index}
                                onClick={button.onClick || (() => handleNavigation(button.url))}
                                className={`w-10 h-10 ${button.color} rounded-full flex items-center justify-center text-white transition-colors relative`}
                            >
                                {button.icon}
                                {copied && button.icon.type === FaShareAlt && (
                                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                                        bg-black text-white text-xs px-2 py-1 rounded">
                                        Copied!
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <FaShareAlt className="text-white" />
                    </div>
                )}
            </div>
        </>
    );
};

export default SocialIcons;