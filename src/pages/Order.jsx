import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext"; // Import context to get order data

const OrderStatus = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState("Processing");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [orderNumber] = useState(Math.floor(Math.random() * 1000000)); // Simulating an order number

  // Simulate status change after some time (You can fetch this data from an API)
  useEffect(() => {
    if (orderStatus === "Processing") {
      setTimeout(() => setOrderStatus("Shipped"), 5000); // After 5 seconds, change to "Shipped"
    }
    if (orderStatus === "Shipped") {
      setTimeout(() => setOrderStatus("Delivered"), 10000); // After 10 seconds, change to "Delivered"
    }
  }, [orderStatus]);

  // Simulate an estimated delivery time
  useEffect(() => {
    if (orderStatus === "Processing") {
      setEstimatedDelivery("Within 5-7 business days");
    } else if (orderStatus === "Shipped") {
      setEstimatedDelivery("In Transit, expected in 2-3 days");
    } else if (orderStatus === "Delivered") {
      setEstimatedDelivery("Delivered");
    }
  }, [orderStatus]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center">Order Status</h1>
      <div className="mt-6 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold">Order #{orderNumber}</h2>
        <p className="mt-2"><strong>Status:</strong> {orderStatus}</p>
        <p className="mt-2"><strong>Estimated Delivery:</strong> {estimatedDelivery}</p>

        <h3 className="text-xl font-bold mt-6">Order Summary</h3>
        {cart.map((item) => (
          <p key={item.id}>
            {item.name} x {item.quantity} - ₺{(item.price * item.quantity).toFixed(2)}
          </p>
        ))}

        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderStatus;