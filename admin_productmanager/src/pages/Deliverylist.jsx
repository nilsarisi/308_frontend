import React, { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = "http://localhost:5001";

const DeliveryList = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [error, setError] = useState("");

  const fetchDeliveries = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(`${backendUrl}/api/orders/delivery-list`, {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      if (Array.isArray(response.data)) {
        setDeliveries(response.data);
      } else {
        throw new Error("API did not return an array.");
      }
    } catch (err) {
      console.error("Error fetching deliveries:", err.response?.data || err.message);
      setError("Failed to fetch deliveries.");
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Delivery List</h1>
      {error && <p className="text-red-600 text-center">{error}</p>}
      <table
        className="
          table-fixed   
          w-full 
          border-collapse 
          border border-gray-200
          text-sm md:text-base
        "
      >
        <thead className="bg-gray-100">
          <tr>
            <th className="w-40 border border-gray-200 px-2 py-2 break-words">Delivery ID</th>
            <th className="w-40 border border-gray-200 px-2 py-2 break-words">Customer ID</th>
            {/* (1) Customer Name sütunu kaldırıldı */}
            <th className="w-40 border border-gray-200 px-2 py-2 break-words">Product ID</th>
            {/* (2) Product Name sütunu kaldırıldı */}
            <th className="w-20 border border-gray-200 px-2 py-2 break-words">Quantity</th>
            <th className="w-24 border border-gray-200 px-2 py-2 break-words">Total Price</th>
            <th className="w-48 border border-gray-200 px-2 py-2 break-words">Delivery Address</th>
            <th className="w-24 border border-gray-200 px-2 py-2 break-words">Completed</th>
            <th className="w-24 border border-gray-200 px-2 py-2 break-words">Refund Status</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery) => {
            const allRefunded = delivery.products.every(
              (product) => product.refundStatus === "approved"
            );

            return delivery.products.map((product, index) => (
              <tr key={`${delivery.deliveryId}-${index}`}>
                {index === 0 && (
                  <>
                    <td
                      className="border border-gray-200 px-2 py-2 break-words align-top"
                      rowSpan={delivery.products.length}
                    >
                      {delivery.deliveryId}
                    </td>
                    <td
                      className="border border-gray-200 px-2 py-2 break-words align-top"
                      rowSpan={delivery.products.length}
                    >
                      {delivery.customerId}
                    </td>
                    {/* (1) Customer Name hücresi kaldırıldı */}
                  </>
                )}
                <td className="border border-gray-200 px-2 py-2 break-words align-top">
                  {product.productId}
                </td>
                {/* (2) Product Name hücresi kaldırıldı */}
                <td className="border border-gray-200 px-2 py-2 break-words align-top">
                  {product.quantity} pcs
                </td>
                {index === 0 && (
                  <>
                    <td
                      className="border border-gray-200 px-2 py-2 break-words align-top"
                      rowSpan={delivery.products.length}
                    >
                      ${delivery.totalPrice}
                    </td>
                    <td
                      className="border border-gray-200 px-2 py-2 break-words align-top"
                      rowSpan={delivery.products.length}
                    >
                      {delivery.deliveryAddress}
                    </td>
                    <td
                      className="border border-gray-200 px-2 py-2 break-words align-top"
                      rowSpan={delivery.products.length}
                    >
                      {allRefunded
                        ? "Refund"
                        : delivery.status === "delivered"
                        ? "Yes"
                        : delivery.status === "in-transit"
                        ? "No"
                        : "Pending"}
                    </td>
                  </>
                )}
                <td className="border border-gray-200 px-2 py-2 break-words align-top">
                  {product.refundStatus}
                </td>
              </tr>
            ));
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryList;
