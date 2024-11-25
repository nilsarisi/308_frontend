import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';

const Product = () => {
  const { productID } = useParams();
  const [product, setProduct] = useState(null); // Holds the fetched product data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [quantity, setQuantity] = useState(1);
  const { addProductToCart } = useCart();

  // Fetch product details when component loads
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/products/${productID}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productID]);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      alert("Sorry, this product is out of stock.");
      return;
    }

    const quantityToAdd = Math.min(quantity, product.stock);

    const productToAdd = {
      id: product._id, // Using MongoDB _id
      name: product.name,
      price: product.price,
      quantity: quantityToAdd,
      image: product.imageURL,
    };

    addProductToCart(productToAdd);
    alert(`${product.name} added to cart!`);
  };

  // Show loading state
  if (loading) {
    return <div>Loading product details...</div>;
  }

  // Show error state
  if (error) {
    return <div>{error}</div>;
  }

  // Render product details
  return (
    <div className="container mx-auto p-4">
      <div className="flex">
        <div className="w-1/2">
          <img src={product.imageURL} alt={product.name} className="w-full" />
        </div>
        <div className="w-1/2 pl-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl text-green-700">₺{product.price}</p>
          <p className="mt-2">{product.description}</p>

          <p className={`mt-4 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? "In stock" : "Out of stock"}
          </p>

          {product.stock > 0 && (
            <p className="text-sm text-gray-500 mt-1">Available: {product.stock}</p>
          )}

          <div className="flex items-center mt-4">
            <button
              onClick={decreaseQuantity}
              className="bg-gray-300 text-black px-2 py-1 rounded"
              disabled={product.stock <= 0}
            >
              -
            </button>
            <span className="mx-2 text-lg">{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="bg-gray-300 text-black px-2 py-1 rounded"
              disabled={quantity >= product.stock}
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className={`mt-4 ${product.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-yellow-500'} text-white px-4 py-2 rounded mr-2`}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-l font-bold">Product Features</h2>
        <ul className="list-disc pl-5 text-xs">
          {Array.isArray(product.features) && product.features.length > 0 ? (
            product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))
          ) : (
            <li>No features available</li>
          )}
        </ul>
      </div>

      <div className="mt-6 mb-12">
        <h2 className="text-l font-bold">Ingredients</h2>
        <ul className="list-disc pl-5 text-xs">
          {Array.isArray(product.ingredients) && product.ingredients.length > 0 ? (
            product.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))
          ) : (
            <li>No ingredients listed</li>
          )}
        </ul>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Similar Products</h2>
        <div className="flex space-x-4">
          {/* Show similar products */}
          {/* For simplicity, filter products with the same category (if available in backend) */}
          {/* Implementing a separate API call for similar products can improve accuracy */}
        </div>
      </div>
    </div>
  );
};

export default Product;