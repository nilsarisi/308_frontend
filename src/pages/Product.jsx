import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import productImage from '../assets/products/tofu.png';
import productImage1 from '../assets/products/everfreshTofu.png';
import productImage2 from '../assets/products/soap.png';
import productImage3 from '../assets/products/detergent.jpg';
import { useCart } from '../contexts/CartContext';

const Product = () => {
  const { productID } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { addProductToCart } = useCart();

  // Sample products data
  const products = [
    { id: 1, name: 'Tofu', price: 149.9, image: productImage, stock: 10, features: ['Made from soybeans', 'High protein'], ingredients: ['Soybeans', 'Water'] },
    { id: 2, name: 'Everfresh Tofu 1000gr', price: 699.9, image: productImage1, stock: 0, features: ['Made from soybeans'], ingredients: ['Soybeans', 'Water'] },
    { id: 3, name: 'Natural Soap', price: 89.9, image: productImage2, stock: 5, features: ['Made from natural ingredients'], ingredients: ['Glycerin', 'Essential oils'] },
    { id: 4, name: 'Detergent', price: 59.9, image: productImage3, stock: 3, features: ['Effective on grease'], ingredients: ['Water', 'Sodium'] },
  ];

  // Find the product based on the product ID
  const product = products.find((p) => p.id === parseInt(productID));

  if (!product) {
    return <div>Product not found</div>;
  }

  const increaseQuantity = () => setQuantity(quantity + 1);

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      alert("Sorry, this product is out of stock.");
      return;
    }
    
    // Ensure the quantity does not exceed stock
    const quantityToAdd = Math.min(quantity, product.stock);

    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantityToAdd,
      image: product.image,
    };

    addProductToCart(productToAdd);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex">
        <div className="w-1/2">
          <img src={product.image} alt={product.name} className="w-full" />
        </div>
        <div className="w-1/2 pl-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl text-green-700">₺{product.price}</p>
          <p className="mt-2">{product.description}</p>

          <p className={`mt-4 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? "In stock" : "Out of stock"}
          </p>

          {/* Display quantity available */}
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
          {products
            .filter((p) => p.id !== product.id)
            .map((similarProduct) => (
              <div key={similarProduct.id} className="border p-2 w-1/4">
                <img
                  src={similarProduct.image}
                  alt={similarProduct.name}
                  className="w-full"
                />
                <p>{similarProduct.name}</p>
                <p className="text-green-700">₺{similarProduct.price}</p>
                <Link to={`/product/${similarProduct.id}`} state={{ quantity: similarProduct.stock }}>
                  <button className="mt-2 bg-blue-500 text-white px-2 py-1 rounded">
                    View Details
                  </button>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Product;