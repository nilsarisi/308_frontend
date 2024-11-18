import React, { createContext, useContext, useState } from 'react';

// Create CartContext to manage cart and product states globally
const CartContext = createContext();

// Custom hook to easily access CartContext values in components
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);  // Initialize cart as an empty array
  const [products, setProducts] = useState([  // Sample product data with stock info
    {
      id: 1,
      name: 'Tofu',
      price: 149.9,
      image: '/assets/tofu.png',
      category: 'food',
      stock: 10, // Stock info for this product
    },
    {
      id: 2,
      name: 'Everfresh Tofu',
      price: 699.9,
      image: '/assets/everfreshTofu.png',
      category: 'food',
      stock: 0, // Out of stock
    },
    {
      id: 3,
      name: 'Natural Soap',
      price: 89.9,
      image: '/assets/soap.png',
      category: 'cosmetics',
      stock: 5, // Stock info
    },
    // More products can be added here
  ]);

  // Function to update the stock of a product (optional for now)
  const updateProductStock = (id, newStock) => {
    setProducts((prevState) =>
      prevState.map((product) =>
        product.id === id ? { ...product, stock: newStock } : product
      )
    );
  };

  // Function to clear all items from the cart
  const clearCart = () => setCart([]);

  // Function to add a product to the cart
  const addProductToCart = (product) => {
    // Check if the product is out of stock
    if (product.stock <= 0) {
      alert('Sorry, this product is out of stock!');
      return; // Prevent adding out-of-stock products to the cart
    }

    setCart((prevCart) => {
      // Check if the product already exists in the cart
      const existingProductIndex = prevCart.findIndex(
        (item) => item.id === product.id
      );

      if (existingProductIndex !== -1) {
        // If product is already in the cart, update the quantity
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += product.quantity;
        return updatedCart;
      } else {
        // If product is not in the cart, add it as a new product
        return [...prevCart, product];
      }
    });
  };

  // Function to remove a product from the cart
  const removeProductFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  // Function to update the quantity of a product in the cart (increase or decrease)
  const updateProductQuantity = (productId, action) => {
    setCart(
      cart.map((item) => {
        if (item.id === productId) {
          // Increase quantity
          if (action === 'increase') {
            return { ...item, quantity: item.quantity + 1 };
          } 
          // Decrease quantity (but not below 1)
          else if (action === 'decrease' && item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          }
        }
        return item; // Return other items unchanged
      })
    );
  };

  // Provide the context values (cart, products, and functions) to the components
  return (
    <CartContext.Provider
      value={{
        cart,
        products, // Share products and stock info globally
        addProductToCart,
        removeProductFromCart,
        updateProductQuantity,
        clearCart, // Provide clearCart function
        updateProductStock, // Provide stock update function
      }}
    >
      {children}
    </CartContext.Provider>
  );
};