import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Carousel = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('https://mahaspice.desoftimp.com/ms3/getCarousel.php')
      .then(res => res.json())
      .then(data => {
        console.log('Carousel Data:', data); // Debug log
        setSlides(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setIsLoading(false);
      });
  }, []);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  if (isLoading) return <div>Loading...</div>;
  if (!slides.length) return <div>No slides available</div>;

  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <Link
              to={slide.link_url}
              target="_blank"
              rel="noopener noreferrer"
            >
          {slide.media_type === 'video' ? (
            <video
              className="absolute top-0 left-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={`https://mahaspice.desoftimp.com/ms3/uploads/carousel/${slide.media_path}`} type="video/mp4" />
              Your browser does not support video playback.
            </video>
          ) : (
            <img
              src={`https://mahaspice.desoftimp.com/ms3/uploads/carousel/${slide.media_path}`}
              alt={slide.button_text}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          )}

          {/* Dark overlay */}
          <div className="absolute inset-0 " />

          {/* Button */}
          <div className=" h-full inset-4 flex items-end justify-center">
            
              <button className="px-8 py-3 mb-5 bg-white hover:bg-gray-100 text-black rounded-lg 
                       transform transition-transform hover:scale-105">{slide.button_text}</button>
          </div>
            </Link>
        </div>
      ))}

      {/* Navigation */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full 
                     bg-white/50 hover:bg-white/75 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full 
                     bg-white/50 hover:bg-white/75 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );
};

export default Carousel;
