import React, { useState, useEffect } from "react";
import { IndianRupee, Calendar, Tag, Package } from "lucide-react";
import { useAuth } from "./AuthSystem";

const SupMealPrevOrders = ({ activeTab }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (user?.phone) {
            fetchOrders(user.phone, activeTab);
        }
    }, [user, activeTab]);

    const fetchOrders = async (phone, type) => {
        setLoading(true);
        try {
            const response = await fetch(`https://mahaspice.desoftimp.com/ms3/fetch_sup_box_orders.php?phone=${phone}`);
            const data = await response.json();
            if (data.success && Array.isArray(data.orders)) {
                setOrders(data.orders);
            } else {
                setError(data.message || "No orders data available");
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

    if (!Array.isArray(orders) || orders.length === 0) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-xl text-gray-500">No orders found.</div>
            </div>
        );
    }

    return (
        <div>
            {orders.map((order) => {
                // Skip rendering if essential data is missing
                if (!order?.payment_order || !order?.customer) {
                    return null;
                }

                const { payment_order, customer, sup_box_orders } = order;

                return (
                    <div key={payment_order.payment_id || Math.random()} className="bg-white rounded-lg shadow-md p-6 mb-6">
                        {/* Customer Details */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-4">
                                OrderId: {sup_box_orders?.[0]?.order_id || "N/A"}
                            </h2>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <span className="text-sm font-semibold text-gray-500">Name:</span>
                                    <span className="ml-2">{customer.name || "N/A"}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-sm font-semibold text-gray-500">Phone:</span>
                                    <span className="ml-2">{customer.phone1 || "N/A"}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-sm font-semibold text-gray-500">Address:</span>
                                    <span className="ml-2">{customer.address || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Details */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="text-sm font-semibold text-gray-500">Payment ID:</span>
                                <span className="ml-2">{payment_order.payment_id || "N/A"}</span>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-sm ${payment_order.order_status === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                            >
                                {payment_order.order_status || "pending"}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center">
                                <IndianRupee size={16} className="text-gray-500 mr-2" />
                                <span className="text-sm">₹{payment_order.amount || "0"}</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar size={16} className="text-gray-500 mr-2" />
                                <span className="text-sm">{payment_order.created_at || "N/A"}</span>
                            </div>
                        </div>

                        {Array.isArray(sup_box_orders) && sup_box_orders.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold mb-2">Items</h3>
                                {sup_box_orders.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center border-b py-2">
                                        <div className="flex items-center">
                                            <Package size={16} className="text-gray-500 mr-2" />
                                            <span className="text-sm">{item.item_name || "N/A"}</span>
                                            <span className="text-sm ml-4">{item.package || "N/A"}</span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {item.quantity || 0} x ₹{item.price || 0}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default SupMealPrevOrders;