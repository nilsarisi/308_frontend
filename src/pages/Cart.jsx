// Cart.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const {
    cart,
    viewCart,
    removeProductFromCart,
    updateProductQuantity,
    isAuthenticated,
  } = useCart();
  const navigate = useNavigate();

  // Add loading state
  const [isLoading, setIsLoading] = useState(true);

  // Load cart data when the component mounts
  useEffect(() => {
    const fetchCartData = async () => {
      setIsLoading(true);

      try {
        await viewCart();
      } catch (error) {
        console.error('Error fetching cart data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartData();
  }, []); // Empty dependency array

  const increaseQuantity = async (productId) => {
    const product = cart.find((item) =>
      isAuthenticated ? item.productId?._id === productId : item.id === productId
    );
    if (
      product &&
      product.quantity <
        (isAuthenticated ? product.productId?.stock ?? 0 : product.stock ?? 0)
    ) {
      try {
        await updateProductQuantity(productId, product.quantity + 1);
      } catch (error) {
        console.error('Failed to increase quantity:', error);
      }
    }
  };

  const decreaseQuantity = async (productId) => {
    const product = cart.find((item) =>
      isAuthenticated ? item.productId?._id === productId : item.id === productId
    );
    if (product && product.quantity > 1) {
      try {
        await updateProductQuantity(productId, product.quantity - 1);
      } catch (error) {
        console.error('Failed to decrease quantity:', error);
      }
    }
  };

  // Calculations for total items and price
  const totalItems = cart.reduce((total, item) => total + (item.quantity || 0), 0);

  const totalPrice = cart.reduce((total, item) => {
    const price = parseFloat(
      isAuthenticated ? item.productId?.price ?? 0 : item.price ?? 0
    );
    return total + price * (item.quantity || 0);
  }, 0);

  const totalPriceFormatted = totalPrice.toFixed(2);

  const handlePlaceOrder = () => {
    if (cart.length > 0) {
      if (isAuthenticated) {
        navigate('/placeorder'); // Navigate to order placement
      } else {
        alert('Please log in to place your order.');
        navigate('/login'); // Redirect unauthenticated users to login
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>

      {isLoading ? (
        // Display a loading message or spinner
        <div className="flex justify-center items-center">
          <p className="text-gray-500">Loading your cart...</p>
        </div>
      ) : cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={isAuthenticated ? item.productId?._id : item.id}
              className="flex justify-between items-center space-x-4 bg-gray-100 p-4 rounded-lg"
            >
              <div className="flex items-center">
                <img
                  src={
                    isAuthenticated
                    ? item.productId?.imageURL || item.productId?.image || '/placeholder.png'
                    : item.imageURL || item.image || '/placeholder.png'
                  }
                  alt={isAuthenticated ? item.productId?.name : item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="ml-4">
                  <p className="font-bold">
                    {isAuthenticated ? item.productId?.name : item.name}
                  </p>
                  <p>
                    ₺
                    {isAuthenticated ? item.productId?.price : item.price} x{' '}
                    {item.quantity}
                  </p>
                  <p
                    className={`mt-2 ${
                      (isAuthenticated
                        ? item.productId?.stock
                        : item.stock ?? 0) > 0
                        ? 'text-green-600'
                        : 'text-red-500'
                    }`}
                  >
                    {(isAuthenticated
                      ? item.productId?.stock
                      : item.stock ?? 0) > 0
                      ? 'In stock'
                      : 'Out of stock'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    decreaseQuantity(
                      isAuthenticated ? item.productId?._id : item.id
                    )
                  }
                  className="bg-gray-300 text-black px-2 py-1 rounded"
                  disabled={
                    item.quantity <= 1 ||
                    (isAuthenticated
                      ? item.productId?.stock ?? 0
                      : item.stock ?? 0) <= 0
                  }
                >
                  -
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button
                  onClick={() =>
                    increaseQuantity(
                      isAuthenticated ? item.productId?._id : item.id
                    )
                  }
                  className="bg-gray-300 text-black px-2 py-1 rounded"
                  disabled={
                    item.quantity >=
                    (isAuthenticated
                      ? item.productId?.stock ?? 0
                      : item.stock ?? 0)
                  }
                >
                  +
                </button>
                <button
                  onClick={() =>
                    removeProductFromCart(
                      isAuthenticated ? item.productId?._id : item.id
                    )
                  }
                  className="text-red-500 ml-4"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && cart.length > 0 && (
        <div className="bg-white shadow-md p-4 mt-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Cart Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Total Items:</span>
            <span>{totalItems}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Total Price:</span>
            <span>₺{totalPriceFormatted}</span>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={cart.length === 0}
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg ${
              cart.length === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-600'
            }`}
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;