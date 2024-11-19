import React from "react";
import { NavLink } from "react-router-dom";
import add_icon from "../assets/add_icon.png"; // Replace with the correct path to your icons
import products_icon from "../assets/products_icon.png";
import orders_icon from "../assets/orders_icon.png";
import users_icon from "../assets/users_icon.png";
import settings_icon from "../assets/settings_icon.png";

const Sidebar = () => {
    return (
        <div style={styles.sidebar}>
            <div style={styles.logoSection}>
                <h2 style={styles.logoText}>Admin</h2>
            </div>
            <nav style={styles.nav}>
                <NavLink to="/admin/add" style={styles.navLink} activeStyle={styles.activeNavLink}>
                    <img src={add_icon} alt="Add" style={styles.icon} />
                    <span>Add Product</span>
                </NavLink>
                <NavLink to="/admin/products" style={styles.navLink} activeStyle={styles.activeNavLink}>
                    <img src={products_icon} alt="Products" style={styles.icon} />
                    <span>Products</span>
                </NavLink>
                <NavLink to="/admin/orders" style={styles.navLink} activeStyle={styles.activeNavLink}>
                    <img src={orders_icon} alt="Orders" style={styles.icon} />
                    <span>Orders</span>
                </NavLink>
                <NavLink to="/admin/users" style={styles.navLink} activeStyle={styles.activeNavLink}>
                    <img src={users_icon} alt="Users" style={styles.icon} />
                    <span>Users</span>
                </NavLink>
                <NavLink to="/admin/settings" style={styles.navLink} activeStyle={styles.activeNavLink}>
                    <img src={settings_icon} alt="Settings" style={styles.icon} />
                    <span>Settings</span>
                </NavLink>
            </nav>
        </div>
    );
};

const styles = {
    sidebar: {
        width: "250px",
        height: "100vh",
        backgroundColor: "#34495e",
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
    },
    logoSection: {
        textAlign: "center",
        marginBottom: "20px",
    },
    logoText: {
        fontSize: "1.5em",
        fontWeight: "bold",
    },
    nav: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    navLink: {
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 15px",
        borderRadius: "5px",
        color: "white",
        fontSize: "1em",
    },
    activeNavLink: {
        backgroundColor: "#2c3e50",
    },
    icon: {
        width: "20px",
        height: "20px",
    },
};

export default Sidebar;
