import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminEditCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        axios.get('http://localhost/ms3/getcategory.php')
            .then(response => {
                // Group categories by category name
                const groupedCategories = {};
                response.data.forEach(category => {
                    if (!groupedCategories[category.category_name]) {
                        groupedCategories[category.category_name] = [];
                    }
                    groupedCategories[category.category_name].push(category);
                });

                setCategories(Object.values(groupedCategories));
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
                setError('Failed to fetch categories');
                setLoading(false);
            });
    };

    const handleDeleteCategory = (categoryName) => {
        if (window.confirm(`Are you sure you want to delete the entire category "${categoryName}"?`)) {
            axios.delete(`http://localhost/ms3/deletecategory.php`, {
                data: { category_name: categoryName }
            })
            .then(response => {
                alert(response.data.message);
                fetchCategories(); // Refresh the list
            })
            .catch(error => {
                console.error('Error deleting category:', error);
                alert('Failed to delete category');
            });
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Edit Categories</h1>
            
            {categories.length === 0 ? (
                <p className="text-gray-500">No categories found</p>
            ) : (
                <div className="grid gap-4">
                    {categories.map((categoryGroup, index) => (
                        <div key={index} className="bg-white p-4 rounded shadow-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl hidden font-semibold">
                                    {categoryGroup[0].category_id}
                                </h2>
                                <h2 className="text-2xl  font-semibold">
                                    {categoryGroup[0].category_name}
                                </h2>
                                <div className="flex space-x-2">
                                    <Link 
                                        to={`/editcategory/${categoryGroup[0].category_name}`} 
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    >
                                        Edit
                                    </Link>
                                    <button 
                                        onClick={() => handleDeleteCategory(categoryGroup[0].category_name)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border p-2 text-left">Menu Type</th>
                                        <th className="border p-2 text-left">Category Limit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categoryGroup.map((category, catIndex) => (
                                        <tr key={catIndex} className="border-b">
                                            <td className="border p-2">{category.menu_type}</td>
                                            <td className="border p-2">{category.category_limit}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminEditCategory;