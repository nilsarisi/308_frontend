//home.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import VeganSlider from '../components/VeganSlider';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const { addProductToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState('');
  const [products, setProducts] = useState([]);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/products');
        setProducts(response.data.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch products:', err.message);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  // Handle adding a product to the cart
  const handleAddToCart = async (product) => {
    try {
      if (product.stock <= 0) {
        alert('Sorry, this product is out of stock.');
        return; // Prevent adding out-of-stock products to the cart
      }

      // Add product to the cart using CartContext
      await addProductToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        imageURL: product.imageURL,
        quantity: 1,
      });

      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Failed to add product to cart:', error.message);
      alert('Failed to add product to cart. Please try again.');
    }
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div>
      {/* Slider */}
      <VeganSlider />

      {/* Categories Section */}
      <div className="container mx-auto py-16">
        <div className="flex flex-wrap justify-center mt-8">
          <Link
            to="/products"
            onClick={() => handleCategoryClick('all-products')}
            className={`text-xl mx-10 pb-2 ${
              activeCategory === 'all-products'
                ? 'border-b-4 border-green-500'
                : 'hover:border-b-4 hover:border-green-900'
            }`}
          >
            All Products
          </Link>
          <Link
            to="/category/food"
            onClick={() => handleCategoryClick('food')}
            className={`text-xl mx-10 pb-2 ${
              activeCategory === 'food'
                ? 'border-b-4 border-green-500'
                : 'hover:border-b-4 hover:border-green-900'
            }`}
          >
            Food
          </Link>
          <Link
            to="/category/cosmetics"
            onClick={() => handleCategoryClick('cosmetics')}
            className={`text-xl mx-10 pb-2 ${
              activeCategory === 'cosmetics'
                ? 'border-b-4 border-green-500'
                : 'hover:border-b-4 hover:border-green-900'
            }`}
          >
            Cosmetics
          </Link>
          <Link
            to="/category/cleaning"
            onClick={() => handleCategoryClick('cleaning')}
            className={`text-xl mx-10 pb-2 ${
              activeCategory === 'cleaning'
                ? 'border-b-4 border-green-500'
                : 'hover:border-b-4 hover:border-green-900'
            }`}
          >
            Cleaning
          </Link>
        </div>
      </div>

      {/* Product Highlights */}
      <div className="bg-gray-100 py-16">
        <h2 className="text-2xl font-bold text-center">Our Products</h2>
        <div className="flex justify-center mt-8 space-x-8">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="w-60 bg-white p-4 rounded-lg shadow-lg cursor-pointer"
                onClick={() => handleViewDetails(product._id)}
              >
                <img
                  src={product.imageURL}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md"
                />
                <h3 className="text-xl mt-4">{product.name}</h3>
                <p className="text-green-700 mt-2">₺{product.price.toFixed(2)}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent parent click handler
                    handleAddToCart(product);
                  }}
                  className={`mt-4 bg-yellow-500 text-black py-2 px-4 rounded-full ${
                    product.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : ''
                  }`}
                  disabled={product.stock === 0} // Disable button if out of stock
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No products available.</p>
          )}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-green-900 text-white text-center py-8">
        <h2 className="text-2xl font-bold">Subscribe to Our Newsletter</h2>
        <p className="mt-4 text-lg">Get updates on new arrivals and special offers</p>
        <input
          type="email"
          placeholder="Enter your email"
          className="mt-4 py-2 px-4 rounded-md"
        />
        <button className="mt-4 bg-yellow-500 text-black py-2 px-6 rounded-full">
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default Home;
