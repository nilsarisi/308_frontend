import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Ensure you are importing jwtDecode correctly

// Create CartContext
const CartContext = createContext();

// Custom hook to access CartContext
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const backendUrl = 'http://localhost:5001';

    // States for cart, products, authentication, etc.
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);

    // Fetch products from backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/products`);
                setProducts(response.data);
            } catch (error) {
                console.error("Failed to fetch products:", error.response?.data || error.message);
            }
        };

        fetchProducts();
    }, []);

    // Sync authentication state with localStorage
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const storedAccessToken = localStorage.getItem('accessToken');

        if (storedUser && storedAccessToken) {
            setUser(storedUser);
            setAccessToken(storedAccessToken);
            setIsAuthenticated(true);
        }
    }, []);

    // Save cart to localStorage for unauthenticated users
    useEffect(() => {
        if (!isAuthenticated) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, isAuthenticated]);

    // Function to handle signup
    const signup = async (name, email, password, address) => {
        try {
            const response = await axios.post(`${backendUrl}/api/users/signup`, {
                name,
                email,
                password,
                address,
            });

            if (response.data) {
                return { success: true };
            }
        } catch (error) {
            console.error('Signup failed:', error.response?.data || error.message);
            return { success: false, error: error.response?.data || error.message };
        }
    };

    // Function to handle login
    const login = async (email, password) => {
        try {
            const response = await axios.post(`${backendUrl}/api/users/login`, {
                email,
                password,
            }, { withCredentials: true });

            const { accessToken, user } = response.data;

            // Decode the accessToken to get the user ID and other details
            const decodedToken = jwtDecode(accessToken); // Use jwtDecode to decode the token
            const userId = decodedToken.id; // Extract the ID from the token

            // Add the ID to the user object
            const completeUser = { ...user, id: userId };

            setUser(completeUser); // Save the user with the ID
            setAccessToken(accessToken);
            setIsAuthenticated(true);

            // Persist user and access token
            localStorage.setItem('user', JSON.stringify(completeUser));
            localStorage.setItem('accessToken', accessToken);

            return { success: true };
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            return { success: false, error: error.response?.data || error.message };
        }
    };

    // Function to handle logout
    const logout = async () => {
        try {
            await axios.post(`${backendUrl}/api/users/logout`, {}, { withCredentials: true });
            setUser(null);
            setAccessToken(null);
            setIsAuthenticated(false);

            // Clear data from localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
        } catch (error) {
            console.error("Logout failed:", error.response?.data || error.message);
        }
    };

    // Function to add product to cart
    const addProductToCart = async (product) => {
        if (product.stock <= 0) {
            alert("Sorry, this product is out of stock.");
            return;
        }

        if (isAuthenticated) {
            try {
                const response = await axios.post(
                    `${backendUrl}/api/cart/add`,
                    { productId: product.id, quantity: product.quantity || 1 },
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );
                setCart(response.data.items);
                alert(`${product.name} added to cart!`);
            } catch (error) {
                console.error("Failed to add product to cart:", error.response?.data || error.message);
            }
        } else {
            setCart((prevCart) => {
                const updatedCart = [...prevCart];
                const existingProductIndex = updatedCart.findIndex((item) => item.id === product.id);

                if (existingProductIndex !== -1) {
                    updatedCart[existingProductIndex].quantity += product.quantity || 1;
                } else {
                    updatedCart.push({ ...product, quantity: product.quantity || 1 });
                }

                return updatedCart;
            });
        }
    };

    // Function to remove product from cart
    const removeProductFromCart = async (productId) => {
        if (isAuthenticated) {
            try {
                const response = await axios.delete(
                    `${backendUrl}/api/cart/remove/${productId}`,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );
                setCart(response.data.items);
            } catch (error) {
                console.error("Failed to remove product from cart:", error.response?.data || error.message);
            }
        } else {
            setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
        }
    };

    // Function to clear cart
    const clearCart = async () => {
        if (isAuthenticated) {
            try {
                await axios.delete(`${backendUrl}/api/cart/clear`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setCart([]);
            } catch (error) {
                console.error("Failed to clear cart:", error.response?.data || error.message);
            }
        } else {
            setCart([]);
        }
    };

    // Provide context values
    return (
        <CartContext.Provider
            value={{
                cart,
                products,
                isAuthenticated,
                user,
                accessToken,
                addProductToCart,
                removeProductFromCart,
                clearCart,
                login,
                logout,
                signup,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};