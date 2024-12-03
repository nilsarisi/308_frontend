import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = "http://localhost:5001";

const OrderStatus = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const fetchAllOrders = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("Authentication token is missing.");

      const response = await axios.get(`${backendUrl}/api/orders/all`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setOrders(response.data);
    } catch (err) {
      console.error("Failed to fetch order details:", err.message);
      setError("Unable to fetch order details. Please try again later.");
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Authentication token is missing.");
        return;
      }

      await axios.put(
        `${backendUrl}/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      // Update the status locally for UI feedback
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Failed to update order status:", err.message);
      setError("Unable to update order status. Please try again.");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center">Order Status</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.orderId} className="mt-6 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold">Order #{order.orderId}</h2>
            <p className="mt-2">
              <strong>Status:</strong> {order.status}
            </p>
            <p className="mt-2">
              <strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="mt-2">
              <strong>Estimated Delivery:</strong> {order.estimatedDelivery || "N/A"}
            </p>
            <h3 className="text-xl font-bold mt-6">Order Summary</h3>
            {order.products.map((item, index) => (
              <p key={index}>
                {item.name} x {item.quantity} - ₺{(item.price * item.quantity).toFixed(2)}
              </p>
            ))}
            <p className="mt-4">
              <strong>Total Amount:</strong> ₺{order.totalAmount.toFixed(2)}
            </p>
          </div>
        ))
      ) : (
        <p className="text-center mt-6">No orders found.</p>
      )}
      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-blue-500 text-white py-2 px-4 rounded block mx-auto"
      >
        Back to Home
      </button>
    </div>
  );
};

export default OrderStatus;