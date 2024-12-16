import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddCategory = () => {
    const [categoryName, setCategoryName] = useState('');
    const [menuTypes, setMenuTypes] = useState([]); // List of menu types from gscd table
    const [selectedMenuTypes, setSelectedMenuTypes] = useState([]); // Selected menu types
    const [menuLimits, setMenuLimits] = useState({}); // Limits for each selected menu type

    // Fetch menu types directly from gscd table
    useEffect(() => {
        axios.get('/ms3/getMenuTypes.php')
            .then(response => {
                console.log('Menu Types Response:', response.data);
                
                // Adjust based on your exact response structure
                if (response.data && Array.isArray(response.data)) {
                    setMenuTypes(response.data);
                } else if (response.data && response.data.menu_types) {
                    setMenuTypes(response.data.menu_types);
                } else {
                    console.warn('No menu types found:', response.data);
                    setMenuTypes([]);
                }
            })
            .catch(error => {
                console.error('Error fetching menu types:', error);
                setMenuTypes([]);
            });
    }, []);

    const handleCheckboxChange = (menuType) => {
        const type = typeof menuType === 'object' ? menuType.menu_type : menuType;

        if (selectedMenuTypes.includes(type)) {
            setSelectedMenuTypes(selectedMenuTypes.filter(t => t !== type));
            // Remove limit for unselected menu type
            const updatedLimits = { ...menuLimits };
            delete updatedLimits[type];
            setMenuLimits(updatedLimits);
        } else {
            setSelectedMenuTypes([...selectedMenuTypes, type]);
        }
    };

    const handleLimitChange = (menuType, limit) => {
        setMenuLimits({
            ...menuLimits,
            [menuType]: limit
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!categoryName || selectedMenuTypes.length === 0 || Object.keys(menuLimits).length === 0) {
            alert('Please fill all fields');
            return;
        }

        const formData = {
            category_name: categoryName,
            menu_type: selectedMenuTypes,
            category_limits: menuLimits // Send limits as an object
        };

        axios.post('/ms3/addcategory.php', formData)
            .then(response => {
                alert(response.data.message);
                // Reset form
                setCategoryName('');
                setSelectedMenuTypes([]);
                setMenuLimits({});
            })
            .catch(error => {
                console.error('Error adding category:', error);
                alert('Failed to add category');
            });
    };

    return (
        <div className="flex justify-center items-center h-full bg-gray-100">
            <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-4">Add Category</h2>

                <div className="mb-4">
                    <label htmlFor="category_name" className="block text-gray-700 font-bold mb-2">Category Name</label>
                    <input
                        type="text"
                        id="category_name"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Menu Types</label>
                    {menuTypes.length > 0 ? (
                        menuTypes.map((menuType, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id={`menuType-${index}`}
                                    className="mr-2"
                                    value={menuType.menu_type || menuType}
                                    checked={selectedMenuTypes.includes(menuType.menu_type || menuType)}
                                    onChange={() => handleCheckboxChange(menuType)}
                                />
                                <label htmlFor={`menuType-${index}`}>
                                    {menuType.menu_type || menuType}
                                </label>

                                {selectedMenuTypes.includes(menuType.menu_type || menuType) && (
                                    <div className="ml-4">
                                        <input
                                            type="number"
                                            placeholder="Limit"
                                            value={menuLimits[menuType.menu_type || menuType] || ''}
                                            onChange={(e) => handleLimitChange(menuType.menu_type || menuType, e.target.value)}
                                            className="w-20 p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No menu types available</p>
                    )}
                </div>

                <button 
                    type="submit" 
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Add Category
                </button>
            </form>
        </div>
    );
};

export default AddCategory;
