import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

const CarouselDisplay = () => {
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarouselSlides = async () => {
      try {
        const response = await axios.get('http://localhost/ms3/getCarousel.php');
        setCarouselSlides(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch carousel slides');
        setLoading(false);
      }
    };

    fetchCarouselSlides();
  }, []);

  const handleEdit = (slide) => {
    navigate(`/carousel/${slide.id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.post('http://localhost/ms3/deletecarousel.php', { id });
      setCarouselSlides(carouselSlides.filter(slide => slide.id !== id));
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64 text-gray-500">
      Loading carousel...
    </div>
  );

  if (error) return (
    <div className="bg-red-100 text-red-800 p-4 rounded-lg text-center">
      Error: {error}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {carouselSlides.map((slide) => (
          <div 
            key={slide.id} 
            className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl"
          >
            <img
              src={`http://localhost/ms3/${slide.image_address}`}
              alt={slide.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{slide.title}</h2>
              {slide.subtitle && (
                <h3 className="text-md text-gray-600 mb-2">{slide.subtitle}</h3>
              )}
              {slide.description && (
                <p className="text-sm text-gray-500 mb-4">{slide.description}</p>
              )}
              <div className="flex justify-end space-x-2">
                <button 
                  className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition-colors"
                  onClick={() => handleEdit(slide)}
                >
                  <FaEdit className="w-5 h-5" />
                </button>
                <button 
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                  onClick={() => handleDelete(slide.id)}
                >
                  <FaTrash className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselDisplay;