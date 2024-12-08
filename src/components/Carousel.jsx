import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';


import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


import slidesData from './cateringslides.json';

const CateringCarousel = () => {

  const fallbackImages = [
    'https://via.placeholder.com/400', 
    'https://picsum.photos/400', 
    'https://placekitten.com/400/400', 
    'https://source.unsplash.com/random/400x400', 
    'https://loremflickr.com/400/400', 
  ];

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={50}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      className="w-[1400px] h-[400px]"
    >
      {slidesData.slides.map((slide, index) => (
        <SwiperSlide key={slide.id}>
          <div className="flex">
            
            {/* Text Section */}
            <section className="py-7 p-9 w-2/3 flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-6 text-gray-800">
                {slide.title}
              </h2>
              
              {slide.type === 'app-download' ? (
                <>
                  <p className="text-lg mb-8 text-green-600 font-medium">
                    {slide.subtitle}
                  </p>
                  <div>
                    <h3 className="text-2xl font-extrabold text-gray-800">
                      Download Our App
                    </h3>
                    <div className="flex justify-center space-x-4 mt-4">
                      {slide.buttons.map((button) => (
                        <a
                          key={button.platform}
                          href={button.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={button.platform === 'Google Play' 
                              ? 'https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg'
                              : 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg'}
                            alt={`${button.platform} badge`}
                            className="w-40 h-16 hover:opacity-80 transition"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {slide.description && (
                    <p className="text-lg text-gray-600 mb-6">
                      {slide.description}
                    </p>
                  )}
                  
                  {slide.features && (
                    <ul className="space-y-4 text-lg text-gray-700">
                      {slide.features.map((feature, idx) => (
                        <li key={idx}>• {feature}</li>
                      ))}
                    </ul>
                  )}
                  
                  {slide.buttonText && (
                    <button className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                      {slide.buttonText}
                    </button>
                  )}
                </>
              )}
            </section>

            {/* Image Section */}
            <section className="flex items-center justify-center w-1/2">
              <img 
                src={slide.image || fallbackImages[index % fallbackImages.length]} 
                alt={slide.title} 
                className="object-cover w-[400px] h-[400px] rounded-lg" 
              />
            </section>

          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CateringCarousel;