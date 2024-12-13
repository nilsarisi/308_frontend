// ProductManager.jsx - Context for Product Manager
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const ProductManagerContext = createContext();

export const useProductManager = () => useContext(ProductManagerContext);

export const ProductManagerProvider = ({ children }) => {
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
            const response = await axios.put(`${backendUrl}/api/products/${productId}/price`, { price: newPrice });
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === productId ? { ...product, price: response.data.price } : product
                )
            );
        } catch (error) {
            console.error("Failed to update price:", error.message);
        }
    };

    // Function to apply discount to a product
    const applyDiscount = async (productId, discountPercentage) => {
        try {
            const response = await axios.put(`${backendUrl}/api/products/${productId}/discount`, {
                discountPercentage,
            });
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === productId
                        ? { ...product, price: response.data.price }
                        : product
                )
            );
        } catch (error) {
            console.error("Failed to apply discount:", error.message);
        }
    };

    return (
        <ProductManagerContext.Provider value={{ products, loading, setPrice, applyDiscount }}>
            {children}
        </ProductManagerContext.Provider>
    );
};
