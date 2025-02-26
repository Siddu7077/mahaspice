import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UniversalMenu from './UniversalMenu'; // Import the UniversalMenu component

const Superfast = ({ eventName }) => {
  const [crpbData, setCRPBData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [crpbResponse, categoriesResponse, itemsResponse, pricingResponse] = await Promise.all([
          axios.get('https://adminmahaspice.in/ms3/getcrpb.php'),
          axios.get('https://adminmahaspice.in/ms3/getsf_categories.php'),
          axios.get('https://adminmahaspice.in/ms3/getsf_items.php'),
          axios.get('https://adminmahaspice.in/ms3/get_sup_event_pricing.php')
        ]);

        const sortedCRPBData = crpbResponse.data.sort((a, b) => a.position - b.position);
        setCRPBData(sortedCRPBData);
        setCategories(categoriesResponse.data.categories);
        setItems(itemsResponse.data);
        setPricing(pricingResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePackageSelect = (packageName) => {
    setSelectedPackage(packageName);
  };

  if (loading) return <div>Loading ...</div>;
  if (error) return <div>Error loading</div>;

  return (
    <div className="p-4">
      {eventName && (
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-green-700 mb-2">Available packages for {eventName}</h2>
          <div className="w-2/6 h-1 bg-green-700 rounded"></div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 mr-9">
        {crpbData.map((crpb, index) => (
          <div
            key={index}
            onClick={() => handlePackageSelect(crpb.name)}
            className={`border rounded-lg shadow-lg hover:shadow-2xl transition cursor-pointer ${
              selectedPackage === crpb.name ? 'border-green-500 border-2' : ''
            }`}
          >
            <img
              src={`https://adminmahaspice.in/ms3/${crpb.img_address}`}
              alt={crpb.name}
              className="w-full object-full rounded-md"
            />
            {/* <h3 className="font-bold text-lg text-center">{crpb.name}</h3> */}
          </div>
        ))}
      </div>

      {selectedPackage && (
        <div className="mt-8">
          <UniversalMenu
            eventName={eventName}
            packageName={selectedPackage}
            categories={categories}
            items={items}
            pricing={pricing}
          />
        </div>
      )}
    </div>
  );
};

export default Superfast;