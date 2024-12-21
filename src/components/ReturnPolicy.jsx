import React from 'react';

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
     <Helmet>
        <title>Webhost Devs | Return Policy</title>
        <meta name="description" content="Discover the return policy for Webhost Devs, ensuring the best customer satisfaction with flexible refund and return options." />
        <meta name="keywords" content="Webhost Devs, Return Policy, Customer Satisfaction, Food Order Refunds, Food Returns" />
        <meta name="author" content="Webhost Devs" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.webhostdevs.com/return-policy" />
        <meta property="og:title" content="Webhost Devs | Return Policy" />
        <meta property="og:description" content="Learn about our return policy, including food order errors, incomplete orders, and dissatisfaction resolutions." />
        <meta property="og:url" content="https://www.webhostdevs.com/return-policy" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Webhost Devs" />
      </Helmet>
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10 border-b-4 border-gray-200 pb-4">
          Return Policy
        </h1>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          To provide the best customer satisfaction, we offer the following solutions. If you have any questions regarding the Return Policy, 
          please call <span className="text-blue-600 font-medium">040-2222 8888</span>. Preparation of your order begins immediately after 
          confirmation. Returns are not accepted once your order is confirmed with the restaurant.
        </p>

        {/* Food Order Errors */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Food Order Errors</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            If you receive food that is different from your receipt, we sincerely apologize. Please call us as soon as you notice the error. 
            You may come to pick up the correct food item. For credit card payments, the incorrect item will be refunded, and the new item charged. 
            For cash payments, the balance will be adjusted accordingly. In some cases, we may offer store credit. 
            Please return the incorrect food in its original container(s).
          </p>
        </section>

        {/* Food Order Incomplete */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Food Order Incomplete</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            If any food item listed on your receipt is missing, we will make it right. Please call us immediately to report the issue. 
            You may cancel the unprepared item and receive a refund, store credit, or a replacement, based on your preference.
          </p>
        </section>

        {/* Food Dissatisfaction */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Food Dissatisfaction</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            We take pride in preparing fresh food with the finest ingredients. If you are dissatisfied due to a dislike or objects in the food, 
            please call us immediately. Return the food in its original container(s) for investigation. We can prepare a replacement or issue a refund 
            (cash, credit card, or store credit) upon confirmation of the issue by the manager on duty.
          </p>
        </section>
        
        {/* Additional Notes */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Additional Notes</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Refunds and returns are handled at the manager's discretion, based on the specific circumstances of each case. 
            Your satisfaction is our priority, and we are committed to resolving any issues promptly.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ReturnPolicy;
