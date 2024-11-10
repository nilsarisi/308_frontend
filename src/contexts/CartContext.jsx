import React, { createContext, useState, useContext } from 'react';

// Cart Context
const CartContext = createContext();

// Cart Provider
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addProductToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeProductFromCart = (productID) => {
    setCart(cart.filter((item) => item.id !== productID));
  };

  const updateProductQuantity = (productID, action) => {
    setCart(cart.map((item) => 
      item.id === productID 
        ? {
            ...item,
            quantity: action === 'increase' 
              ? item.quantity + 1 
              : Math.max(item.quantity - 1, 1) // 1'den az olmasına izin verilmiyor
          } 
        : item
    ));
  };

  return (
    <CartContext.Provider value={{ cart, addProductToCart, removeProductFromCart, updateProductQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the Cart context
export const useCart = () => {
  return useContext(CartContext);
};
