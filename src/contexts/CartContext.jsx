import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Make sure this is jwt-decode and not { jwtDecode }

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const backendUrl = 'http://localhost:5001'; 

  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [favorites, setFavorites] = useState([]);

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

  // Save cart and favorites to localStorage for unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(cart));
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [cart, favorites, isAuthenticated]);

  // Load favorites from localStorage if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      const storedFavorites = JSON.parse(localStorage.getItem('favorites'));
      if (storedFavorites) {
        setFavorites(storedFavorites);
      }
    } else {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    try {
      if (isAuthenticated) {
        const response = await axios.get(`${backendUrl}/api/wishlist`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setFavorites(response.data.wishlist || []);
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error.message);
    }
  };

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
  
      const response = await axios.post(`${backendUrl}/api/users/login`, { email, password }, { withCredentials: true });
      const { accessToken, user } = response.data;
  
      // If user is a sales manager, do not log them into the main site
      if (user.role === 'sales_manager') {
        return { success: true, user };
      }
      if (user.role === 'product_manager') {
        return { success: true, user };
      }
  
      // Otherwise, proceed as normal
      const decodedToken = jwtDecode(accessToken);
      const completeUser = { ...user, id: decodedToken.id };
  
      setUser(completeUser);
      setAccessToken(accessToken);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(completeUser));
      localStorage.setItem('accessToken', accessToken);
  
      // Merge guest cart
      if (guestCart.length > 0) {
        await axios.post(`${backendUrl}/api/cart/merge`, { guestCart }, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        localStorage.removeItem('cart');
      }
  
      if (guestId) {
        localStorage.removeItem('guestId');
      }
  
      await viewCart();
      fetchFavorites();
  
      return { success: true, user: completeUser };
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
      setFavorites([]);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('favorites');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  // Cart Management
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
        const response = await axios.get(`${backendUrl}/api/cart/view`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setCart(response.data.items); 
      } catch (error) {
        console.error('Failed to fetch cart:', error.message, error.response?.data);
      }
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart'));
      if (localCart) {
        setCart(localCart);
      } else {
        setCart([]);
      }
    }
  };

  // Favorites Management Functions
  const addToFavorites = async (product) => {
    if (isAuthenticated) {
      try {
        await axios.post(
          `${backendUrl}/api/wishlist/add`,
          { productId: product.id },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        fetchFavorites(); // Refresh favorites
      } catch (error) {
        console.error('Failed to add to favorites:', error.message);
      }
    } else {
      setFavorites((prev) => {
        const updated = [...prev];
        if (!updated.find((item) => item.id === product.id)) {
          updated.push(product);
        }
        localStorage.setItem('favorites', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const removeFromFavorites = async (productId) => {
    if (isAuthenticated) {
      try {
        await axios.delete(`${backendUrl}/api/wishlist/remove`, {
          data: { productId },
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        fetchFavorites(); // Refresh favorites
      } catch (error) {
        console.error('Failed to remove from favorites:', error.message);
      }
    } else {
      setFavorites((prev) => {
        const updated = prev.filter((item) => item.id !== productId);
        localStorage.setItem('favorites', JSON.stringify(updated));
        return updated;
      });
    }
  };


  return (
    <CartContext.Provider
      value={{
        cart,
        products,
        isAuthenticated,
        user,
        favorites, // Provide favorites
        addProductToCart,
        removeProductFromCart,
        updateProductQuantity,
        clearCart,
        viewCart,
        login,
        logout,
        signup,
        addToFavorites,   // Provide addToFavorites
        removeFromFavorites // Provide removeFromFavorites
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
