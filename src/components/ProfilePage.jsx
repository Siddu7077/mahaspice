import React, { useState, useEffect } from "react";
import {
  User,
  Phone,
  Home,
  Package,
  Clock,
  Zap,
  Users,
  Box,
  IndianRupee,
  Calendar,
  Tag,
  MapPin,
  Edit,
  Save,
  X,
} from "lucide-react";
import { useAuth } from "./AuthSystem";

const ProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("normal");
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const userData = {
    orders: {
      mealbox: {
        normal: [
          {
            id: "MB-N-001",
            paymentId: "PAY-123456",
            date: "2024-01-15",
            items: ["Butter Chicken", "Naan", "Rice"],
            amount: 299,
            status: "Delivered",
          },
          {
            id: "MB-N-002",
            paymentId: "PAY-123457",
            date: "2024-01-10",
            items: ["Dal Makhani", "Roti", "Rice"],
            amount: 249,
            status: "Delivered",
          },
        ],
        superfast: [
          {
            id: "MB-S-001",
            paymentId: "PAY-123458",
            date: "2024-01-16",
            items: ["Paneer Tikka", "Rumali Roti"],
            amount: 349,
            status: "Delivered",
          },
        ],
      },
      catering: [
        {
          id: "CAT-001",
          paymentId: "PAY-123459",
          date: "2024-01-01",
          event: "Birthday Party",
          guests: 50,
          amount: 15000,
          status: "Completed",
        },
      ],
      deliveryBox: [
        {
          id: "DB-001",
          paymentId: "PAY-123460",
          date: "2024-01-05",
          items: ["Weekly Meal Pack"],
          amount: 1999,
          status: "Delivered",
        },
      ],
    },
  };

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
      // Validation
      const validations = {
        name: editedProfile.name.trim(),
        address: editedProfile.address.trim(),
        phone: editedProfile.phone.trim()
      };
  
      // Check for empty fields
      const emptyFields = Object.entries(validations)
        .filter(([_, value]) => !value)
        .map(([field]) => field);
  
      if (emptyFields.length > 0) {
        throw new Error(`Please fill in all fields: ${emptyFields.join(', ')}`);
      }
  
      // Phone validation
      if (!/^\d{10}$/.test(validations.phone)) {
        throw new Error('Phone number must be exactly 10 digits');
      }
  
      // Prepare request data
      const requestData = {
        name: validations.name,
        address: validations.address,
        phone: validations.phone
      };
  
      console.log('Sending request with data:', requestData);
  
      const response = await fetch(
        'https://mahaspice.desoftimp.com/ms3/login/update_profile.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData)
        }
      );
  
      console.log('Response status:', response.status);
      
      // Try to parse response as JSON
      let data;
      try {
        const textResponse = await response.text();
        console.log('Raw response:', textResponse);
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Invalid response from server');
      }
  
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Server error occurred');
      }
  
      if (data.success) {
        // Update local state
        if (typeof updateUser === 'function') {
          updateUser({
            ...user,
            ...validations
          });
        }
        
        setIsEditing(false);
        alert('Profile updated successfully');
        window.location.reload();
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
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

  // Profile Information Section
  const ProfileInfo = () => {
    // Memoize the form inputs to prevent unnecessary re-renders
    const renderEditableField = (field, value, type = "input") => {
      if (type === "input") {
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      }
      return (
        <textarea
          value={value}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
        />
      );
    };

    return (
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
                renderEditableField("name", editedProfile.name)
              ) : (
                <div className="mt-1">{user?.name}</div>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <Phone className="text-gray-400 mr-3" size={20} />
            <div>
              <div className="text-sm text-gray-500">Phone</div>
              <div className="mt-1">{user?.phone}</div>
            </div>
          </div>

          <div className="flex items-center">
            <Home className="text-gray-400 mr-3" size={20} />
            <div className="flex-1">
              <div className="text-sm text-gray-500">Address</div>
              {isEditing ? (
                renderEditableField(
                  "address",
                  editedProfile.address,
                  "textarea"
                )
              ) : (
                <div className="mt-1">{user?.address}</div>
              )}
            </div>
          </div>
        </div>

        {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
      </div>
    );
  };

  const OrderCard = ({ order, type }) => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-sm font-semibold text-gray-500">Order ID:</span>
          <span className="ml-2">{order.id}</span>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            order.status === "Delivered" || order.status === "Completed"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="flex items-center">
          <IndianRupee size={16} className="text-gray-500 mr-2" />
          <span className="text-sm">₹{order.amount}</span>
        </div>
        <div className="flex items-center">
          <Calendar size={16} className="text-gray-500 mr-2" />
          <span className="text-sm">{order.date}</span>
        </div>
        <div className="flex items-center">
          <Tag size={16} className="text-gray-500 mr-2" />
          <span className="text-sm">{order.paymentId}</span>
        </div>
      </div>

      {type === "catering" ? (
        <div className="mt-2">
          <div className="flex items-center">
            <Users size={16} className="text-gray-500 mr-2" />
            <span className="text-sm">Guests: {order.guests}</span>
          </div>
          <div className="flex items-center mt-1">
            <Tag size={16} className="text-gray-500 mr-2" />
            <span className="text-sm">Event: {order.event}</span>
          </div>
        </div>
      ) : (
        <div className="mt-2">
          <div className="text-sm text-gray-600">{order.items.join(", ")}</div>
        </div>
      )}
    </div>
  );

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({
      name: user?.name || "",
      address: user?.address || "",
      phone: user?.phone || "",
    });
    setError(null);
  };

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
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
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
              onClick={() => setActiveTab("normal")}
              className={`flex items-center mr-6 pb-3 ${
                activeTab === "normal"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500"
              }`}
            >
              <Package size={20} className="mr-2" />
              Normal Mealbox
            </button>
            <button
              onClick={() => setActiveTab("superfast")}
              className={`flex items-center mr-6 pb-3 ${
                activeTab === "superfast"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500"
              }`}
            >
              <Zap size={20} className="mr-2" />
              Superfast Mealbox
            </button>
            <button
              onClick={() => setActiveTab("catering")}
              className={`flex items-center mr-6 pb-3 ${
                activeTab === "catering"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500"
              }`}
            >
              <Users size={20} className="mr-2" />
              Catering
            </button>
            <button
              onClick={() => setActiveTab("delivery")}
              className={`flex items-center pb-3 ${
                activeTab === "delivery"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500"
              }`}
            >
              <Box size={20} className="mr-2" />
              Delivery Box
            </button>
          </div>

          <div>
            {activeTab === "normal" && (
              <div>
                {userData.orders.mealbox.normal.map((order) => (
                  <OrderCard key={order.id} order={order} type="mealbox" />
                ))}
              </div>
            )}
            {activeTab === "superfast" && (
              <div>
                {userData.orders.mealbox.superfast.map((order) => (
                  <OrderCard key={order.id} order={order} type="mealbox" />
                ))}
              </div>
            )}
            {activeTab === "catering" && (
              <div>
                {userData.orders.catering.map((order) => (
                  <OrderCard key={order.id} order={order} type="catering" />
                ))}
              </div>
            )}
            {activeTab === "delivery" && (
              <div>
                {userData.orders.deliveryBox.map((order) => (
                  <OrderCard key={order.id} order={order} type="delivery" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
