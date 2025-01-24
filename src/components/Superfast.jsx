import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SuperFastMeal from './SuperFastMeal'; // Import the specific component
import Classic from './Classic';
import Royal from './Royal';
import Platinum from './Platinum';

const Superfast = () => {
  const [crpbData, setCRPBData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  // Service component mapping function
  const getServiceComponent = (serviceName) => {
    const componentMap = {
      'Box Genie': SuperFastMeal,
      'Classic': Classic,
      'Royal': Royal,
      'Platinum': Platinum,
      // Add more mappings as needed
    };

    return componentMap[serviceName] || null;
  };

  useEffect(() => {
    const fetchCRPB = async () => {
      try {
        const response = await axios.get('https://mahaspice.desoftimp.com/ms3/getcrpb.php');
        // Sort the data by the 'position' field in ascending order
        const sortedData = response.data.sort((a, b) => a.position - b.position);
        setCRPBData(sortedData);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchCRPB();
  }, []);

  const handleServiceSelect = (serviceName) => {
    setSelectedService(serviceName);
  };

  if (loading) return <div>Loading ...</div>;
  if (error) return <div>Error loading </div>;

  // Render selected service component if one is selected
  const SelectedServiceComponent = selectedService 
    ? getServiceComponent(selectedService) 
    : null;

  return (
    <div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mr-9">
        {crpbData.map((crpb, index) => (
          <div 
            key={index} 
            onClick={() => handleServiceSelect(crpb.name)}
            className="border rounded-lg shadow hover:shadow-lg transition p-4 cursor-pointer"
          >
            <img
              src={`https://mahaspice.desoftimp.com/ms3/${crpb.img_address}`}
              alt={crpb.name}
              className="w-full h-40 object-full rounded-md mb-4"
            />
            <h3 className="font-bold text-lg text-center">{crpb.name}</h3>
          </div>
        ))}
      </div>

      {/* Render the selected service component */}
      {SelectedServiceComponent && (
        <div className="mt-8">
          <SelectedServiceComponent />
        </div>
      )}
    </div>
  );
};

export default Superfast;