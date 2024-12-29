import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SectionTwo = () => {
    const [services, setServices] = useState([
        {
            title: "Box Genie",
            image: "",
            buttonText: "Order Now",
            link: "/box",
        },
        {
            title: "Home Delivery",
            image: "",
            buttonText: "Order Now",
            link: "/delivery",
        },
        {
            title: "Bulk Catering",
            image: "",
            buttonText: "Order Now",
            link: "/events",
        },
    ]);
    
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
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
                    setServices(prevServices =>
                        prevServices.map(service => {
                            const dbImage = data.find(item =>
                                item.service_name === service.title
                            );
                            return {
                                ...service,
                                image: dbImage
                                    ? `https://mahaspice.desoftimp.com/ms3/${dbImage.image_path}`
                                    : '/api/placeholder/400/320'
                            };
                        })
                    );
                } else if (data.services) {
                    // Handle the case where we get an empty services array
                    console.log('No services found in database');
                }

            } catch (error) {
                console.error('Error details:', error);
                setError(error.message);
                // Set placeholder images on error
                setServices(prevServices =>
                    prevServices.map(service => ({
                        ...service,
                        image: '/api/placeholder/400/320'
                    }))
                );
            }
        };

        fetchImages();
    }, []);

    return (
        <section className="py-8 mt-6 mr-20">
            {error && (
                <div className="text-red-500 text-center mb-4">
                    Error loading images: {error}
                </div>
            )}
            <div className="flex flex-col md:flex-row justify-between gap-4 w-full mx-auto px-4">
                {services.map(({ title, image, buttonText, link }) => (
                    <Link
                            to={link} >
                    <div
                        key={title}
                        className="flex-1 bg-white border shadow-md text-black p-4 rounded-lg transition-transform hover:-translate-y-1 flex flex-col"
                    >
                        <h3 className="text-2xl font-extrabold text-gray-800 border-b-2 border-green-500 pb-2">
                            {title}
                        </h3>
                        <div className="flex items-center justify-center py-4">
                            <img
                                src={image}
                                alt={title}
                                className="rounded-md object-contain  w-full"
                                onError={(e) => {
                                    console.log(`Image load error for ${title}`);
                                    e.target.src = '/api/placeholder/400/320';
                                }}
                            />
                        </div>
                        {/* <Link
                            to={link}
                            className="bg-black text-white px-6 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-transform self-center"
                        >
                            {buttonText}
                        </Link> */}
                    </div>
                    </Link>
                ))}
                
            </div>
            
        </section>
    );
};

export default SectionTwo;
