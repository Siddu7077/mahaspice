import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const MenuPage = () => {
    const { eventType, serviceType } = useParams();
    const [categories, setCategories] = useState([]);
    const [pricingData, setPricingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [serviceType]);

    const fetchData = async () => {
        try {
            const [categoriesResponse, pricingResponse] = await Promise.all([
                fetch('https://adminmahaspice.in/ms3/getgscd.php'),
                fetch('https://adminmahaspice.in/ms3/get_pricing.php')
            ]);
            const categoriesData = await categoriesResponse.json();
            const pricingData = await pricingResponse.json();

            if (categoriesData.status === "success" && pricingData.success) {
                const formattedServiceType = serviceType
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ')
                    .trim();
                
                const availableGscds = pricingData.data.filter(price => 
                    price.event_category.toLowerCase() === formattedServiceType.toLowerCase()
                );
                
                const filteredCategories = categoriesData.data
                    .filter(category => availableGscds.some(price => price.gscd === category.menu_type))
                    .map(category => ({
                        ...category,
                        veg_price: availableGscds.find(price => price.gscd === category.menu_type)?.veg_price || "N/A",
                        nonveg_price: availableGscds.find(price => price.gscd === category.menu_type)?.nonveg_price || "N/A"
                    }));
                
                setCategories(filteredCategories);
                setPricingData(pricingData.data);
            } else {
                setError(categoriesData.message || "Failed to fetch data");
            }
        } catch (err) {
            setError("Failed to fetch data");
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (categoryName) => {
        navigate(`/events/${eventType}/${serviceType}/Menu/${categoryName}`);
    };

    const getImageUrl = (imageUrl) => {
        if (imageUrl && !imageUrl.startsWith('http')) {
            return `https://adminmahaspice.in/ms3/${imageUrl}`;
        }
        return imageUrl;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500 text-center">
                    <p className="text-xl">{error}</p>
                    <button
                        onClick={fetchData}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white py-10 h-screen px-5">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    Available Menu Categories for {serviceType.replace(/-/g, ' ')}
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                            onClick={() => handleCategoryClick(category.menu_type)}
                        >
                            <div className="relative h-65 overflow-hidden">
                                <img
                                    src={getImageUrl(category.image_address)}
                                    alt={category.menu_type}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                            </div>

                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                    {category.menu_type}
                                </h3>
                                <p className="text-gray-700 text-sm">Veg Price: ₹{category.veg_price}</p>
                                <p className="text-gray-700 text-sm mb-3">Non-Veg Price: ₹{category.nonveg_price}</p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                                        View Items
                                    </span>
                                    <svg
                                        className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transform group-hover:translate-x-1 transition-all duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {categories.length === 0 && (
                    <div className="text-center text-gray-500 mt-8 p-8 bg-gray-50 rounded-lg">
                        <p className="text-xl">No menu categories available</p>
                        <p className="text-sm mt-2">Please check back later</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuPage;
