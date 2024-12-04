import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;

  if (!orderData) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Order Not Found</h1>
        <p>We couldn't find your order. Please try again or contact support.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-8 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-green-600 mb-4">
        Order Placed Successfully!
      </h1>
      <p>Your order has been placed and is being processed. Thank you!</p>
      <div className="mt-6">
        <h2 className="text-2xl font-bold">Order Details</h2>
        <p>
          <strong>Order Number:</strong> #{orderData.orderNumber}
        </p>
        <p>
          <strong>Status:</strong> {orderData.status}
        </p>
        <p>
          <strong>Estimated Delivery:</strong> {orderData.estimatedDelivery}
        </p>
        <h3 className="mt-4 text-xl font-semibold">Order Summary:</h3>
        {orderData.items.map((item, index) => (
          <p key={index}>
            {item.productId?.name || "Unknown Product"} x {item.quantity} - ₺
            {(item.productId?.price * item.quantity).toFixed(2)}
          </p>
        ))}
        <p className="font-bold mt-4">Total Price: ₺{orderData.totalPrice}</p>
      </div>
      <button
        onClick={() => navigate("/")}
        className="mt-8 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Back to Home
      </button>
    </div>
  );
};

export default OrderSuccess;