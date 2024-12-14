// CartContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Create the CartContext
const CartContext = createContext();

// Custom hook to access CartContext
export const useCart = () => useContext(CartContext);

// CartProvider component
export const CartProvider = ({ children }) => {
  const backendUrl = 'http://localhost:5001'; // Replace with your backend API URL

  // States for cart, products, authentication, and user data
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

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
        name,
        email,
        password,
        address,
      });
      return { success: true };
    } catch (error) {
      console.error('Signup failed:', error.message);
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const guestCart = JSON.parse(localStorage.getItem('cart')) || [];
      const guestId = localStorage.getItem('guestId');

      const response = await axios.post(
        `${backendUrl}/api/users/login`,
        { email, password },
        { withCredentials: true }
      );
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

      // Merge guest cart with authenticated user's cart
      if (guestCart.length > 0) {
        // Send guest cart items to backend to merge
        await axios.post(
          `${backendUrl}/api/cart/merge`,
          { guestCart },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        // Clear guest cart from local storage
        localStorage.removeItem('cart');
      }

      // Remove guestId from local storage
      if (guestId) {
        localStorage.removeItem('guestId');
      }

      // Refresh the cart
      await viewCart();

      return { success: true, user: completeUser};
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
      setCart([]);
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
          { productId: product.id, quantity: product.quantity || 1 },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setCart(response.data.items);
      } catch (error) {
        console.error('Failed to add product to cart:', error.message);
      }
    } else {
      setCart((prevCart) => {
        const updatedCart = [...prevCart];
        const existingIndex = updatedCart.findIndex((item) => item.id === product.id);
        if (existingIndex !== -1) {
          updatedCart[existingIndex].quantity += 1;
        } else {
          updatedCart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        return updatedCart;
      });
    }
  };

  const removeProductFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        const response = await axios.delete(`${backendUrl}/api/cart/remove`, {
          data: { productId },
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setCart(response.data.items);
      } catch (error) {
        console.error('Failed to remove product from cart:', error.message);
      }
    } else {
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  };

  const updateProductQuantity = async (productId, newQuantity) => {
    console.log(
      `updateProductQuantity called with productId: ${productId}, newQuantity: ${newQuantity}`
    );
    if (isAuthenticated) {
      try {
        const response = await axios.put(
          `${backendUrl}/api/cart/update`,
          { productId, quantity: newQuantity },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setCart(response.data.items);
      } catch (error) {
        console.error('Failed to update product quantity:', error.message);
      }
    } else {
      setCart((prevCart) =>
        prevCart.map((item) => {
          if (item.id === productId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
      );
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await axios.delete(`${backendUrl}/api/cart/clear`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        await viewCart(); // Clear cart locally
      } catch (error) {
        console.error('Failed to clear cart:', error.message);
      }
    } else {
      setCart([]);
      localStorage.removeItem('cart');
    }
  };

  const viewCart = async () => {
    if (isAuthenticated) {
      try {
        console.log('Fetching cart for authenticated user...');

        const response = await axios.get(`${backendUrl}/api/cart/view`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log('Cart fetched successfully:', response.data);
        setCart(response.data.items); // Update the cart state with items
      } catch (error) {
        console.error('Failed to fetch cart:', error.message, error.response?.data);
      }
    } else {
      try {
        console.log('Fetching cart for guest user...');

        const localCart = JSON.parse(localStorage.getItem('cart'));
        if (localCart) {
          console.log('Cart loaded from local storage:', localCart);
          setCart(localCart);
        } else {
          console.log('No cart found for guest user in local storage.');
          setCart([]);
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
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
        viewCart,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};