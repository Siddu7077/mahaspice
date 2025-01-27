import React, { useState } from 'react';
import SuperFastMeal from './SuperfastMeal';
import SuperFastDelbox from './SuperfastDelbox';

const Superfast = () => {
  const [selectedService, setSelectedService] = useState(null);

  // Mapping service name to their respective components
  const getServiceComponent = (serviceName) => {
    const componentMap = {
    
      'Superfast Box Genie': <SuperFastMeal />,
      'Superfast Home Delivery': <SuperFastDelbox />,
      'Event Caterers': (
        <div className="text-center">
          <img
            src="https://mahaspice.desoftimp.com/ms3/uploads/sectionThree/6767117788497_1734807927.webp?1737961268374"
            alt="Event Caterers"
            className="w-full max-w-lg mx-auto rounded-lg shadow"
          />
          <p className="mt-4 text-lg font-semibold">Event Caterers</p>
          <p className="text-gray-600">
            We provide exceptional catering services for all types of events.
          </p>
          <p className="text-gray-600">
            Comming Soon...
          </p>
        </div>
      ),
    };

    return componentMap[serviceName] || null;
  };

  const handleServiceSelect = (serviceName) => {
    setSelectedService(serviceName);
  };

  // List of services
  const services = [
    { name: 'Superfast Box Genie', img: 'https://mahaspice.desoftimp.com/ms3/uploads/crpb/67971b14db2cb_boxgenie-1.jpg' },
    { name: 'Superfast Home Delivery', img: 'https://mahaspice.desoftimp.com/ms3/uploads/services/home-delivery_1737194693.jpg' },
  
    { name: 'Event Caterers', img: 'https://mahaspice.desoftimp.com/ms3/uploads/sectionThree/6767117788497_1734807927.webp?1737961268374' },
  ];

  return (
    <div className="p-4">
      {/* Service cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            onClick={() => handleServiceSelect(service.name)}
            className="border rounded-lg shadow hover:shadow-lg transition cursor-pointer text-center"
          >
            <img
              src={service.img}
              alt={service.name}
              className="w-full h-52 object-fill rounded-lg "
            />
            {/* <p className="text-lg font-semibold">{service.name}</p> */}
          </div>
        ))}
      </div>

    
      <div className="mt-6">
        {selectedService && getServiceComponent(selectedService)}
      </div>
    </div>
  );
};

export default Superfast;