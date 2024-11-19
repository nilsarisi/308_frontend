import React from "react";
import logo from "../assets/logo.png"; // Replace with your actual logo path
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Add logout logic here
        console.log("Logged out");
        navigate("/login");
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.logoSection}>
                <img src={logo} alt="Store Logo" style={styles.logo} />
                <h1 style={styles.title}>Admin Dashboard</h1>
            </div>
            <div style={styles.navLinks}>
                <button onClick={() => navigate("/admin/products")} style={styles.navButton}>
                    Products
                </button>
                <button onClick={() => navigate("/admin/orders")} style={styles.navButton}>
                    Orders
                </button>
                <button onClick={() => navigate("/admin/users")} style={styles.navButton}>
                    Users
                </button>
                <button onClick={handleLogout} style={styles.logoutButton}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#2c3e50",
        color: "white",
    },
    logoSection: {
        display: "flex",
        alignItems: "center",
    },
    logo: {
        width: "50px",
        height: "50px",
        marginRight: "10px",
    },
    title: {
        fontSize: "1.5em",
        fontWeight: "bold",
    },
    navLinks: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
    },
    navButton: {
        padding: "10px 15px",
        fontSize: "1em",
        cursor: "pointer",
        backgroundColor: "#34495e",
        border: "none",
        borderRadius: "5px",
        color: "white",
    },
    logoutButton: {
        padding: "10px 15px",
        fontSize: "1em",
        cursor: "pointer",
        backgroundColor: "#e74c3c",
        border: "none",
        borderRadius: "5px",
        color: "white",
    },
};

export default Navbar;
