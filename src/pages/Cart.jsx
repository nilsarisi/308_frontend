import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { cart, removeProductFromCart, updateProductQuantity } = useCart();
  const navigate = useNavigate();

  const decreaseQuantity = (productID) => {
    updateProductQuantity(productID, 'decrease');
  };

  const increaseQuantity = (productID) => {
    updateProductQuantity(productID, 'increase');
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  ).toFixed(2);

  const handlePlaceOrder = () => {
    if (cart.length > 0) {
      navigate('/placeorder'); // Navigate to the order placement page
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center space-x-4 bg-gray-100 p-4 rounded-lg"
            >
              <div className="flex items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="ml-4">
                  <p className="font-bold">{item.name}</p>
                  <p>
                    ₺{item.price} x {item.quantity}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="bg-gray-300 text-black px-2 py-1 rounded"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="bg-gray-300 text-black px-2 py-1 rounded"
                >
                  +
                </button>
                <button
                  onClick={() => removeProductFromCart(item.id)}
                  className="text-red-500 ml-4"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="bg-white shadow-md p-4 mt-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Cart Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Total Items:</span>
            <span>{totalItems}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Total Price:</span>
            <span>₺{totalPrice}</span>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={cart.length === 0}
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg ${
              cart.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
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
