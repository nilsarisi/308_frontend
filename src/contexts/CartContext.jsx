import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Create the CartContext
const CartContext = createContext();

// Custom hook to access CartContext
export const useCart = () => useContext(CartContext);

// Updated CartProvider component
export const CartProvider = ({ children }) => {
    const backendUrl = 'http://localhost:5001'; // Backend API URL

    // States for cart, products, authentication, and user data
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
                console.error('Failed to fetch products:', error.message);
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

    // Authentication Functions
    const signup = async (name, email, password, address) => {
        try {
            await axios.post(`${backendUrl}/api/users/signup`, {
                name, email, password, address,
            });
            return { success: true };
        } catch (error) {
            console.error('Signup failed:', error.message);
            return { success: false, error: error.message };
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${backendUrl}/api/users/login`, { email, password }, { withCredentials: true });
            const { accessToken, user } = response.data;

            // Decode token and add user ID
            const decodedToken = jwtDecode(accessToken);
            const completeUser = { ...user, id: decodedToken.id };

            // Save data
            setUser(completeUser);
            setAccessToken(accessToken);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(completeUser));
            localStorage.setItem('accessToken', accessToken);

            return { success: true };
        } catch (error) {
            console.error('Login failed:', error.message);
            return { success: false, error: error.message };
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

    // Cart Management Functions
    const addProductToCart = async (product) => {
        if (product.stock <= 0) {
            alert('This product is out of stock.');
            return;
        }

        if (isAuthenticated) {
            try {
                const response = await axios.post(
                    `${backendUrl}/api/cart/add`,
                    { productId: product.id, quantity: product.quantity },
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );
                setCart(response.data.items);
            } catch (error) {
                console.error('Failed to add product to cart:', error.message);
            }
        } else {
            setCart((prevCart) => {
                const updatedCart = [...prevCart];
                const existingIndex = updatedCart.findIndex(item => item.id === product.id);
                if (existingIndex !== -1) {
                    updatedCart[existingIndex].quantity += 1;
                } else {
                    updatedCart.push({ ...product, quantity: 1 });
                }
                return updatedCart;
            });
        }
    };

    const removeProductFromCart = async (productId) => {
        if (isAuthenticated) {
            try {
                const response = await axios.delete(
                    `${backendUrl}/api/cart/remove`,
                    {
                        data: { productId },
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                );
                setCart(response.data.items);
            } catch (error) {
                console.error('Failed to remove product from cart:', error.message);
            }
        } else {
            setCart(prevCart => prevCart.filter(item => item.id !== productId));
        }
    };

    const updateProductQuantity = async (productId, action) => {
        if (isAuthenticated) {
            try {
                const response = await axios.put(
                    `${backendUrl}/api/cart/update`,
                    { productId, action },
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );
                setCart(response.data.items);
            } catch (error) {
                console.error('Failed to update product quantity:', error.message);
            }
        } else {
            setCart((prevCart) =>
                prevCart.map(item => {
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

    const clearCart = async () => {
        if (isAuthenticated) {
            try {
                await axios.delete(`${backendUrl}/api/cart/clear`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setCart([]);
            } catch (error) {
                console.error('Failed to clear cart:', error.message);
            }
        } else {
            setCart([]);
        }
    };
    const viewCart = async () => {
        if (isAuthenticated) {
            try {
                console.log("Fetching cart for authenticated user...");
                const response = await axios.get(`${backendUrl}/api/cart/view`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                console.log("Cart fetched successfully:", response.data);
                setCart(response.data.items); // Update the cart state with items
            } catch (error) {
                console.error("Failed to fetch cart:", error.message, error.response?.data);
            }
        } else {
            console.log("Fetching cart for guest user...");
            const localCart = JSON.parse(localStorage.getItem('cart'));
            if (localCart) {
                console.log("Cart loaded from local storage:", localCart);
                setCart(localCart);
            } else {
                console.log("No cart found for guest user in local storage.");
                setCart([]);
            }
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
                addProductToCart,
                removeProductFromCart,
                updateProductQuantity,
                clearCart,
                viewCart,//this is added and you're going to implement viewCart
                login,
                logout,
                signup,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};