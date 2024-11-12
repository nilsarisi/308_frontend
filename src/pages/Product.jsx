import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import productImage from "../assets/tofu.png"; 
import productImage1 from "../assets/everfreshTofu.png"; 

const Product = () => {
  const [quantity, setQuantity] = useState(1); 
  const { addProductToCart } = useCart();

  const product = {
    id: 1,
    name: 'Tofu',
    price: 149.90,
    description: 'Healthy and fresh tofu. It is obtained by curdling the milk of soybeans produced from local soybean seeds. It can be consumed fried or raw, and can also be used in different recipes such as salad, pasta, menemen. It does not contain preservatives or gluten.',
    stock: 10, // Stock
    image: productImage,
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1); // Increase by checking stock status
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1); // Quantity cannot be less than 1
    }
  };

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      quantity, // Selected amount
    };
    addProductToCart(productToAdd); 
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex">
        <div className="w-1/2">
          {/* Product image */}
          <img src={product.image} alt={product.name} className="w-full" />
        </div>
        <div className="w-1/2 pl-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl text-green-700">₺{product.price}</p>
          <p className="mt-2">{product.description}</p>

          {/* Stock status */}
          <p className={`mt-4 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock > 0 ? "In stock" : "Out of stock"}
          </p>

          {/* Increasing or decreasing amount of products */}
          <div className="flex items-center mt-4">
            <button onClick={decreaseQuantity} className="bg-gray-300 text-black px-2 py-1 rounded">-</button>
            <span className="mx-2 text-lg">{quantity}</span>
            <button onClick={increaseQuantity} className="bg-gray-300 text-black px-2 py-1 rounded">+</button>
          </div>

          {/* Adding to cart */}
          <button 
            onClick={handleAddToCart} 
            className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded mr-2"
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
          <button 
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Out of Stock" : "Buy Now"}
          </button>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-l font-bold">Product Features</h2>
        <ul className="list-disc pl-5 text-xs">
          <li>Made from local soybean seeds, this curd is produced by curdling fresh soybean milk.</li>
          <li>Versatile consumption options: can be enjoyed fried or raw.</li>
          <li>Suitable for various recipes, including salads, pasta dishes, and traditional Turkish menemen.</li>
          <li>Free from preservatives and gluten, making it a healthy choice for diverse dietary needs.</li>
        </ul>
      </div>
      
      <div className="mt-6 mb-12">
        <h2 className="text-l font-bold">Ingredients</h2>
        <ul className="list-disc pl-5 text-xs">
          <li>Local Soybeans, Water, Salt, Lemon Salt.</li>
        </ul>
      </div>

      <div className="mt-6p-4 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Similar Products</h2>
        <div className="flex space-x-4">
          <div className="border p-2 w-1/4">
            <img src={productImage1} alt="Everfresh Sade Tofu 300gr" className="w-full" />
            <p>Everfresh Tofu 1000gr</p>
            <p className="text-green-700">₺699,90</p>
            <button className="mt-2 bg-yellow-500 text-white px-2 py-1 rounded">Add Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
