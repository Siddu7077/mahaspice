import React, { useState, useEffect } from "react";
import { User, Phone, Home, Package, Box, Edit, Save, X } from "lucide-react";
import { useAuth } from "./AuthSystem";
import MealPrevOrders from "./MealPrevOrders";
import DeliveryPrevOrders from "./DeliveryPrevOrders";
import SupMealPrevOrders from "./SupMealPrevOrders";
import SupDeliveryPrevOrders from "./SupDelPrevOrders";


const ProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("mealbox");
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setEditedProfile({
        name: user.name || "",
        address: user.address || "",
        phone: user.phone || "",
      });
      setLoading(false);
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validation and submission logic here
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({
      name: user?.name || "",
      address: user?.address || "",
      phone: user?.phone || "",
    });
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Please log in to view your profile.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Profile Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center text-blue-500 hover:text-blue-600 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
              >
                <Edit size={18} className="mr-1" />
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleEditSubmit}
                  className="flex items-center text-green-500 hover:text-green-600 px-3 py-1 rounded-md hover:bg-green-50 transition-colors"
                >
                  <Save size={18} className="mr-1" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center text-red-500 hover:text-red-600 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                >
                  <X size={18} className="mr-1" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <User className="text-gray-400 mr-3" size={20} />
              <div className="flex-1">
                <div className="text-sm text-gray-500">Name</div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="mt-1">{user.name}</div>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <Phone className="text-gray-400 mr-3" size={20} />
              <div className="flex-1">
                <div className="text-sm text-gray-500">Phone</div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.phone}
                    readOnly
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="mt-1">{user.phone}</div>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <Home className="text-gray-400 mr-3" size={20} />
              <div className="flex-1">
                <div className="text-sm text-gray-500">Address</div>
                {isEditing ? (
                  <textarea
                    value={editedProfile.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                ) : (
                  <div className="mt-1">{user.address}</div>
                )}
              </div>
            </div>
          </div>

          {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">My Orders</h2>

          <div className="flex mb-6 border-b">
            <button
              onClick={() => setActiveTab("mealbox")}
              className={`flex items-center mr-6 pb-3 ${activeTab === "mealbox"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500"
                }`}
            >
              <Package size={20} className="mr-2" />
              Mealbox Orders
            </button>

            <button
              onClick={() => setActiveTab("superfast-box")}
              className={`flex items-center pb-3 ${activeTab === "superfast-box"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500"
                }`}
            >
              <Package size={20} className="m-2" />
              Superfast Box Genie Orders
            </button>

            <button
              onClick={() => setActiveTab("home")}
              className={`flex items-center pb-3 ${activeTab === "home"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500"
                }`}
            >
              <Box size={20} className="m-2" />
              Home Delivery Orders
            </button>
            <button
              onClick={() => setActiveTab("superfast-home")}
              className={`flex items-center pb-3 ${activeTab === "superfast-home"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500"
                }`}
            >
              <Box size={20} className="m-2" />
              SuperfastHome Delivery Orders
            </button>
          
          </div>

          {/* Conditional rendering based on activeTab */}
         {activeTab === "mealbox" ? (
            <MealPrevOrders activeTab={activeTab} />
          ) : activeTab === "home" ? (
            <DeliveryPrevOrders activeTab={activeTab} />
          ) : activeTab === "superfast-home" ? (
            <SupDeliveryPrevOrders activeTab={activeTab} />
          ) : activeTab === "superfast-box" ? (
            <SupMealPrevOrders activeTab={activeTab} />
          ) : null}

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;