import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useParams, Link } from 'react-router-dom';
import productImage from '../assets/tofu.png';
import productImage1 from '../assets/everfreshTofu.png';
import productImage2 from '../assets/soap.png';
import productImage3 from '../assets/detergent.jpg'


const Product = () => {
  const { productID } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { addProductToCart } = useCart();

  const products = [
    {
      id: 1,
      name: 'Tofu',
      price: 149.9,
      image: productImage,
      description:
        'It is obtained by curdling the milk of soybeans produced from local soybean seeds...',
      features: [
        'Made from local soybean seeds...',
        'Versatile consumption options...',
        // Add more features
      ],
      ingredients: ['Local Soybeans', 'Water', 'Salt', 'Lemon Salt'],
    },
    {
      id: 2,
      name: 'Everfresh Tofu 1000gr',
      price: 699.9,
      image: productImage1,
      description: 'Everfresh Tofu 1000gr description here...',
      features: [
        'Feature 1...',
        'Feature 2...',
        // Add more features
      ],
      ingredients: ['Soybeans', 'Water', 'Salt'],
    },
    {
      id: 3,
      name: 'Natural Soap',
      price: 89.9,
      image: productImage2,
      description: 'soap description here...',
      features: [
        'Feature 1...',
        'Feature 2...',
        // Add more features
      ],
      ingredients: ['ingridient 1', ',ingridient 2'],
    },
    {
      id: 4,
      name: 'Detergent',
      price: 59.9,
      image: productImage3,
      description: 'detergent description here...',
      features: [
        'Feature 1...',
        'Feature 2...',
        // Add more features
      ],
      ingredients: ['ingridient 1', ',ingridient 2'],
    },
    // Add more products as needed
  ];

  const product = products.find((p) => p.id === parseInt(productID));

  if (!product) {
    return <div>Product not found</div>;
  }

  const increaseQuantity = () => setQuantity(quantity + 1);

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity, // Use the selected quantity
      image: product.image, // Include the image
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
            <button
              onClick={decreaseQuantity}
              className="bg-gray-300 text-black px-2 py-1 rounded"
            >
              -
            </button>
            <span className="mx-2 text-lg">{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="bg-gray-300 text-black px-2 py-1 rounded"
            >
              +
            </button>
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

      {/* Product Features */}
      <div className="mt-6">
        <h2 className="text-l font-bold">Product Features</h2>
        <ul className="list-disc pl-5 text-xs">
          {product.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>

      {/* Ingredients */}
      <div className="mt-6 mb-12">
        <h2 className="text-l font-bold">Ingredients</h2>
        <ul className="list-disc pl-5 text-xs">
          {product.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>

      {/* Similar Products */}
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
                <Link to={`/product/${similarProduct.id}`}>
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
