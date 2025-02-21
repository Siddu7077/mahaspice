import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const BASE_URL = 'https://mahaspice.desoftimp.com/ms3';

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch(`${BASE_URL}/get_faq.php`);
        const data = await response.json();
        if (data.success) {
          setFaqs(data.data.sort((a, b) => a.position - b.position));
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Learn more about our services and how we can help you with your needs
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={faq.id}
            className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
              activeIndex === index ? 'ring-2 ring-green-500' : ''
            }`}
          >
            <div
              onClick={() => toggleFAQ(index)}
              className="flex cursor-pointer"
            >
              <div className="w-1/3 relative">
                <img
                  src={faq.img_address ? `${BASE_URL}${faq.img_address}` : '/api/placeholder/400/300'}
                  alt={faq.title}
                  className="w-full h-full object-cover min-h-[200px]"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent md:hidden" />
              </div>

              <div className="w-2/3 p-6">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {faq.title}
                  </h3>
                  <button
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label={activeIndex === index ? 'Collapse' : 'Expand'}
                  >
                    {activeIndex === index ? (
                      <ChevronUp size={24} />
                    ) : (
                      <ChevronDown size={24} />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-gray-600 ">
                  {faq.description}
                </p>
              </div>
            </div>

            {/* Expanded content */}
            {activeIndex === index && (
              <div className="px-6 pb-6 pt-2">
                <hr className="my-4 border-gray-200" />
                <div className="prose prose-blue max-w-none">
                  <ul className="space-y-2">
                    {(Array.isArray(faq.bullet_points) 
                      ? faq.bullet_points 
                      : JSON.parse(faq.bullet_points)
                    ).map((point, idx) => (
                      <li 
                        key={idx}
                        className="flex items-start gap-2"
                      >
                        {/* <span className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0" /> */}
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;