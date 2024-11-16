import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Function to clear the cart
  const clearCart = () => setCart([]);

  // Function to add a product to the cart
  const addProductToCart = (product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item.id === product.id
      );

      if (existingProductIndex !== -1) {
        // Product already in cart, update the quantity
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += product.quantity;
        return updatedCart;
      } else {
        // Product not in cart, add it
        return [...prevCart, product];
      }
    });
  };

  // Function to remove a product from the cart
  const removeProductFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  // Function to update product quantity in the cart
  const updateProductQuantity = (productId, action) => {
    setCart(
      cart.map((item) => {
        if (item.id === productId) {
          if (action === 'increase') {
            return { ...item, quantity: item.quantity + 1 };
          } else if (action === 'decrease' && item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          }
        }
        return item;
      })
    );
  };

  // Pass all functions and state to the context
  return (
    <CartContext.Provider
      value={{
        cart,
        addProductToCart,
        removeProductFromCart,
        updateProductQuantity,
        clearCart, // Add clearCart here
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
