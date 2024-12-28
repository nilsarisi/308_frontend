import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = "http://localhost:5001";

const OrderStatus = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [refundRequest, setRefundRequest] = useState(null);
  const [cancelRequest, setCancelRequest] = useState(null);

  const fetchAllOrders = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("Authentication token is missing.");

      const response = await axios.get(`${backendUrl}/api/orders/all`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const fetchedOrders = response.data.map((order) => ({
        ...order,
        products: (order.products || []).map((product) => ({
          ...product,
          refundStatus: product.refundStatus || null,
        })),
      }));

      setOrders(fetchedOrders);
    } catch (err) {
      console.error("Failed to fetch order details:", err.message);
      setError("Unable to fetch order details. Please try again later.");
    }
  };
  const isOrderFullyRefunded = (order) => {
    return order.products.every((product) => product.refundStatus === "approved");
  };
  const requestRefund = async (orderId, productId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Authentication token is missing.");
        return;
      }

      await axios.post(
        `${backendUrl}/api/orders/${orderId}/refund`,
        { productId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      alert("Refund request submitted successfully.");
      fetchAllOrders();
    } catch (err) {
      console.error("Failed to request refund:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Unable to request a refund. Please try again.");
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Authentication token is missing.");
        return;
      }

      await axios.post(
        `${backendUrl}/api/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      alert("Order canceled successfully.");
      fetchAllOrders();
    } catch (err) {
      console.error("Failed to cancel order:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Unable to cancel order. Please try again.");
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
              <strong>Status:</strong>{" "}
              {isOrderFullyRefunded(order) ? "Refunded" : order.status === "delivered" ? "Delivered" : order.status}
            </p>
            <p className="mt-2">
              <strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="mt-2">
              <strong>Estimated Delivery:</strong> {order.estimatedDelivery || "N/A"}
            </p>
            <h3 className="text-xl font-bold mt-6">Order Summary</h3>
            {order.products.map((item, index) => (
              <div key={index} className="mt-2">
                <p>
                  {item.name} x {item.quantity} - ₺{(item.priceAtPurchase * item.quantity).toFixed(2)}
                </p>
                
                {order.status !== "delivered" || order.status === "canceled" ? null : item.refundStatus ? (
                  <p className="text-blue-500 mt-1">
                    Refund Status:{" "}
                    {item.refundStatus === "pending"
                      ? "Refund Request Pending"
                      : item.refundStatus.charAt(0).toUpperCase() + item.refundStatus.slice(1)}
                  </p>
                ) : (
                  <button
                    className="mt-2 bg-red-500 text-white py-1 px-2 rounded"
                    onClick={() => setRefundRequest({ orderId: order.orderId, productId: item.productId })}
                  >
                    Request Refund
                  </button>
                )}
              </div>
            ))}
            {order.status === "processing" && (
              <button
                className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded"
                onClick={() => setCancelRequest(order.orderId)}
              >
                Cancel Order
              </button>
            )}
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

      {/* Refund Confirmation Modal */}
      {refundRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold">Confirm Refund Request</h2>
            <p className="mt-4">
              Are you sure you want to request a refund for this product? This action is final
              and subject to store policies.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setRefundRequest(null)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  requestRefund(refundRequest.orderId, refundRequest.productId);
                  setRefundRequest(null);
                }}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {cancelRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold">Confirm Cancel Order</h2>
            <p className="mt-4">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setCancelRequest(null)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded mr-2"
              >
                No, Keep It
              </button>
              <button
                onClick={() => {
                  cancelOrder(cancelRequest);
                  setCancelRequest(null);
                }}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStatus;