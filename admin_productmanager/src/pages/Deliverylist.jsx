import React, { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = "http://localhost:5001";

const DeliveryList = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/orders/delivery-list`);
        if (Array.isArray(response.data)) {
          setDeliveries(response.data);
        } else {
          throw new Error("API did not return an array.");
        }
      } catch (error) {
        console.error("Error fetching deliveries:", error.message);
        setError("Failed to fetch deliveries.");
      }
    };

    fetchDeliveries();
  }, []);

  return (
    <div style={{ padding: "10px", overflowX: "auto" }}>
      <h1 style={{ fontSize: "1.4rem", fontWeight: "bold", marginBottom: "15px" }}>Delivery List</h1>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Delivery ID</th>
            <th style={tableHeaderStyle}>Customer ID</th>
            <th style={tableHeaderStyle}>Customer Name</th>
            <th style={tableHeaderStyle}>Product ID</th>
            <th style={tableHeaderStyle}>Product Name</th>
            <th style={tableHeaderStyle}>Quantity</th>
            <th style={tableHeaderStyle}>Total Price</th>
            <th style={tableHeaderStyle}>Delivery Address</th>
            <th style={tableHeaderStyle}>Completed</th>
            <th style={tableHeaderStyle}>Refund</th> {/* Yeni Refund Sütunu */}
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery) =>
            delivery.products.map((product, index) => (
              <tr key={`${delivery.deliveryId}-${index}`}>
                {index === 0 && (
                  <>
                    <td style={tableCellStyle} rowSpan={delivery.products.length}>
                      {delivery.deliveryId}
                    </td>
                    <td style={tableCellStyle} rowSpan={delivery.products.length}>
                      {delivery.customerId}
                    </td>
                    <td style={tableCellStyle} rowSpan={delivery.products.length}>
                      {delivery.customerName}
                    </td>
                  </>
                )}
                <td style={tableCellStyle}>{product.productId}</td>
                <td style={tableCellStyle}>{product.productName}</td>
                <td style={tableCellStyle}>{product.quantity} pcs</td>
                {index === 0 && (
                  <>
                    <td style={tableCellStyle} rowSpan={delivery.products.length}>
                      ${delivery.totalPrice}
                    </td>
                    <td style={tableCellStyle} rowSpan={delivery.products.length}>
                      {delivery.deliveryAddress}
                    </td>
                    <td style={tableCellStyle} rowSpan={delivery.products.length}>
                      {delivery.isCompleted ? "Yes" : "No"}
                    </td>
                  </>
                )}
                <td style={tableCellStyle}>-</td> {/* Refund Kolonu için Statik Veri */}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const tableHeaderStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  backgroundColor: "#f2f2f2",
  textAlign: "center",
  fontWeight: "bold",
};

const tableCellStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center",
};

export default DeliveryList;
