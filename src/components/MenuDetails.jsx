import React, { useState, useEffect } from 'react';
import { menuSections } from './cocktaildiamondexotic';
import MenuNavbar from './MenuNavbar';
import { useNavigate, useParams } from 'react-router-dom';
import VegNonVegToggle from './Vtoggle';

const BASE_PLATE_PRICE = 299;
const EXTRA_ITEM_CHARGE = 50;
const MIN_GUESTS = 10;
const MAX_GUESTS = 2000;



const MenuSelection = () => {
    const navigate = useNavigate();
    const { categoryName } = useParams();
    const [selectedItems, setSelectedItems] = useState({
        snacks: [],
        beverages: [],
        sweets: [],
        vegFries: [],
        hotItems: [],
        salad: [],
        dipsAndSpreads: [],
    });

    const formatHeading = (urlName) => {
        return urlName
            .split('-')
            .map(word =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(' ');
    };


    const pageHeading = categoryName ? formatHeading(categoryName) : 'Menu';


    const [originalPlatePrice, setOriginalPlatePrice] = useState(BASE_PLATE_PRICE);

    const [userDetails, setUserDetails] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        alternateNumber: '',
        city: '',
        address: '',
        guestCount: MIN_GUESTS
    });


    const updateGuestCount = (action) => {
        setUserDetails((prev) => {
            const isIncrement = action === "increment";
            const isDecrementBlocked = !isIncrement && prev.guestCount === MIN_GUESTS;

            const newCount = isIncrement
                ? Math.min(prev.guestCount + 5, MAX_GUESTS)
                : Math.max(prev.guestCount - 5, MIN_GUESTS);

            if (!isDecrementBlocked) {
                const newPlatePrice = isIncrement
                    ? platePrice - 1
                    : platePrice + 1;

                setPlatePrice(newPlatePrice);
                setOriginalPlatePrice(BASE_PLATE_PRICE);
            }
            return { ...prev, guestCount: newCount };
        });
    };

    const renderSelectedItemsList = () => {
        return (
            <div className="max-h-64 overflow-y-scroll border p-2 mt-2">
                {Object.entries(selectedItems).map(([section, items]) => {
                    if (items.length === 0) return null;

                    return (
                        <div key={section} className="mb-2">

                            <h5 className="font-semibold text-green-600 capitalize">
                                {section.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </h5>
                            <ul className="list-disc list-inside text-sm">
                                {items.map((item, index) => (
                                    <li key={index}>
                                        {item}
                                        {extraItems[section]?.includes(item) && (
                                            <span className="text-red-500 ml-2 text-xs"> (₹{EXTRA_ITEM_CHARGE})</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        );
    };

    const [extraItems, setExtraItems] = useState({});
    const [platePrice, setPlatePrice] = useState(BASE_PLATE_PRICE);
    const [selectedSection, setSelectedSection] = useState(null);
    const [userBasicDetails, setUserBasicDetails] = useState({
        name: '',
        phone: ''
    });

    const toggleItemSelection = (section, item) => {
        const currentSelections = selectedItems[section] || [];
        const sectionLimit = menuSections[section].limit;

        // If item is already selected, deselect it
        if (currentSelections.includes(item)) {
            setSelectedItems({
                ...selectedItems,
                [section]: currentSelections.filter((selected) => selected !== item),
            });

            // Remove from extra items if it was an extra item
            if (extraItems[section]?.includes(item)) {
                setExtraItems(prev => ({
                    ...prev,
                    [section]: (prev[section] || []).filter(extraItem => extraItem !== item)
                }));

                // Adjust plate price
                setPlatePrice(prev => prev - EXTRA_ITEM_CHARGE);
            }
            return;
        }

        // Check if limit is reached
        if (currentSelections.length >= sectionLimit) {
            const confirmExtra = window.confirm(
                `You've reached the limit for ${menuSections[section].title}. 
        Would you like to add this item for an extra charge of ₹${EXTRA_ITEM_CHARGE}?`
            );

            if (confirmExtra) {
                // Add to extra items
                setExtraItems(prev => ({
                    ...prev,
                    [section]: [...(prev[section] || []), item]
                }));

                // Increase plate price
                setPlatePrice(prev => prev + EXTRA_ITEM_CHARGE);
            } else {
                return;
            }
        }

        // Add to selected items
        setSelectedItems({
            ...selectedItems,
            [section]: [...currentSelections, item],
        });
    };

    const handleBasicDetailsChange = (e) => {
        const { name, value } = e.target;
        setUserBasicDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const proceedToViewPrices = () => {
        // Validate basic details
        if (!userBasicDetails.name || !userBasicDetails.phone) {
            alert('Please enter your name and phone number');
            return;
        }

        // Check if all sections have required items selected
        const incompleteSection = Object.entries(menuSections).find(([section, { limit }]) => {
            const selectedCount = (selectedItems[section] || []).length;
            const extraCount = (extraItems[section] || []).length;
            return selectedCount + extraCount < limit;
        });

        if (incompleteSection) {
            const [section, { title, limit }] = incompleteSection;
            const currentSelectedCount = (selectedItems[section] || []).length;
            const currentExtraCount = (extraItems[section] || []).length;

            alert(`Please complete selecting items for ${title}. 
You need to select ${limit} items (currently selected: ${currentSelectedCount + currentExtraCount}/${limit})`);
            return;
        }



        // Navigate to order page with selected items and basic user details
        navigate('/events/:eventType/:serviceType/Menu/:categoryName/order', {
            state: {
                selectedItems,
                extraItems,
                platePrice,
                userBasicDetails,
                guestCount: userDetails.guestCount
            }
        });
    };

    return (
        <div><MenuNavbar />
            <div className="flex flex-col md:flex-row h-screen bg-gray-50">

                {/* Sidebar */}
                <div className="w-full md:w-1/5 bg-green-50 p-4 border-r overflow-y-auto">
                    <h2 className="text-xl font-bold mb-6 text-green-700">
                        {pageHeading} Catering
                    </h2>
                    <VegNonVegToggle />
                    {Object.entries(menuSections).map(([section, { title, limit }]) => {
                        const selectedCount = (selectedItems[section] || []).length;
                        const extraCount = (extraItems[section] || []).length;
                        const totalCount = selectedCount + extraCount;

                        return (
                            <div
                                key={section}
                                className={`flex items-center justify-between px-4 py-3 rounded-md transition-colors cursor-pointer ${selectedSection === section ? 'bg-green-500 text-white' : 'hover:bg-green-100'
                                    }`}
                                onClick={() => setSelectedSection(section)}
                            >
                                <span>{title}</span>
                                <span className="text-sm">
                                    {totalCount >= limit ? '✓' : `${totalCount}/${limit}`}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Middle Section */}
                <div className="w-full md:w-1/2 p-8 overflow-y-auto">
                    {selectedSection ? (
                        <div>
                            <h3 className="text-2xl font-semibold mb-6">
                                {menuSections[selectedSection].title}
                                <span className="text-gray-500 text-base ml-2">
                                    (Select {menuSections[selectedSection].limit} items)
                                </span>
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                {menuSections[selectedSection].items.map((item) => (
                                    <div key={item} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={`${selectedSection}-${item}`}
                                            checked={(selectedItems[selectedSection] || []).includes(item)}
                                            onChange={() => toggleItemSelection(selectedSection, item)}
                                            className="h-4 w-4"
                                        />
                                        <label
                                            htmlFor={`${selectedSection}-${item}`}
                                            className="text-sm font-medium"
                                        >
                                            {item}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 mt-4">
                                Selected: {(selectedItems[selectedSection] || []).length} /
                                {menuSections[selectedSection].limit}
                            </p>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">
                            Select a section from the sidebar to view items
                        </div>
                    )}
                </div>


                {/* User Basic Details */}

                <div className="w-full md:w-1/5 p-5 bg-green-50">
                    <div className="w-full max-w-md p-6 bg-green-100 rounded-lg shadow-sm">
                        <h3 className="text-lg font-bold mb-4 text-green-700 text-center">Guest Count</h3>
                        <div className="flex items-center justify-center">
                            <button
                                onClick={() => updateGuestCount("decrement")}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-l-md transition-colors"
                            >
                                -
                            </button>
                            <input
                                type="number"
                                value={userDetails.guestCount}
                                onChange={(e) => {
                                    const value = Math.max(MIN_GUESTS, Math.min(MAX_GUESTS, Number(e.target.value)));
                                    setUserDetails((prev) => ({ ...prev, guestCount: value }));
                                }}
                                min={MIN_GUESTS}
                                max={MAX_GUESTS}
                                className="w-20 p-2 text-center border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
                                required
                            />
                            <button
                                onClick={() => updateGuestCount("increment")}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-r-md transition-colors"
                            >
                                +
                            </button>
                        </div>
                        <div className="space-y-2 mt-4">
                            <div className="flex justify-between">
                                <span>Plate Price:</span>
                                <span>
                                    ₹{platePrice}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-bold mb-4 text-green-700 text-center">
                            Basic Details
                        </h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={userBasicDetails.name}
                                onChange={handleBasicDetailsChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={userBasicDetails.phone}
                                onChange={handleBasicDetailsChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                            <button
                                onClick={proceedToViewPrices}
                                className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
                            >
                                View Prices
                            </button>
                            {renderSelectedItemsList()}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuSelection;