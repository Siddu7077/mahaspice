import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthSystem";
import { useNavigate } from "react-router-dom";
import DownloadPDFButton from './CartPdf';

const CartPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCarts, setSelectedCarts] = useState([]);
  const navigate = useNavigate();

  // Fetch cart data for the user
  useEffect(() => {
    if (authLoading) return;

    const fetchCarts = async () => {
      try {
        const localUser = JSON.parse(localStorage.getItem("user"));
        const currentUser = user || localUser;

        if (!currentUser || !currentUser.id) {
          setError("Please login to view your cart.");
          setLoading(false);
          return;
        }

        const url = `https://adminmahaspice.in/ms3/get-cart.php?user_id=${currentUser.id}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch cart data.");
        }
        const data = await response.json();

        if (data.success) {
          setCarts(data.data); // Set the fetched cart data
        } else {
          throw new Error(data.error || "Failed to fetch cart data.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCarts();
  }, [user, authLoading]);

  // Handle cart selection
  const handleCartSelection = (cartId) => {
    if (selectedCarts.includes(cartId)) {
      setSelectedCarts((prev) => prev.filter((id) => id !== cartId)); // Deselect cart
    } else {
      setSelectedCarts((prev) => [...prev, cartId]); // Select cart
    }
  };

  // Handle cart deletion
  const handleDeleteCart = async (cartId) => {
    if (window.confirm("Are you sure you want to delete this cart? This action cannot be undone.")) {
      try {
        const response = await fetch(`https://adminmahaspice.in/ms3/delete-cart.php?cart_id=${cartId}`);
        if (!response.ok) {
          throw new Error("Failed to delete cart.");
        }
        const data = await response.json();

        if (data.success) {
          // Remove the deleted cart from the state
          setCarts((prevCarts) => prevCarts.filter((cart) => cart.cart_id !== cartId));
          setSelectedCarts((prev) => prev.filter((id) => id !== cartId)); // Deselect the deleted cart
          alert("Cart deleted successfully.");
        } else {
          throw new Error(data.error || "Failed to delete cart.");
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Group carts by event and menu type for display
  const groupedCarts = carts.reduce((acc, cart) => {
    const key = `${cart.event_name}-${cart.menu_type}`; // Group by event and menu type
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(cart);
    return acc;
  }, {});

  // Proceed to checkout functionality
  const handleProceedToCheckout = (cartId) => {
    const cart = carts.find((c) => c.cart_id === cartId);
    if (!cart) {
      console.error("Cart not found", { cartId, carts });
      alert("Cart not found. Please try again.");
      return;
    }

    navigate("/order", {
      state: {
        selectedItems: cart.items.filter((item) => !item.is_extra),
        extraItems: cart.items.filter((item) => item.is_extra),
        platePrice: cart.plate_price,
        guestCount: cart.guest_count,
        totalAmount: cart.total_price,
      },
    });
  };

  if (authLoading) {
    return <div className="p-8 text-center">Loading authentication...</div>;
  }
  if (loading) {
    return <div className="p-8 text-center">Loading cart...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      

      {/* Display grouped carts */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Available Carts</h2>
        <p className="text-gray-600 mb-4">
          Select any two carts to compare. You can view the menu as soon as you
          select one cart.
        </p>
        
        {Object.entries(groupedCarts).map(([key, carts]) => (
          <div key={key} className="mb-6">
            <h3 className="text-xl font-bold mb-2">
              {key} 
            </h3>
            <div className="flex flex-wrap gap-4">
              {carts.map((cart) => (
                <button
                  key={cart.cart_id}
                  onClick={() => handleCartSelection(cart.cart_id)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedCarts.includes(cart.cart_id)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } transition-colors`}
                >
                  Cart #{cart.cart_id} (₹{cart.plate_price})
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Display selected cart(s) */}
      {selectedCarts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Selected Cart(s)</h2>
          <DownloadPDFButton selectedCarts={selectedCarts} carts={carts} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedCarts.map((cartId) => {
              const cart = carts.find((c) => c.cart_id === cartId);
              if (!cart) return null;

              return (
                <div key={cartId} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">
                    Cart #{cartId} ({cart.event_name} - {cart.menu_type})
                  </h3>
                  <div className="space-y-2 mb-4 bg-white p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-gray-600">Guest Count:</div>
                      <div className="font-semibold text-right">
                        {cart.guest_count}
                      </div>
                      <div className="text-gray-600">Plate Price:</div>
                      <div className="font-semibold text-right">
                        ₹{cart.plate_price}
                      </div>
                    </div>
                  </div>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2">Category</th>
                        <th className="py-2">Item Name</th>
                        {/* <th className="py-2">Price</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {cart.items.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{item.category_name}</td>
                          <td className="py-2">
                            {item.item_name}{" "}
                            <span className="text-red-500">
                              {item.is_extra ? `₹${item.price} (Extra)` : ""}
                            </span>
                          </td>
                          {/* <td className="py-2 text-right"></td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => handleProceedToCheckout(cart.cart_id)}
                      className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                    >
                      Proceed to Checkout
                    </button>
                    <button
                      onClick={() => handleDeleteCart(cart.cart_id)}
                      className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                    >
                      Delete Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;