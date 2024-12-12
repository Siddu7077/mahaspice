import React from "react";
import { Utensils, ChefHat, Clock, Users } from "lucide-react";

const SuperFastDelivery = () => {
    return (
        <div className="bg-white p-6 rounded-lg">
            <h1 className="text-3xl font-bold text-red-700 mb-6 text-center">
                Ultimate Catering Delivery Service
            </h1>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex items-center mb-4">
                        <Utensils className="w-10 h-10 text-red-500 mr-4" />
                        <h2 className="text-xl font-semibold">Full Menu Delivery</h2>
                    </div>
                    <p className="text-gray-700">
                        Comprehensive catering solutions with a wide range of cuisines. From
                        corporate events to private parties, we bring your feast directly to
                        you.
                    </p>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex items-center mb-4">
                        <ChefHat className="w-10 h-10 text-green-600 mr-4" />
                        <h2 className="text-xl font-semibold">Chef-Prepared Meals</h2>
                    </div>
                    <p className="text-gray-700">
                        Professionally crafted dishes prepared by our expert chefs. Each
                        meal is carefully assembled and delivered fresh to maintain top
                        quality.
                    </p>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex items-center mb-4">
                        <Clock className="w-10 h-10 text-blue-500 mr-4" />
                        <h2 className="text-xl font-semibold">Super Fast Delivery</h2>
                    </div>
                    <p className="text-gray-700">
                        Guaranteed on-time delivery within specified time slots. We ensure
                        your catering arrives hot, fresh, and exactly when you need it.
                    </p>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex items-center mb-4">
                        <Users className="w-10 h-10 text-purple-500 mr-4" />
                        <h2 className="text-xl font-semibold">Event Scaling</h2>
                    </div>
                    <p className="text-gray-700">
                        Perfect for any group size - from intimate gatherings to large
                        corporate events. We scale our service to meet your exact
                        requirements.
                    </p>
                </div>
            </div>

            <div className="mt-6 text-center">
                <p className="text-red-600 font-medium">
                    🍽️ Delicious Catering, Delivered Perfectly! 🍽️
                </p>
            </div>
        </div>
    );
};

export default SuperFastDelivery;
