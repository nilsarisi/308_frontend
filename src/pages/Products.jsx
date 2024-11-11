import React from 'react';
import { Link } from 'react-router-dom';
import productImage from '../assets/tofu.png';
import productImage1 from '../assets/everfreshTofu.png';

const Products = () => {
  const products = [
    {
      id: 1,
      name: 'Tofu',
      price: 149.9,
      image: productImage,
    },
    {
      id: 2,
      name: 'Everfresh Tofu 1000gr',
      price: 699.9,
      image: productImage1,
    },
    // Add more products as needed
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-2">
            <img src={product.image} alt={product.name} className="w-full" />
            <p>{product.name}</p>
            <p className="text-green-700">₺{product.price}</p>
            <Link to={`/product/${product.id}`}>
              <button className="mt-2 bg-blue-500 text-white px-2 py-1 rounded">
                View Details
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
