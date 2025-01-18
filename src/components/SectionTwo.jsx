import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SectionTwo = () => {
    const [services, setServices] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('https://mahaspice.desoftimp.com/ms3/getSectionTwo.php');
                
                // Log the raw response for debugging
                const textResponse = await response.text();
                console.log('Raw response:', textResponse);

                // Try to parse the response
                const data = textResponse ? JSON.parse(textResponse) : null;

                if (!data) {
                    throw new Error('Empty response from server');
                }

                if (data.status === 'error') {
                    throw new Error(data.message);
                }

                // If data is an array, process it
                if (Array.isArray(data)) {
                    const processedServices = data.map(service => ({
                        title: service.service_name,
                        image: `https://mahaspice.desoftimp.com/ms3/${service.image_path}`,
                        buttonText: "Order Now",
                        link: getServiceLink(service.service_name)
                    }));
                    setServices(processedServices);
                } else if (data.services) {
                    console.log('No services found in database');
                }
            } catch (error) {
                console.error('Error details:', error);
                setError(error.message);
                // Set default services with placeholder images on error
                setServices([
                    {
                        title: "Box Genie",
                        image: "/api/placeholder/400/320",
                        buttonText: "Order Now",
                        link: "/box"
                    },
                    {
                        title: "Home Delivery",
                        image: "/api/placeholder/400/320",
                        buttonText: "Order Now",
                        link: "/delivery"
                    },
                    {
                        title: "Bulk Catering",
                        image: "/api/placeholder/400/320",
                        buttonText: "Order Now",
                        link: "/events"
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    // Helper function to determine the link based on service name
    const getServiceLink = (serviceName) => {
        const linkMap = {
            'Box Genie': '/box',
            'Home Delivery': '/delivery',
            'Bulk Catering': '/events'
        };
        return linkMap[serviceName] || '/';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <section className="py-8 mt-6 mr-20">
            {error && (
                <div className="text-red-500 text-center mb-4">
                    Error loading services: {error}
                </div>
            )}
            <div className="flex flex-col md:flex-row justify-between gap-4 w-full mx-auto px-4">
                {services.map(({ title, image, link }) => (
                    <Link to={link} key={title}>
                        <div className="flex-1 bg-white border shadow-md text-black p-4 rounded-lg transition-transform hover:-translate-y-1 flex flex-col">
                            {/* <h3 className="text-2xl font-extrabold text-gray-800 border-b-2 border-green-500 pb-2">
                                {title}
                            </h3> */}
                            <div className="flex items-center justify-center py-1">
                                <img
                                    src={image}
                                    alt={title}
                                    className="rounded-md object-contain w-full"
                                    onError={(e) => {
                                        console.log(`Image load error for ${title}`);
                                        e.target.src = '/api/placeholder/400/320';
                                    }}
                                />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default SectionTwo;
