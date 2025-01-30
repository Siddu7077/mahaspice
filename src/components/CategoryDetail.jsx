import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Royal from './Royal';
import Platinum from './Platinum';
import Classic from './Classic';

const Superfast = ({ eventName }) => { // Added eventName prop
  const [crpbData, setCRPBData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const getServiceComponent = (serviceName) => {
    const componentMap = {
      'classic': Classic,
      'Royal': Royal,
      'Platinum': Platinum,
    };
    return componentMap[serviceName] || null;
  };

  useEffect(() => {
    const fetchCRPB = async () => {
      try {
        const response = await axios.get('https://mahaspice.desoftimp.com/ms3/getcrpb.php');
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

  const SelectedServiceComponent = selectedService
    ? getServiceComponent(selectedService)
    : null;

  return (
    <div className="p-4">
      {/* Added Event Name Display */}
      {eventName && (
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-green-700 mb-2">Available packages for {eventName}</h2>
          <div className="w-2/6 h-1 bg-green-700 rounded"></div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mr-9">
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

      {SelectedServiceComponent && (
        <div className="mt-8">
          <SelectedServiceComponent eventName={eventName} />
        </div>
      )}
    </div>
  );
};

export default Superfast;