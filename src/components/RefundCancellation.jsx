import React from 'react';

const RefundCancellation = () => {
  return (
    <div className="max-w-5xl my-5 mx-auto bg-white shadow-lg rounded-lg">
      <div className="border-b border-gray-200 bg-gray-50 p-6 rounded-t-lg">
        <h1 className="text-3xl font-bold text-gray-900">
          Refund & Cancellation Policy
        </h1>
      </div>
      
      <div className="p-6 space-y-8"> 
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Cancellation
          </h2>
          <div className="space-y-4 text-gray-600">
            <p className="leading-relaxed">
              Any Capitalized terms used but not defined herein shall have the meaning assigned to them under the Terms of
              Use which govern your use of our website <span className="font-semibold text-gray-800">MAHA SPICE CATERERS</span> (the "Website") and our
              'MAHA SPICE CATERERS' application for mobile and handheld devices (the "App"). The Website and the App are
              jointly referred to as the "Platform".
            </p>
            <p className="leading-relaxed">
              As a general rule, the Buyer shall not be entitled to cancel an Order once placed. The Buyer may choose to
              cancel an Order at any time, but it may lead to a penalty of <span className="font-medium text-gray-800">10-30%</span> of the price of the product. However,
              subject to the Buyer's previous cancellation history, <span className="font-semibold text-gray-800">MAHA SPICE CATERERS</span> reserves the
              right to deny any refund to the Buyer pursuant to a cancellation initiated by the Buyer.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Refunds
          </h2>
          <div className="space-y-4 text-gray-600">
            <p className="leading-relaxed">
              The Buyer may be entitled to a refund for prepaid Orders. <span className="font-semibold text-gray-800">MAHA SPICE CATERERS</span> retains the
              right to retain the penalty payable by the Buyer mentioned in the cancellation section from the amount
              refundable to them. The Buyer shall also be entitled to a refund of proportionate value in the event the
              packaging of an item in an Order or the complete Order is either tampered with or damaged, and the Buyer
              refuses to accept it at the time of delivery for the said reason.
            </p>
            <p className="leading-relaxed">
              The Buyer may be entitled to a refund up to 100% of the Order value if PDP fails to deliver the Order due to
              a cause attributable to either PDP or <span className="font-semibold text-gray-800">MAHA SPICE CATERERS</span>. However, such refunds will be
              assessed on a case-by-case basis by <span className="font-semibold text-gray-800">MAHA SPICE CATERERS</span>.
            </p>
            <p className="font-medium text-gray-800">
              Our decision on refunds shall be final and binding.
            </p>
            <p className="leading-relaxed">
              All refund amounts shall be credited to the Buyer's account as per the payment mechanism of the Buyer's
              choice. The estimated timelines are detailed below, in case the Buyer doesn't choose to credit it to their
              wallet with their <span className="font-semibold text-gray-800">MAHA SPICE CATERERS</span> Account:
            </p>
          </div>

          <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Process</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Payment Method</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Refund Source</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">TAT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">Order Edit/Cancellation/Compensation/Payment Failure</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Net Banking</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Source</td>
                  <td className="px-4 py-3 text-sm text-gray-600">5-7 Business Days</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">Order Edit/Cancellation/Compensation/Payment Failure</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Debit/Credit Cards</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Source</td>
                  <td className="px-4 py-3 text-sm text-gray-600">5-7 Business Days</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">Order Edit/Cancellation/Compensation/Payment Failure</td>
                  <td className="px-4 py-3 text-sm text-gray-600">UPI</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Source</td>
                  <td className="px-4 py-3 text-sm text-gray-600">3-4 Business Days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RefundCancellation;