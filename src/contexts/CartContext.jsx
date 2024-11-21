import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";

// Create CartContext to manage both cart, products, and authentication states
const CartContext = createContext();

// Custom hook to easily access CartContext values in components
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const backendUrl = 'http://localhost:5001';
  console.log('Backend URL:', backendUrl);

  // Cart and product states
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Tofu',
      price: 149.9,
      image: '/assets/tofu.png',
      category: 'food',
      stock: 10,
    },
    {
      id: 2,
      name: 'Everfresh Tofu',
      price: 699.9,
      image: '/assets/everfreshTofu.png',
      category: 'food',
      stock: 0,
    },
    {
      id: 3,
      name: 'Natural Soap',
      price: 89.9,
      image: '/assets/soap.png',
      category: 'cosmetics',
      stock: 5,
    },
  ]);

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // Sync cart state with localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart'));
    if (storedCart) {
      setCart(storedCart);
    }

    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setAccessToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

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

  // Function to clear all items from the cart
  const clearCart = () => setCart([]);

  // Function to add a product to the cart
  const addProductToCart = (product) => {
    if (product.stock <= 0) {
      alert("Sorry, this product is out of stock.");
      return;
    }

    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const existingProductIndex = updatedCart.findIndex(
        (item) => item.id === product.id
      );

      if (existingProductIndex !== -1) {
        updatedCart[existingProductIndex].quantity += product.quantity;
      } else {
        updatedCart.push({ ...product, quantity: product.quantity || 1 });
      }

      const updatedProducts = products.map((p) =>
        p.id === product.id ? { ...p, stock: p.stock - product.quantity } : p
      );
      setProducts(updatedProducts);

      return updatedCart;
    });
  };

  // Function to remove a product from the cart
  const removeProductFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  // Function to update the quantity of a product in the cart
  const updateProductQuantity = (productId, action) => {
    setCart(
      cart.map((item) => {
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