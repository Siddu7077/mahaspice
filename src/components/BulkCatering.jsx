import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BulkCatering = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    
    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await fetch('https://adminmahaspice.in/ms3/getSectionThree.php');
            const data = await response.json();
            setItems(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load content');
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

    return (
        <div>
            <section className="p-5 max-w-7xl">
                <h2 className="text-3xl font-bold mb-8 text-green-700">
                    CATERING FOR ALL OCCASIONS
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.map(({ id, title, description, image, link }, index) => (
                        <div
                            key={id}
                            className="relative bg-white rounded-lg shadow-md overflow-hidden"
                            style={{
                                height: hoveredIndex === index ? 'auto' : '320px',
                                transition: 'height 0.3s ease-in-out'
                            }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <Link to={link} className="block h-full">
                                <img
                                    src={`https://adminmahaspice.in/ms3/${image}`}
                                    alt={title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-green-700 mb-2">
                                        {title}
                                    </h3>

                                    <div className={`transition-opacity duration-300 ${
                                        hoveredIndex === index ? 'opacity-100' : 'opacity-0 h-0'
                                    }`}>
                                        <ul className="list-disc list-inside mt-4 text-sm text-gray-600 space-y-2">
                                            {description.map(({ text }, descIndex) => (
                                                <li key={descIndex} className="text-gray-600">
                                                    {text}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="text-right mt-4">
                                            <span className="text-sm font-medium text-green-500 hover:text-green-600">
                                                View More
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default BulkCatering;