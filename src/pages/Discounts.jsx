import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Discounts = () => {
  const [products, setProducts] = useState([]); // All products from backend
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered discounted products

  // Fetch products from the backend
  useEffect(() => {
    axios
      .get('http://localhost:5001/api/products') // Replace with your actual API endpoint
      .then((response) => {
        const allProducts = response.data;
        const discountedProducts = allProducts.filter(
          (product) => product.discountPercentage > 0
        );
        setProducts(allProducts);
        setFilteredProducts(discountedProducts); // Only products with discounts
      })
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  return (
    <div className="container mx-auto p-8">
      {/* Page Header */}
      <h1 className="text-3xl font-bold mb-4">Discounted Products</h1>
      <p className="text-gray-600 mb-4">
        Browse our selection of products currently on discount. Take advantage of the savings while they last!
      </p>

      {/* Products Section */}
      <div className="grid grid-cols-3 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="border p-4 rounded">
              <img src={product.imageURL} alt={product.name} className="w-full" />
              <p className="font-bold mt-2">{product.name}</p>
              {product.discountPercentage > 0 && (
                <div className="mt-2">
                  <p className="text-sm line-through text-gray-500">
                    ${product.originalPrice.toFixed(2)}
                  </p>
                  <p className="text-lg text-green-600 font-bold">
                    ${product.price.toFixed(2)} ({product.discountPercentage}% OFF)
                  </p>
                </div>
              )}
              <p className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </p>
              {product.stock > 0 && (
                <p className="text-sm text-gray-500 mt-1">Available: {product.stock}</p>
              )}
              <Link to={`/product/${product._id}`}>
                <button className="mt-2 bg-blue-500 text-white px-2 py-1 rounded">
                  View Details
                </button>
              </Link>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-600">No discounted products available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Discounts;
