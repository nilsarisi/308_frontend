import React, { useEffect, useState } from 'react';

const OrderStatus = () => {
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem('orderData'));
    if (storedOrder) {
      setOrderData(storedOrder);
    }
  }, []);

  if (!orderData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center">Order Status</h1>
      <div className="mt-6 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold">Order #{orderData.orderNumber}</h2>
        <p className="mt-2"><strong>Status:</strong> {orderData.status}</p>
        <p className="mt-2"><strong>Estimated Delivery:</strong> {orderData.estimatedDelivery}</p>

        <h3 className="text-xl font-bold mt-6">Order Summary</h3>
        {orderData.items.map((item) => (
          <p key={item.id}>
            {item.name} x {item.quantity} - ₺{(item.price * item.quantity).toFixed(2)}
          </p>
        ))}

        <button
          onClick={() => window.location.href = '/'}
          className="mt-6 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderStatus;