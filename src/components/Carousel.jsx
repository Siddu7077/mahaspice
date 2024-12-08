import React, { useState, useEffect } from 'react';
import one from '../assets/1.png';
import two from '../assets/2.png';
import three from '../assets/3.png';

const Carousel = () => {
  const slides = [
    { id: 1, src: one, alt: 'Slide 1' },
    { id: 2, src: two, alt: 'Slide 2' },
    { id: 3, src: three, alt: 'Slide 3' },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Auto-swipe effect
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000); // Auto-swipe every 4 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slides */}
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <img
            key={slide.id}
            src={slide.src}
            alt={slide.alt}
            className="w-full object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-opacity-50 p-2 rounded-full"
      >
        ❮
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-opacity-50 p-2 rounded-full"
      >
        ❯
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 ${
              currentIndex === index ? 'bg-gray-800' : 'bg-gray-300'
            } rounded-full`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
