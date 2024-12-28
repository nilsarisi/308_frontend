// SalesManager.jsx - Context for Sales Manager
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const SalesManagerContext = createContext();

export const useSalesManager = () => useContext(SalesManagerContext);
export const SalesManagerProvider = ({ children }) => {
    const backendUrl = 'http://localhost:5001'; 
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch products from backend
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${backendUrl}/api/products`);
                setProducts(response.data);
            } catch (error) {
                console.error('Failed to fetch products:', error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Function to set price for a product
    const setPrice = async (productId, newPrice) => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.put(
                `${backendUrl}/api/products/${productId}/price`,
                { price: newPrice },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            if (response && response.data && response.data.updatedProduct) {
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product._id === productId ? { ...product, ...response.data.updatedProduct } : product
                    )
                );
                alert("Price updated successfully.");
            } else {
                console.error("Invalid response from server:", response);
                alert("Failed to update price. Please try again.");
            }
        } catch (error) {
            console.error("Failed to update price:", error.message);
            alert("Error updating price. Please try again.");
        }
    };

    // Function to apply discount to a product
    const applyDiscount = async (productId, discountPercentage) => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.put(
                `${backendUrl}/api/products/${productId}/discount`,
                { discountPercentage },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            if (response && response.data && response.data.updatedProduct) {
                const updatedProduct = response.data.updatedProduct;
    
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product._id === productId ? { ...product, ...updatedProduct } : product
                    )
                );
                alert("Discount applied successfully.");
            } else {
                console.error("Invalid response format:", response);
                alert("Failed to apply discount. Invalid server response.");
            }
        } catch (error) {
            console.error("Failed to apply discount:", error.message);
            alert("Error applying discount. Please try again.");
        }
    };
    const logout = async () => {
        try {
          await axios.post(`${backendUrl}/api/users/logout`, {}, { withCredentials: true });
          setUser(null);
          setAccessToken(null);
          setIsAuthenticated(false);
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
        } catch (error) {
          console.error('Logout failed:', error.message);
        }
    };

    return (
        <SalesManagerContext.Provider value={{ products, loading, setPrice, applyDiscount, logout }}>
            {children}
        </SalesManagerContext.Provider>
    );
};