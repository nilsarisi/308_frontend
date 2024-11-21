import React from "react";

const OrderSuccess = () => {
  const orderData = JSON.parse(localStorage.getItem("orderData")); // Get order data from localStorage

  if (!orderData) {
    return <div>Order not found</div>; // Handle case if no order is found
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Order Placed Successfully!</h1>
      <p>Your order has been placed and is being processed. Thank you!</p>
      <div className="mt-6">
        <h2 className="text-2xl font-bold">Order Details</h2>
        <p><strong>Order Number:</strong> #{orderData.orderNumber}</p>
        <p><strong>Status:</strong> {orderData.status}</p>
        <p><strong>Estimated Delivery:</strong> {orderData.estimatedDelivery}</p>
        <h3 className="mt-4 text-xl font-semibold">Order Summary:</h3>
        {orderData.items.map((item) => (
          <p key={item.id}>
            {item.name} x {item.quantity} - ₺{(item.price * item.quantity).toFixed(2)}
          </p>
        ))}
        <p className="font-bold mt-4">Total Price: ₺{orderData.totalPrice}</p>
      </div>
      <button
        onClick={() => window.location.href = '/'}
        className="mt-8 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Back to Home
      </button>
    </div>
  );
};

export default OrderSuccess;