import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Minus, ShoppingCart, CreditCard } from 'lucide-react';

const MenuSelection = () => {
  const { eventType, menuType, serviceType } = useParams();
  const [menuData, setMenuData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [guestCount, setGuestCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Convert URL format to match API data format
  const formattedEventType = eventType.replace(/-/g, ' ');
  const formattedMenuType = serviceType.replace(/-/g, ' ');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch menu data
        const menuResponse = await fetch('https://mahaspice.desoftimp.com/ms3/menu_display.php');
        if (!menuResponse.ok) throw new Error('Failed to fetch menu data');
        const menuJson = await menuResponse.json();
        
        // Fetch category data
        const categoryResponse = await fetch('https://mahaspice.desoftimp.com/ms3/getcategory.php');
        if (!categoryResponse.ok) throw new Error('Failed to fetch category data');
        const categoryJson = await categoryResponse.json();

        if (menuJson.success && Array.isArray(menuJson.data)) {
          setMenuData(menuJson.data);
        }

        if (categoryJson.success && Array.isArray(categoryJson.data)) {
          setCategoryData(categoryJson.data);
        }

        setError(null);
      } catch (err) {
        setError('Failed to load menu data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getFilteredItems = () => {
    return menuData.filter(item => {
      const matchesEvent = item.event_categories.toLowerCase().includes(formattedEventType.toLowerCase());
      const matchesMenu = item.menu_type === formattedMenuType;
      return matchesEvent && matchesMenu;
    });
  };

  const getCategoryLimit = (categoryName) => {
    const category = categoryData.find(
      cat => cat.category_name === categoryName && cat.menu_type === formattedMenuType
    );
    return category ? parseInt(category.category_limit) : 0;
  };

  const getItemsInCategory = (categoryName) => {
    return selectedItems.filter(item => item.category_name === categoryName);
  };

  const handleItemSelect = (item) => {
    const categoryItems = getItemsInCategory(item.category_name);
    const limit = getCategoryLimit(item.category_name);

    if (selectedItems.some(selected => selected.id === item.id)) {
      setSelectedItems(selectedItems.filter(selected => selected.id !== item.id));
      return;
    }

    if (categoryItems.length < limit) {
      setSelectedItems([...selectedItems, item]);
    } else {
      const increasedPriceItem = {
        ...item,
        price: (parseFloat(item.price) * 1.5).toFixed(2),
        isExtra: true
      };
      setSelectedItems([...selectedItems, increasedPriceItem]);
    }
  };

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading menu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  const filteredItems = getFilteredItems();
  const categories = [...new Set(filteredItems.map(item => item.category_name))];

  // Format the display titles
  const displayEventType = formattedEventType.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  const displayMenuType = formattedMenuType.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{displayEventType}</h1>
          <p className="text-gray-600">{displayMenuType}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Menu Items */}
          <div className="lg:w-2/3">
            {categories.map(category => (
              <div key={category} className="mb-8 bg-white rounded-lg p-6 shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{category}</h2>
                  <span className="text-gray-600">
                    Limit: {getCategoryLimit(category)} items
                  </span>
                </div>

                <div className="space-y-4">
                  {filteredItems
                    .filter(item => item.category_name === category)
                    .map(item => (
                      <div 
                        key={item.id} 
                        className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedItems.some(selected => selected.id === item.id)}
                          onChange={() => handleItemSelect(item)}
                          className="h-5 w-5 rounded border-gray-300 text-blue-600"
                        />
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium">{item.item_name}</h3>
                          <p className="text-gray-600">₹{item.price}</p>
                        </div>
                        {item.is_veg === "1" ? (
                          <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                            Veg
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                            Non-veg
                          </span>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Side - Cart */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg p-6 shadow-md sticky top-4">
              <h2 className="text-2xl font-bold mb-6">Your Selection</h2>

              {/* Guest Count */}
              <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
                <span className="mr-4">Guests:</span>
                <button
                  onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  className="p-2 rounded-lg hover:bg-gray-200"
                >
                  <Minus size={20} />
                </button>
                <span className="mx-4 font-bold min-w-[3ch] text-center">{guestCount}</span>
                <button
                  onClick={() => setGuestCount(guestCount + 1)}
                  className="p-2 rounded-lg hover:bg-gray-200"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Selected Items */}
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                {selectedItems.map((item, index) => (
                  <div 
                    key={`${item.id}-${index}`}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{item.item_name}</p>
                      {item.isExtra && (
                        <span className="text-sm text-orange-600">Extra item (+50%)</span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{item.price}</p>
                      <button
                        onClick={() => handleItemSelect(item)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  For {guestCount} guest{guestCount !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  className={`
                    w-full py-3 px-4 rounded-lg flex items-center justify-center
                    ${selectedItems.length === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'} 
                    text-white font-medium transition-colors
                  `}
                  disabled={selectedItems.length === 0}
                >
                  <ShoppingCart className="mr-2" size={20} />
                  Add to Cart
                </button>
                <button
                  className={`
                    w-full py-3 px-4 rounded-lg flex items-center justify-center
                    ${selectedItems.length === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'} 
                    text-white font-medium transition-colors
                  `}
                  disabled={selectedItems.length === 0}
                >
                  <CreditCard className="mr-2" size={20} />
                  Proceed to Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuSelection;