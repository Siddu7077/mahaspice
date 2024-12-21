import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const SectionThree = () => {
    const [items, setItems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get('https://mahaspice.desoftimp.com/ms3/getSectionThree.php');
            setItems(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load content');
            setLoading(false);
        }
    };

    const totalSlides = items.length - 2;

    useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === totalSlides ? 0 : prevIndex + 1
            );
        }, 4000);

        return () => clearInterval(timer);
    }, [totalSlides, isPaused]);

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? totalSlides : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === totalSlides ? 0 : prevIndex + 1
        );
    };

    const handleMouseEnter = (index) => {
        setHoveredIndex(index);
        setIsPaused(true); // Pause auto-scroll
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
        setIsPaused(false); // Resume auto-scroll
    };

    return (
        <div>
            <section className="p-5 mx-auto max-w-6xl relative">
                <h2 className="text-3xl font-bold mb-0 text-left text-green-700 ml-10">
                    CATERING FOR ALL OCCASIONS
                </h2>

                <div className="relative p-3 m-2 bottom-5">
                    <button
                        onClick={handlePrevious}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                    >
                        <ChevronLeft className="w-6 h-6 text-green-700" />
                    </button>

                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{
                                transform: `translateX(-${currentIndex * (100 / 3)}%)`,
                            }}
                        >
                            {items.map(({ id, title, description, image, link }, index) => (
                                <div
                                    key={id}
                                    className="flex-shrink-0 w-1/3 px-4 p-5"
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <Link to={link} >
                                        <img
                                            src={`https://mahaspice.desoftimp.com/ms3/${image}`}
                                            alt={title}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-5">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-lg font-bold text-green-700">{title}</h3>
                                            </div>

                                            {hoveredIndex === index && (
                                                <>
                                                    <ul className="list-disc list-inside mt-4 text-sm text-gray-600">
                                                        {description.map(({ text }, descIndex) => (
                                                            <li key={descIndex} className="text-gray-600">
                                                                {text}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <div className="text-right mt-4">
                                                        <Link
                                                            to={link}
                                                            className="text-sm font-medium text-green-500 hover:text-green-600"
                                                        >
                                                            View More
                                                        </Link>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </Link>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                    >
                        <ChevronRight className="w-6 h-6 text-green-700" />
                    </button>
                </div>
            </section>
        </div>
    );
};

export default SectionThree;
