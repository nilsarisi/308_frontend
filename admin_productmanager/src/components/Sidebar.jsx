import React from "react";
import { NavLink } from "react-router-dom";
import products_icon from "../assets/products_icon.png"; 
import invoice_icon from "../assets/settings_icon.png"; 
import orders_icon from "../assets/orders_icon.png";
import comments_icon from "../assets/comments_icon.png";
import delivery_icon from "../assets/delivery_icon.png";



const Sidebar = () => {
    return (
        <div style={styles.sidebar}>
            <nav style={styles.nav}>
                <NavLink to="/products" style={styles.navLink} activeStyle={styles.activeNavLink}>
                    <img src={products_icon} alt="Products" style={styles.icon} />
                    <span>Products</span>
                </NavLink>
                <NavLink to="/invoice" style={styles.navLink} activeStyle={styles.activeNavLink}>
                    <img src={invoice_icon} alt="Invoice" style={styles.icon} />
                    <span>Invoice</span>
                </NavLink>
                <NavLink to="/orders" style={styles.navLink} activeStyle={styles.activeNavLink}>
                    <img src={orders_icon} alt="Orders" style={styles.icon} />
                    <span>Orders</span>
                </NavLink>
                <NavLink to="/pending-comments" style={styles.navLink} activeStyle={styles.activeNavLink}>
                    <img src={comments_icon} alt="Comments" style={styles.icon} />
                    <span>Pending Comments</span>
                </NavLink>
                <NavLink to="/delivery-list" style={styles.navLink} activeStyle={styles.activeNavLink}>
                    <img src={delivery_icon} alt="Delivery List" style={styles.icon} />
                    <span>Delivery List</span>
                </NavLink>
                <NavLink to="/category-management" style={styles.navLink} activeStyle={styles.activeNavLink}>
                    <img src={products_icon} alt="Products" style={styles.icon} />
                    <span>Category & Stock</span>
                </NavLink>

            </nav>
        </div>
    );
};

const styles = {
    sidebar: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: "250px",
        backgroundColor: "#34495e",
        color: "white",
        padding: "20px",
        zIndex: 1000,
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