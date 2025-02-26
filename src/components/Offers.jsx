import React, { useState, useEffect } from 'react';
import { AlertCircle, Tag } from 'lucide-react';

const OffersPage = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const baseUrl = 'https://adminmahaspice.in/ms3/';

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await fetch(`${baseUrl}get_offers.php`);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                // Handle different possible response formats and filter active offers
                const offersList = Array.isArray(data)
                    ? data
                    : data.offers
                        ? data.offers
                        : data.data
                            ? data.data
                            : [];

                // Filter only active offers
                const activeOffers = offersList.filter(offer => 
                    offer.is_active === '1' || offer.is_active === 1 || offer.is_active === true
                );

                setOffers(activeOffers);
                setLoading(false);
            } catch (error) {
                console.error('Fetch error:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-red-500">
                <AlertCircle size={48} />
                <p className="mt-4 text-xl">Error fetching offers: {error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-xl font-bold text-green-700 mb-6">Active Offers</h1>
            {offers.length === 0 ? (
                <div className="text-center text-gray-500">
                    No active offers at the moment.
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.map((offer) => (
                        <div 
                            key={offer.id} 
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="relative h-40">
                                <img
                                    src={`${baseUrl}uploads/offers/${offer.img_address}`}
                                    alt={offer.description}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-image.jpg'; // Add a placeholder image path
                                        e.target.onerror = null;
                                    }}
                                />
                            </div>
                            <div className="p-4">
                                <div className="flex items-start gap-2">
                                    <Tag className="text-green-600 mt-1" size={20} />
                                    <p className="text-gray-700 text-lg">{offer.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OffersPage;