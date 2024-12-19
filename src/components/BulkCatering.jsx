import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'lucide-react';

const BulkCatering = () => {
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleDropdown = (index) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };

    const cateringOptions = [
        {
            title: "Wedding Catering",
            description: [
                { text: "Engagement", link: "/events/wedding-catering" },
                { text: "Haldhi", link: "/events/wedding-catering" },
                { text: "Pelli koduku & Pelli Kuthuru", link: "/wedding-catering" },
                { text: "Vratham", link: "/events/wedding-catering" },
            ],
            image: "https://static01.nyt.com/images/2023/05/14/multimedia/FAT-INDIAN-WEDDINGS-01-hptq/FAT-INDIAN-WEDDINGS-01-hptq-articleLarge.jpg?quality=75&auto=webp&disable=upscale"
        },
        {
            title: "Corporate Events",
            description: [
                { text: "Corporate Meeting", link: "/events/corporate-events" },
                { text: "Get together", link: "/events/corporate-events" },
                { text: "Celebrations", link: "/events/corporate-events" },
                { text: "Birthday Parties", link: "/events/corporate-events" },
            ],
            image: "https://shahipakwaan.in/wp-content/uploads/2023/02/business-people-taking-snacks-from-buffet-table_1262-1701-1.png"
        },
        {
            title: "Event Caterers",
            description: [
                { text: "Birthday", link: "/events/event-caterers" },
                { text: "House warming", link: "/events/event-caterers" },
                { text: "Cardel", link: "/events/event-caterers" },
                { text: "Festivals", link: "/events/event-caterers" },
            ],
            image: "https://www.shutterstock.com/image-photo/big-family-celebrating-diwali-indian-600nw-2334107349.jpg"
        },
        {
            title: "Design your own Menu",
            description: [
                { text: "Corporate Meetings", link: "/events/personalized-menu" },
                { text: "Birthdays", link: "/events/personalized-menu" },
                { text: "Marriage", link: "/events/personalized-menu" },
                { text: "Reception", link: "/events/personalized-menu" },
            ],
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxa7JfqO3EaPKyw7DOlOFIADBQ8Y-FP7MfLw&s"
        },
    ];

    return (
        <section className="p-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-green-700">
                CATERING FOR ALL OCCASIONS
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cateringOptions.map(({ title, description, image }, index) => (
                    <div
                        key={title}
                        style={{ 
                            height: openDropdown === index ? 'auto' : '280px'
                        }}
                        className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                    >
                        <div className="h-48 relative">
                            <img
                                src={image}
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black opacity-10 hover:opacity-0 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-4">
                            <div
                                className="flex justify-between items-center cursor-pointer"
                                onClick={() => toggleDropdown(index)}
                            >
                                <h3 className="text-lg font-bold text-green-700">{title}</h3>
                                {openDropdown === index ? (
                                    <ChevronUp className="w-5 h-5 text-green-700" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-green-700" />
                                )}
                            </div>

                            <div 
                                className={`transition-all duration-300 ${
                                    openDropdown === index ? 'mt-4 opacity-100' : 'h-0 opacity-0'
                                } overflow-hidden`}
                            >
                                <ul className="space-y-2 text-sm text-gray-600">
                                    {description.map(({ text, link }, descIndex) => (
                                        <li key={descIndex} className="hover:text-gray-800">
                                            <Link
                                                to={link}
                                                className="block transition-colors duration-200"
                                            >
                                                • {text}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                <div className="text-right mt-4">
                                    <Link
                                        to={description[0].link}
                                        className="text-sm font-medium text-green-500 hover:text-green-600 transition-colors duration-200"
                                    >
                                        View More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BulkCatering;