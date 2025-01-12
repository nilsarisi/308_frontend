import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const backendUrl = "http://localhost:5001";

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    lowStockProducts: [],
    totalCategories: 0,
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
    fetchDashboardData();
    fetchOrderSummary();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const productsRes = await axios.get(`${backendUrl}/api/products`);
      const products = Array.isArray(productsRes.data) ? productsRes.data : [];
      const totalProducts = products.length;
      const lowStockProducts = products.filter((p) => p.stock < 5);
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

      if (Array.isArray(response.data)) {
        const orders = response.data;
        const totalOrders = orders.length;
        const deliveredCount = orders.filter(
          (o) => o.status === "delivered"
        ).length;
        const inTransitCount = orders.filter(
          (o) => o.status === "in-transit"
        ).length;
        const processingCount = orders.filter(
          (o) => o.status === "processing"
        ).length;
        const refundedCount = orders.filter(
          (o) => o.status === "refunded"
        ).length;
        const canceledCount = orders.filter(
          (o) => o.status === "canceled"
        ).length;

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
      console.error(
        "Error fetching order summary:",
        err.response?.data || err.message
      );
      setError("Failed to fetch order summary.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // -- Styles --
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

  const buttonGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1rem",
    width: "100%",
  };

  // Base button style generator:
  const buttonStyle = (bgColor, hoverColor) => ({
    display: "block",
    padding: "1rem",
    textAlign: "center",
    backgroundColor: bgColor,
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#fff",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease",
    cursor: "pointer",
  });

  return (
    <div style={containerStyle}>
      {/* Welcome Message */}
      <div style={welcomeStyle}>
        <h1 style={titleStyle}>Product Manager Home</h1>
        <p style={subtitleStyle}>
          Welcome to your main dashboard! Manage your products and monitor orders
          efficiently.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div style={buttonGridStyle}>
        {/* Manage Products (light blue) */}
        <Link
          to="/products"
          style={buttonStyle("#6caedf", "#5b91d9")}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5b91d9")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#6caedf")}
        >
          Manage Products
        </Link>

        {/* View Orders */}
        <Link
          to="/orders"
          style={buttonStyle("#1abc9c", "#16a085")}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#16a085")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1abc9c")}
        >
          View Orders
        </Link>

        {/* Manage Invoices */}
        <Link
          to="/invoice"
          style={buttonStyle("#f1c40f", "#f39c12")}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f39c12")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f1c40f")}
        >
          Manage Invoices
        </Link>

        {/* Comment Moderation */}
        <Link
          to="/comment-moderation"
          style={buttonStyle("#ffb6c1", "#ffaeb9")}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ffaeb9")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffb6c1")}
        >
          Comment Moderation
        </Link>

        {/* Delivery List */}
        <Link
          to="/delivery-list"
          style={buttonStyle("#9b59b6", "#8e44ad")}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#8e44ad")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#9b59b6")}
        >
          Delivery List
        </Link>

        {/* Category & Stock Management */}
        <Link
          to="/category-management"
          style={buttonStyle("#7f8c8d", "#707b7c")}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#707b7c")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#7f8c8d")}
        >
          Category & Stock Management
        </Link>
      </div>

      {/* Product Summary Card */}
      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>Product Summary</h2>
        <p>Total Products: {dashboardData.totalProducts}</p>
        <p>Total Categories: {dashboardData.totalCategories}</p>

        <h4>Low Stock Products (less than 5):</h4>
        {dashboardData.lowStockProducts.length > 0 ? (
          <ul>
            {dashboardData.lowStockProducts.map((prod) => (
              <li key={prod._id} style={listItemStyle}>
                {prod.imageURL && (
                  <img src={prod.imageURL} alt={prod.name} style={imgStyle} />
                )}
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
