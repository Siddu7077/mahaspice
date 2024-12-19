import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white min-h-screen">
      <div className="space-y-8">
        {/* Privacy Policy Section */}
        <section className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-800 border-b border-gray-200 pb-2">
            Privacy Policy
          </h1>
          <ul className="space-y-4 text-gray-600 list-disc pl-5">
            <li className="leading-relaxed">
              Mahaspice.in stores user's personal information that you may voluntarily provide on online forms such as during registration & login. The personally identifiable information (Personal Information) collected on this Site or in our Mobile Application can include your name, address, mobile number, email addresses, and any other information you may need to provide.
            </li>
            <li className="leading-relaxed">
              Your IP is stored while placing an order through our Web Application or Mobile Application to avoid fraud orders. Fraud orders will be recorded and reported to the higher authority for legal actions.
            </li>
            <li className="leading-relaxed">
              In addition to the Personal Information mentioned, our web application automatically identifies devices by their IP address and device used for placing the order. Mahaspice.in may use IP addresses to analyze trends, track fraud users, and gather dynamic information for legal processes.
            </li>
          </ul>
        </section>

        {/* Disclaimer Section */}
        <section className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-800 border-b border-gray-200 pb-2">
            Disclaimer
          </h1>
          <ul className="space-y-4 text-gray-600 list-disc pl-5">
            <li className="leading-relaxed">Company reserves the right to change any part or piece of information on this website without any notice to customers or visitors.</li>
            <li className="leading-relaxed">It is the user's responsibility to read and accept these terms and conditions before placing an order using our Mahaspice.in Web Application or Mobile Application.</li>
            <li className="leading-relaxed">The graphical or photographic images displayed in our application are specially designed for application purposes and may vary in color, size, add-ons, etc.</li>
            <li className="leading-relaxed">Mahaspice.in (GSR Hospitality Services) reserves the right to change or modify the terms and conditions at any time.</li>
          </ul>
        </section>

        {/* Cancellation Policy Section */}
        <section className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-800 border-b border-gray-200 pb-2">
            Cancellation, Refund & Return Policy
          </h1>
          <ul className="space-y-4 text-gray-600 list-disc pl-5">
            <li className="leading-relaxed">A user can cancel an order before the order completes its cooking.</li>
            <li className="leading-relaxed">After the order completes cooking, a user cannot cancel the order.</li>
            <li className="leading-relaxed">Payments can be made through Cash on Delivery (COD) or using our online payment methods.</li>
            <li className="leading-relaxed">Once the order completes cooking and is out for delivery, payments made will not be refunded.</li>
          </ul>
        </section>

        {/* Service Use Section */}
        <section className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-800 border-b border-gray-200 pb-2">
            Mahaspice.in Service Use
          </h1>
          <ul className="space-y-4 text-gray-600 list-disc pl-5">
            <li className="leading-relaxed">User is allowed to use the Mahaspice.in application subject to acceptance of the terms and conditions and the Privacy Policy on the Mahaspice.in App and/or Web App.</li>
            <li className="leading-relaxed">Mahaspice.in claims the right to change the Terms & Conditions, which are immediately applicable.</li>
          </ul>
        </section>

        {/* Ordering Section */}
        <section className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-800 border-b border-gray-200 pb-2">
            Ordering
          </h1>
          <ul className="space-y-4 text-gray-600 list-disc pl-5">
            <li className="leading-relaxed">Users of Mahaspice.in warrant that the banking or any other payment mode details provided are of their own credit or debit cards or wallet information.</li>
            <li className="leading-relaxed">It's the user's sole responsibility to check whether the food ordered is suitable for the intended recipient and meets age criteria.</li>
          </ul>
        </section>

        {/* Prices and Payment Section */}
        <section className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-800 border-b border-gray-200 pb-2">
            Prices and Payment
          </h1>
          <ul className="space-y-4 text-gray-600 list-disc pl-5">
            <li className="leading-relaxed">All prices listed on the Mahaspice.in Web App or Mobile App for food are correct at the time of listing and decided by Mahaspice.in Authority.</li>
            <li className="leading-relaxed">Mahaspice.in reserves the right to alter the menu of food available for sale on the Web App or Mobile App and to deactivate or remove items from the listing.</li>
            <li className="leading-relaxed">Price changes before the order is placed will not be liable to the delivery boy.</li>
            <li className="leading-relaxed">The total price for food and delivery, including all charges and taxes, will be displayed on the Mahaspice.in Web App or Mobile App at the time of placing an order. Full payment must be made for all particulars mentioned in the order.</li>
            <li className="leading-relaxed">If you choose online payment, ensure that the payment mode is secure. Your debit/credit card details will be encrypted to prevent unauthorized access. Necessary security checks by your banking company may be conducted to confirm your identity before processing payments.</li>
          </ul>
        </section>

        {/* Delivery Section */}
        <section className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 border-b border-gray-200 pb-2">
            Delivery
          </h1>
          <ul className="space-y-4 text-gray-600 list-disc pl-5">
            <li className="leading-relaxed">Delivery times assured at the time of ordering are approximate and may vary depending on the type of food and traffic conditions.</li>
            <li className="leading-relaxed">In case of late delivery, the delivery charge will neither be voided nor refunded by Mahaspice.in. Users cannot force a delivery boy to void charges, as this may lead to legal actions.</li>
            <li className="leading-relaxed">If you fail to accept delivery due to inadequate address or landmark instructions, the food will be considered delivered, and all risks and responsibilities pass to the user. Mahaspice.in is not liable for any damage, cost, or expense incurred as a result.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;