import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";

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

    // Sync cart state with localStorage or backend
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/cart/view`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setCart(response.data.items);
            } catch (error) {
                console.error("Failed to fetch cart:", error.response?.data || error.message);
            }
        };

        if (isAuthenticated && accessToken) {
            fetchCart();
        } else {
            const storedCart = JSON.parse(localStorage.getItem('cart'));
            if (storedCart) {
                setCart(storedCart);
            }
        }
    }, [isAuthenticated, accessToken]);

    // Save cart to localStorage
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
            setUser(user);
            setAccessToken(accessToken);
            setIsAuthenticated(true);

            // Persist access token
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

            // Clear token from localStorage
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

    // Function to update product quantity in cart
    const updateProductQuantity = async (productId, action) => {
        if (isAuthenticated) {
            try {
                const response = await axios.patch(
                    `${backendUrl}/api/cart/update`,
                    { productId, action },
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );
                setCart(response.data.items);
            } catch (error) {
                console.error("Failed to update product quantity:", error.response?.data || error.message);
            }
        } else {
            setCart((prevCart) =>
                prevCart.map((item) => {
                    if (item.id === productId) {
                        if (action === 'increase' && item.quantity < item.stock) {
                            return { ...item, quantity: item.quantity + 1 };
                        } else if (action === 'decrease' && item.quantity > 1) {
                            return { ...item, quantity: item.quantity - 1 };
                        }
                    }
                    return item;
                })
            );
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
                updateProductQuantity,
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