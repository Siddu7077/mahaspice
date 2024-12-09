import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const MenuNavbar = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const { categoryName } = useParams();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://bookmycater.freewebhostmost.com/getCategory.php');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const jsonResponse = await response.json();
        
        // Filter out Customised Menu
        if (jsonResponse && jsonResponse.data && Array.isArray(jsonResponse.data)) {
          const filteredCategories = jsonResponse.data.filter(
            category => category.category_name.toLowerCase() !== 'customised menu'
          );
          setCategories(filteredCategories);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError(error.message);
      }
    };

    fetchCategories();
  }, []);

  // Format category name for URL (First letter of each word capitalized, rest lowercase)
  const formatCategoryUrlName = (categoryName) => {
    return categoryName
      .split(' ')
      .map(word => 
        word.charAt(0).toUpperCase() + 
        word.slice(1).toLowerCase()
      )
      .join('-');
  };

  // Format category name for display (Title Case)
  const formatCategoryDisplayName = (categoryName) => {
    return categoryName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Check if the current category is active
  const isActiveCategoryName = (formattedUrlName) => {
    // Remove hyphens and convert to lowercase for comparison
    const cleanUrlName = formattedUrlName.replace(/-/g, '').toLowerCase();
    const cleanCurrentCategory = (categoryName || '').replace(/-/g, '').toLowerCase();
    return cleanUrlName === cleanCurrentCategory;
  };

  // If there's an error, show error message
  if (error) {
    return (
      <nav className="bg-red-600 text-white p-4 text-center">
        Error loading categories: {error}
      </nav>
    );
  }

  // If no categories, show loading state
  if (categories.length === 0) {
    return (
      <nav className="bg-green-600 text-white p-4 text-center">
        Loading categories...
      </nav>
    );
  }

  return (
    <nav className="bg-green-600 text-white">
      <div className="container mx-auto flex justify-center space-x-4 py-3">
        {categories.map((category) => {
          const urlCategory = formatCategoryUrlName(category.category_name);
          
          return (
            <Link 
              key={category.category_id}
              to={`/events/:eventType/:serviceType/menu/${urlCategory}`}
              className={`px-4 py-2 rounded transition-colors ${
                isActiveCategoryName(urlCategory)
                  ? 'bg-white text-green-600 font-bold' 
                  : 'hover:bg-green-700'
              }`}
            >
              {formatCategoryDisplayName(category.category_name)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MenuNavbar;