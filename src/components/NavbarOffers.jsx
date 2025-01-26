import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const NavbarOffers = ({ isNavExpanded }) => {
    const [offers, setOffers] = useState([]);
    const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await axios.get('https://mahaspice.desoftimp.com/ms3/get_offers.php');
                const activeOffers = response.data.offers.filter(offer => offer.is_active === '1');
                setOffers(activeOffers);
            } catch (error) {
                console.error('Failed to fetch offers', error);
            }
        };

        fetchOffers();
    }, []);

    useEffect(() => {
        if (offers.length > 1) {
            const timer = setInterval(() => {
                setCurrentOfferIndex((prevIndex) => 
                    (prevIndex + 1) % offers.length
                );
            }, 10000); // 10 seconds

            return () => clearInterval(timer);
        }
    }, [offers]);

    if (offers.length === 0) return null;

    const currentOffer = offers[currentOfferIndex];

    return (
        <div className="p-4 flex flex-col items-center justify-between">
            <Link to="/offers">
                <img
                    src={`https://mahaspice.desoftimp.com/ms3/${currentOffer.img_address}`}
                    alt={`Offer ${currentOfferIndex + 1}`}
                    className={`${isNavExpanded ? "block" : "hidden"} h-30 w-40 object-cover rounded-lg`}
                />
                <img
                    src={`https://mahaspice.desoftimp.com/ms3/${currentOffer.img_address}`}
                    alt={`Offer ${currentOfferIndex + 1}`}
                    className={`${isNavExpanded ? "hidden" : "block"} h-30 w-40 object-cover rounded-lg`}
                />
            </Link>
        </div>
    );
};

export default NavbarOffers;