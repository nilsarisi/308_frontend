import React, { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = "http://localhost:5001";

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    lowStockProducts: [],
    totalCategories: 0, // Kategori sayısını da tutuyoruz
  });
  const [orderSummary, setOrderSummary] = useState({
    totalOrders: 0,
    deliveredCount: 0,
    inTransitCount: 0,
    processingCount: 0,
    refundedCount: 0,
    canceledCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData(); // Fetch product summary
    fetchOrderSummary();  // Fetch order summary
  }, []);

  const fetchDashboardData = async () => {
    try {
      const productsRes = await axios.get(`${backendUrl}/api/products`);
      const products = Array.isArray(productsRes.data) ? productsRes.data : [];

      const totalProducts = products.length;
      const lowStockProducts = products.filter((p) => p.stock < 5);

      // Kategorileri hesaplayıp sayıyoruz (new Set)
      const distinctCategories = [...new Set(products.map((p) => p.category))];
      const totalCategories = distinctCategories.length;

      setDashboardData({
        totalProducts,
        lowStockProducts,
        totalCategories,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error while fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const fetchOrderSummary = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(`${backendUrl}/api/orders/admin/all`, {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      console.log("Fetched orders:", response.data);

      if (Array.isArray(response.data)) {
        const orders = response.data;
        const totalOrders = orders.length;
        const deliveredCount = orders.filter((o) => o.status === "delivered").length;
        const inTransitCount = orders.filter((o) => o.status === "in-transit").length;
        const processingCount = orders.filter((o) => o.status === "processing").length;
        const refundedCount = orders.filter((o) => o.status === "refunded").length;
        const canceledCount = orders.filter((o) => o.status === "canceled").length;

        setOrderSummary({
          totalOrders,
          deliveredCount,
          inTransitCount,
          processingCount,
          refundedCount,
          canceledCount,
        });
      } else {
        throw new Error("API did not return an array.");
      }
    } catch (err) {
      console.error("Error fetching order summary:", err.response?.data || err.message);
      setError("Failed to fetch order summary.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // *** STYLES ***
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2rem",
    margin: "2rem auto",
    maxWidth: "800px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const welcomeStyle = {
    textAlign: "center",
    marginBottom: "1rem",
  };

  const titleStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "0.5rem",
  };

  const subtitleStyle = {
    fontSize: "1.25rem",
    color: "#7f8c8d",
  };

  const cardStyle = {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "1.5rem",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  };

  const cardTitleStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "1rem",
  };

  const listItemStyle = {
    marginBottom: "0.8rem",
    display: "flex",
    alignItems: "center",
  };

  const imgStyle = {
    width: "50px",
    height: "50px",
    objectFit: "cover",
    marginRight: "0.8rem",
    borderRadius: "4px",
  };

  return (
    <div style={containerStyle}>
      {/* Welcome Message */}
      <div style={welcomeStyle}>
        <h1 style={titleStyle}>Product Manager Home</h1>
        <p style={subtitleStyle}>
          Welcome to your main dashboard! Manage your products and monitor orders efficiently.
        </p>
      </div>

      {/* Product Summary Card */}
      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>Product Summary</h2>
        <p>Total Products: {dashboardData.totalProducts}</p>
        <p>Total Categories: {dashboardData.totalCategories}</p>

        <h4 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
          Low Stock Products (less than 5):
        </h4>
        {dashboardData.lowStockProducts.length > 0 ? (
          <ul style={{ paddingLeft: "1.2rem" }}>
            {dashboardData.lowStockProducts.map((prod) => (
              <li key={prod._id} style={listItemStyle}>
                {/* Resim varsa gösteriyoruz */}
                {prod.imageURL && (
                  <img
                    src={prod.imageURL}
                    alt={prod.name}
                    style={imgStyle}
                  />
                )}

                {/* Ürün adı, kategori ve stok bilgisi */}
                <div>
                  <strong>{prod.name}</strong>
                  {prod.category && (
                    <span style={{ marginLeft: "8px", color: "#777" }}>
                      (Category: {prod.category})
                    </span>
                  )}
                  {" - Stock: "}
                  {prod.stock}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>All products have sufficient stock.</p>
        )}
      </div>

      {/* Order Summary Card */}
      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>Order Summary</h2>
        <p>Total Orders: {orderSummary.totalOrders}</p>
        <p>Delivered: {orderSummary.deliveredCount}</p>
        <p>In Transit: {orderSummary.inTransitCount}</p>
        <p>Processing: {orderSummary.processingCount}</p>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default AdminDashboard;
