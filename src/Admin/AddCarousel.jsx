import React, { useState } from 'react';
import axios from 'axios';

const AddCarousel = () => {
    const [slideData, setSlideData] = useState({
        title: '',
        subtitle: '',
        description: '',
        type: '',
        image_address: '',
        button_text: '',
        buttons: [],
        price_info: {}
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSlideData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleButtonAdd = () => {
        setSlideData(prev => ({
            ...prev,
            buttons: [...prev.buttons, { platform: '', link: '' }]
        }));
    };

    const handleButtonChange = (index, e) => {
        const { name, value } = e.target;
        const newButtons = [...slideData.buttons];
        newButtons[index][name] = value;
        setSlideData(prev => ({
            ...prev,
            buttons: newButtons
        }));
    };

    const handlePriceInfoChange = (e) => {
        const { name, value } = e.target;
        setSlideData(prev => ({
            ...prev,
            price_info: {
                ...prev.price_info,
                [name]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://orchid-grasshopper-305065.hostingersite.com/ms3/add_carousel.php', slideData);
            alert('Slide added successfully');
            // Reset form or redirect
            setSlideData({
                title: '',
                subtitle: '',
                description: '',
                type: '',
                image_address: '',
                button_text: '',
                buttons: [],
                price_info: {}
            });
        } catch (error) {
            console.error('Error adding slide:', error);
            alert('Failed to add slide');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Add Carousel Slide</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={slideData.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">Subtitle</label>
                    <input
                        type="text"
                        name="subtitle"
                        value={slideData.subtitle}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>

                <div>
                    <label className="block mb-2">Description</label>
                    <textarea
                        name="description"
                        value={slideData.description}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>

                <div>
                    <label className="block mb-2">Slide Type</label>
                    <select
                        name="type"
                        value={slideData.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg"
                    >
                        <option value="">Select Type</option>
                        <option value="app-download">App Download</option>
                        <option value="custom-box">Custom Box</option>
                        <option value="delivery">Home Delivery</option>
                        <option value="bulk-catering">Bulk Catering</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-2">Image Address</label>
                    <input
                        type="text"
                        name="image_address"
                        value={slideData.image_address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>

                <div>
                    <label className="block mb-2">Button Text</label>
                    <input
                        type="text"
                        name="button_text"
                        value={slideData.button_text}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>

                {/* Platform Buttons Section */}
                <div>
                    <label className="block mb-2">Platform Buttons</label>
                    {slideData.buttons.map((button, index) => (
                        <div key={index} className="flex space-x-2 mb-2">
                            <select
                                name="platform"
                                value={button.platform}
                                onChange={(e) => handleButtonChange(index, e)}
                                className="w-1/2 px-3 py-2 border rounded-lg"
                            >
                                <option value="">Select Platform</option>
                                <option value="Google Play">Google Play</option>
                                <option value="App Store">App Store</option>
                            </select>
                            <input
                                type="text"
                                name="link"
                                value={button.link}
                                onChange={(e) => handleButtonChange(index, e)}
                                placeholder="Link"
                                className="w-1/2 px-3 py-2 border rounded-lg"
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleButtonAdd}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                        Add Platform Button
                    </button>
                </div>

                {/* Price Info Section */}
                <div>
                    <label className="block mb-2">Price Information</label>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="breakfast"
                            value={slideData.price_info.breakfast || ''}
                            onChange={handlePriceInfoChange}
                            placeholder="Breakfast Price"
                            className="px-3 py-2 border rounded-lg"
                        />
                        <input
                            type="text"
                            name="lunch"
                            value={slideData.price_info.lunch || ''}
                            onChange={handlePriceInfoChange}
                            placeholder="Lunch Price"
                            className="px-3 py-2 border rounded-lg"
                        />
                        <input
                            type="text"
                            name="dinner"
                            value={slideData.price_info.dinner || ''}
                            onChange={handlePriceInfoChange}
                            placeholder="Dinner Price"
                            className="px-3 py-2 border rounded-lg"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    Add Slide
                </button>
            </form>
        </div>
    );
};

export default AddCarousel;