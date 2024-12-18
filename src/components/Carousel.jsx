import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Carousel = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        const response = await fetch("https://mahaspice.desoftimp.com/ms3/getCarousel.php");
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setSlides(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCarouselData();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-10">Error: {error}</div>;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="w-full h-auto"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="flex flex-col md:flex-row items-center p-6 justify-between w-full">
              {/* Text Section */}
              <section className="w-full md:w-1/2 p-4 md:p-8">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-gray-800">
                  {slide.title}
                </h2>
                {slide.type === "app-download" ? (
                  <>
                    <p className="text-base md:text-lg mb-6 text-green-600 font-medium">
                      {slide.subtitle}
                    </p>
                    <div>
                      <h3 className="text-xl md:text-2xl font-extrabold text-gray-800">
                        Download Our App
                      </h3>
                      <div className="flex justify-start space-x-4 mt-4">
                        {slide.platform_buttons?.buttons?.map(
                          (button, index) => (
                            <a
                              key={index}
                              href={button.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block"
                            >
                              <img
                                src={
                                  button.platform === "Google Play"
                                    ? "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                                    : "https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                                }
                                alt={`${button.platform} badge`}
                                className="w-32 md:w-40 h-12 md:h-16 hover:opacity-80 transition"
                              />
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {slide.description && (
                      <p className="text-base md:text-lg text-gray-600 mb-4">
                        {slide.description}
                      </p>
                    )}
                    {slide.price_info && !Array.isArray(slide.price_info) && (
                      <ul className="space-y-2 text-sm md:text-md text-gray-700 mb-4">
                        {Object.entries(slide.price_info).map(
                          ([key, value]) => (
                            <li key={key} className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-2 text-green-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {key.replace(/_/g, " ")}: {value}
                            </li>
                          )
                        )}
                      </ul>
                    )}
                    {slide.button_text && (
                      <button className="mt-6 px-4 md:px-6 py-2 md:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm md:text-base">
                        {slide.button_text}
                      </button>
                    )}
                  </>
                )}
              </section>
              {/* Image Section */}
              <section className="w-full md:w-1/2 p-4 flex items-center justify-center">
                <img
                  src={`http://localhost/ms3/${slide.image_address}`}
                  alt={slide.title}
                  className="object-contain w-full max-w-[400px] h-auto max-h-[400px] rounded-lg"
                />
              </section>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;