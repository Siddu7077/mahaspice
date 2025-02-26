import React, { useState, useEffect } from "react";
import { IndianRupee, Calendar, Tag, Package } from "lucide-react";
import { useAuth } from "./AuthSystem";

const DeliveryPrevOrders = ({ activeTab }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      fetchOrders(user.phone, activeTab);
    }
  }, [user, activeTab]);

  const fetchOrders = async (phone, type) => {
    setLoading(true);
    try {
      const response = await fetch(`https://adminmahaspice.in/ms3/DelPrevOrders.php?phone=${phone}&type=${type}`);
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-xl">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-xl text-gray-500">No orders found.</div>
      </div>
    );
  }

  return (
    <div>
      {orders.map((order) => (
        <div key={order.payment_order.payment_id} className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* Customer Details */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">
              OrderId: {order.order_home?.[0]?.order_id || "N/A"}
            </h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-sm font-semibold text-gray-500">Name:</span>
                <span className="ml-2">{order.customer.name}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-semibold text-gray-500">Phone:</span>
                <span className="ml-2">{order.customer.phone1}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-semibold text-gray-500">Address:</span>
                <span className="ml-2">{order.customer.address}</span>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-sm font-semibold text-gray-500">Payment ID:</span>
              <span className="ml-2">{order.payment_order.payment_id}</span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                order.payment_order.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {order.payment_order.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center">
              <IndianRupee size={16} className="text-gray-500 mr-2" />
              <span className="text-sm">₹{order.payment_order.amount}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="text-gray-500 mr-2" />
              <span className="text-sm">{order.payment_order.created_at}</span>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Items</h3>
            {(order.order_home || []).map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b py-2">
                <div className="flex items-center">
                  <Package size={16} className="text-gray-500 mr-2" />
                  <span className="text-sm">{item.item_name}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {item.quantity} x ₹{item.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeliveryPrevOrders;