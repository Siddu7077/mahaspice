import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const EditCategoryById = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categoryName, setCategoryName] = useState('');
    const [menuTypes, setMenuTypes] = useState([]);
    const [selectedMenuTypes, setSelectedMenuTypes] = useState([]);
    const [menuLimits, setMenuLimits] = useState({});
    const [currentCategory, setCurrentCategory] = useState(null);

    // Fetch menu types and current category details
    useEffect(() => {
        // Fetch menu types
        const fetchMenuTypes = axios.get('https://mahaspice.desoftimp.com/ms3/getMenuTypes.php');
        
        // Fetch current category details
        const fetchCategoryDetails = axios.get(`https://mahaspice.desoftimp.com/ms3/getcategorybyid.php?id=${id}`);

        Promise.all([fetchMenuTypes, fetchCategoryDetails])
            .then(([menuTypesResponse, categoryResponse]) => {
                // Set menu types
                if (menuTypesResponse.data && Array.isArray(menuTypesResponse.data)) {
                    setMenuTypes(menuTypesResponse.data);
                } else if (menuTypesResponse.data && menuTypesResponse.data.menu_types) {
                    setMenuTypes(menuTypesResponse.data.menu_types);
                }

                // Set current category details
                if (categoryResponse.data) {
                    setCurrentCategory(categoryResponse.data);
                    
                    // Populate selected menu types and limits
                    const initialSelectedTypes = categoryResponse.data.map(cat => cat.menu_type);
                    const initialLimits = {};
                    
                    categoryResponse.data.forEach(cat => {
                        initialLimits[cat.menu_type] = cat.category_limit;
                    });

                    setSelectedMenuTypes(initialSelectedTypes);
                    setMenuLimits(initialLimits);
                    setCategoryName(categoryResponse.data[0].category_name);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                alert('Failed to fetch category details');
            });
    }, [id]);

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

        if (!categoryName || selectedMenuTypes.length === 0) {
            alert('Please fill all fields');
            return;
        }

        const formData = {
            category_id: id,
            category_name: categoryName,
            menu_type: selectedMenuTypes,
            category_limits: menuLimits
        };

        axios.post('https://mahaspice.desoftimp.com/ms3/updatecategory.php', formData)
            .then(response => {
                alert(response.data.message);
                navigate('/admincategory'); // Updated navigation path
            })
            .catch(error => {
                console.error('Error updating category:', error);
                alert('Failed to update category');
            });
    };

    const handleGoBack = () => {
        navigate('admincategory');
    };

    if (!currentCategory) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex justify-center items-center h-full bg-gray-100">
            <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
                <div className="flex items-center mb-4">
                    <button 
                        type="button" 
                        onClick={handleGoBack} 
                        className="mr-4 hover:bg-gray-100 rounded-full p-2"
                    >
                        <ArrowLeft className="text-gray-700" />
                    </button>
                    <h2 className="text-2xl font-bold">Edit Category</h2>
                </div>

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
                    Update Category
                </button>
            </form>
        </div>
    );
};

export default EditCategoryById;