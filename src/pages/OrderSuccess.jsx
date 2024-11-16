import React from 'react';

const OrderSuccess = () => (
  <div className="container mx-auto p-8">
    <h1 className="text-4xl font-bold text-green-600 mb-4">Order Placed Successfully!</h1>
    <p>Your order has been placed and is being processed. Thank you!</p>
    <button onClick={() => window.location.href = '/'} className="mt-8 bg-blue-500 text-white py-2 px-4 rounded">
      Back to Home
    </button>
  </div>
);

export default OrderSuccess;
