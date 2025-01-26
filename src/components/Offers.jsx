import React, { useState, useEffect } from 'react';
import { AlertCircle, Tag } from 'lucide-react';

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('https://mahaspice.desoftimp.com/ms3/get_offers.php');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        // Handle different possible response formats
        const offersList = Array.isArray(data) 
          ? data 
          : data.offers 
          ? data.offers 
          : data.data 
          ? data.data 
          : [];

        setOffers(offersList);
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
      <h1 className="text-3xl font-bold text-green-700 mb-6">Active Offers</h1>
      {offers.length === 0 ? (
        <div className="text-center text-gray-500">
          No active offers at the moment.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div 
              key={offer.id || Math.random()} 
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                <Tag className="text-green-600 mr-3" />
                <h2 className="text-xl font-semibold text-green-800">
                  {offer.title || 'Untitled Offer'}
                </h2>
              </div>
              <p className="text-gray-600 mb-4">
                {offer.description || 'No description available'}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-bold">
                  {offer.discount ? `${offer.discount}% OFF` : 'No Discount'}
                </span>
                <span className="text-gray-500">
                  {offer.end_date || 'No Expiry'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OffersPage;