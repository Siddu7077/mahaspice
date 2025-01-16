import React, { useState } from 'react';
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
  MapPin
} from 'lucide-react';

const ProfilePage = () => {
  // Sample user data - replace with actual data from your context/API
  const userData = {
    name: "John Doe",
    phone: "9876543210",
    address: "123 Main Street, Bangalore, Karnataka",
    orders: {
      mealbox: {
        normal: [
          {
            id: "MB-N-001",
            paymentId: "PAY-123456",
            date: "2024-01-15",
            items: ["Butter Chicken", "Naan", "Rice"],
            amount: 299,
            status: "Delivered"
          },
          {
            id: "MB-N-002",
            paymentId: "PAY-123457",
            date: "2024-01-10",
            items: ["Dal Makhani", "Roti", "Rice"],
            amount: 249,
            status: "Delivered"
          }
        ],
        superfast: [
          {
            id: "MB-S-001",
            paymentId: "PAY-123458",
            date: "2024-01-16",
            items: ["Paneer Tikka", "Rumali Roti"],
            amount: 349,
            status: "Delivered"
          }
        ]
      },
      catering: [
        {
          id: "CAT-001",
          paymentId: "PAY-123459",
          date: "2024-01-01",
          event: "Birthday Party",
          guests: 50,
          amount: 15000,
          status: "Completed"
        }
      ],
      deliveryBox: [
        {
          id: "DB-001",
          paymentId: "PAY-123460",
          date: "2024-01-05",
          items: ["Weekly Meal Pack"],
          amount: 1999,
          status: "Delivered"
        }
      ]
    }
  };

  const [activeTab, setActiveTab] = useState('normal');

  const OrderCard = ({ order, type }) => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-sm font-semibold text-gray-500">Order ID:</span>
          <span className="ml-2">{order.id}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          order.status === 'Delivered' || order.status === 'Completed' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
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

      {type === 'catering' ? (
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
          <div className="text-sm text-gray-600">
            {order.items.join(", ")}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <User className="text-gray-400 mr-3" size={20} />
              <div>
                <div className="text-sm text-gray-500">Name</div>
                <div>{userData.name}</div>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="text-gray-400 mr-3" size={20} />
              <div>
                <div className="text-sm text-gray-500">Phone</div>
                <div>{userData.phone}</div>
              </div>
            </div>
            <div className="flex items-center">
              <Home className="text-gray-400 mr-3" size={20} />
              <div>
                <div className="text-sm text-gray-500">Address</div>
                <div>{userData.address}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">My Orders</h2>

          {/* Order Type Tabs */}
          <div className="flex mb-6 border-b">
            <button
              onClick={() => setActiveTab('normal')}
              className={`flex items-center mr-6 pb-3 ${
                activeTab === 'normal'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500'
              }`}
            >
              <Package size={20} className="mr-2" />
              Normal Mealbox
            </button>
            <button
              onClick={() => setActiveTab('superfast')}
              className={`flex items-center mr-6 pb-3 ${
                activeTab === 'superfast'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500'
              }`}
            >
              <Zap size={20} className="mr-2" />
              Superfast Mealbox
            </button>
            <button
              onClick={() => setActiveTab('catering')}
              className={`flex items-center mr-6 pb-3 ${
                activeTab === 'catering'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500'
              }`}
            >
              <Users size={20} className="mr-2" />
              Catering
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`flex items-center pb-3 ${
                activeTab === 'delivery'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500'
              }`}
            >
              <Box size={20} className="mr-2" />
              Delivery Box
            </button>
          </div>

          {/* Order Cards */}
          <div>
            {activeTab === 'normal' && (
              <div>
                {userData.orders.mealbox.normal.map((order) => (
                  <OrderCard key={order.id} order={order} type="mealbox" />
                ))}
              </div>
            )}
            {activeTab === 'superfast' && (
              <div>
                {userData.orders.mealbox.superfast.map((order) => (
                  <OrderCard key={order.id} order={order} type="mealbox" />
                ))}
              </div>
            )}
            {activeTab === 'catering' && (
              <div>
                {userData.orders.catering.map((order) => (
                  <OrderCard key={order.id} order={order} type="catering" />
                ))}
              </div>
            )}
            {activeTab === 'delivery' && (
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