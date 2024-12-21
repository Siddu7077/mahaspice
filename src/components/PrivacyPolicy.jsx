import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 text-center">Privacy Policy</h1>
          <p className="text-gray-600 text-center mt-2">Effective Date: January 1, 2024</p>
        </header>

        {/* Sections */}
        <div className="space-y-10">
          {/* Privacy Policy Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-300 pb-2">Privacy Policy</h2>
            <ul className="mt-4 space-y-4 text-gray-700 list-disc pl-5">
              <li>
                Mahaspice.in stores user's personal information provided through forms during registration or login, including name, address, mobile number, and email.
              </li>
              <li>Your IP is stored while placing an order to prevent fraudulent orders, which may be reported to higher authorities.</li>
              <li>
                Devices used for orders are identified via IP address. This information helps track trends and manage legal compliance.
              </li>
            </ul>
          </section>

          {/* Disclaimer Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-300 pb-2">Disclaimer</h2>
            <ul className="mt-4 space-y-4 text-gray-700 list-disc pl-5">
              <li>
                The company reserves the right to modify content without notice.
              </li>
              <li>
                Users are responsible for reading and accepting terms before placing orders.
              </li>
              <li>
                Visual representations in the app may differ from actual products.
              </li>
              <li>
                Terms and conditions are subject to change at any time.
              </li>
            </ul>
          </section>

          {/* Cancellation Policy Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-300 pb-2">
              Cancellation, Refund & Return Policy
            </h2>
            <ul className="mt-4 space-y-4 text-gray-700 list-disc pl-5">
              <li>Orders can be canceled before cooking begins.</li>
              <li>After cooking starts, cancellations are not permitted.</li>
              <li>Payments are accepted via COD or online methods.</li>
              <li>No refunds once orders are cooked and out for delivery.</li>
            </ul>
          </section>

          {/* Service Use Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-300 pb-2">Mahaspice.in Service Use</h2>
            <ul className="mt-4 space-y-4 text-gray-700 list-disc pl-5">
              <li>
                Users may use the application only upon accepting terms, conditions, and the Privacy Policy.
              </li>
              <li>
                Mahaspice.in reserves the right to update Terms & Conditions, effective immediately.
              </li>
            </ul>
          </section>

          {/* Ordering Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-300 pb-2">Ordering</h2>
            <ul className="mt-4 space-y-4 text-gray-700 list-disc pl-5">
              <li>
                Users must ensure payment methods, such as credit or debit card details, are accurate and authorized.
              </li>
              <li>
                Users are responsible for verifying that ordered items meet their requirements.
              </li>
            </ul>
          </section>

          {/* Prices and Payment Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-300 pb-2">Prices and Payment</h2>
            <ul className="mt-4 space-y-4 text-gray-700 list-disc pl-5">
              <li>
                Prices listed at the time of ordering are determined by Mahaspice.in authority and are subject to change.
              </li>
              <li>
                Menu items may be altered or deactivated without notice.
              </li>
              <li>
                Total prices, including taxes and delivery charges, are displayed during checkout.
              </li>
              <li>
                Secure payment methods ensure the encryption of sensitive information.
              </li>
            </ul>
          </section>

          {/* Delivery Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-300 pb-2">Delivery</h2>
            <ul className="mt-4 space-y-4 text-gray-700 list-disc pl-5">
              <li>Delivery times are estimates and may vary based on conditions.</li>
              <li>Late deliveries do not entitle refunds or void charges.</li>
              <li>
                Failed deliveries due to insufficient address details are the user’s responsibility.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;