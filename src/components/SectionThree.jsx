import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SectionThree = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await fetch('https://mahaspice.desoftimp.com/ms3/getSectionThree.php');
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
            <section className="p-5 mx-auto max-w-5xl ">
                <h2 className="text-3xl font-bold mb-8 text-green-700">
                    CATERING FOR ALL OCCASIONS
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(({ id, title, description, image, link }, index) => (
                        <div
                            key={id}
                            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <Link to={link} className="block">
                                <img
                                    src={`https://mahaspice.desoftimp.com/ms3/${image}`}
                                    alt={title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-5 ">
                                    <h3 className="text-lg font-bold text-green-700 mb-2">
                                        {title}
                                    </h3>

                                    {hoveredIndex === index && (
                                        <>
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
                                        </>
                                    )}
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default SectionThree;