import React from 'react';
import { useCart } from '../contexts/CartContext';
import productImage from "../assets/tofu.png"; 

const Cart = () => {
  const { cart, removeProductFromCart, updateProductQuantity } = useCart();

  const decreaseQuantity = (productID) => {
    updateProductQuantity(productID, 'decrease');
  };

  const increaseQuantity = (productID) => {
    updateProductQuantity(productID, 'increase');
  };

  return (
    <div className="container mx-auto p-4">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center space-x-4 mt-4">
            <div className="flex items-center">
              <img src={productImage} alt="Tofu" className="w-16 h-16 object-cover" />
              <div className="ml-4">
                <p>{item.name}</p>
                <p>₺{item.price} x {item.quantity}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Eğer ürün sayısı 1 ise, "-" butonuna tıklanamaz */}
              <button 
                onClick={() => decreaseQuantity(item.id)} 
                className="bg-gray-300 text-black px-2 py-1 rounded"
                disabled={item.quantity <= 1} // Bu kısım ile - butonunu disable ediyoruz
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button 
                onClick={() => increaseQuantity(item.id)} 
                className="bg-gray-300 text-black px-2 py-1 rounded"
              >
                +
              </button>
              <button 
                onClick={() => removeProductFromCart(item.id)} 
                className="text-red-500">Remove</button>
            </div>
          </div>
        ))
      )}
      <div className="mt-4">
        <h3>Total: ₺{cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default Cart;
