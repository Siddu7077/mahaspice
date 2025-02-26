import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const NavbarOffers = ({ isNavExpanded }) => {
    const [offers, setOffers] = useState([]);
    const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const baseUrl = 'https://adminmahaspice.in/ms3/';

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${baseUrl}get_offers.php`);
                const data = response.data;
                
                // Handle different possible response formats
                const offersList = Array.isArray(data) 
                    ? data 
                    : data.offers 
                        ? data.offers 
                        : [];
                
                // Filter active offers
                const activeOffers = offersList.filter(offer => 
                    offer.is_active === '1' || offer.is_active === 1 || offer.is_active === true
                );
                
                setOffers(activeOffers);
            } catch (error) {
                console.error('Failed to fetch offers:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOffers();
    }, []);

    useEffect(() => {
        if (offers.length > 1) {
            const timer = setInterval(() => {
                setCurrentOfferIndex(prevIndex => 
                    prevIndex === offers.length - 1 ? 0 : prevIndex + 1
                );
            }, 10000); // 10 seconds

            return () => clearInterval(timer);
        }
    }, [offers.length]);

    if (isLoading || offers.length === 0) {
        return null;
    }

    const currentOffer = offers[currentOfferIndex];
    const imagePath = `${baseUrl}uploads/offers/${currentOffer.img_address}`;

    return (
        <div className="p-4 flex flex-col items-center justify-between">
            <Link to="/offers" className="relative block w-40 h-40">
                {/* Expanded nav image */}
                <img
                    src={imagePath}
                    alt={currentOffer.description || `Offer ${currentOfferIndex + 1}`}
                    className={`${
                        isNavExpanded ? "block" : "hidden"
                    } h-30 w-40 object-cover rounded-lg transition-opacity duration-300`}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.jpg'; // Add a fallback image
                    }}
                />
                {/* Collapsed nav image */}
                <img
                    src={imagePath}
                    alt={currentOffer.description || `Offer ${currentOfferIndex + 1}`}
                    className={`${
                        isNavExpanded ? "hidden" : "block"
                    } h-30 w-40 object-cover rounded-lg transition-opacity duration-300`}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.jpg'; // Add a fallback image
                    }}
                />
                
                {/* Optional: Add dots to show current offer position */}
                {offers.length > 1 && (
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                        {offers.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1.5 w-1.5 rounded-full ${
                                    index === currentOfferIndex 
                                        ? "bg-white" 
                                        : "bg-white/50"
                                }`}
                            />
                        ))}
                    </div>
                )}
            </Link>
        </div>
    );
};

export default NavbarOffers;