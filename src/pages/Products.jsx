import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import productImage from '../assets/products/tofu.png';
import productImage1 from '../assets/products/everfreshTofu.png';
import productImage2 from '../assets/products/soap.png';
import productImage3 from '../assets/products/detergent.jpg';

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('all-products');
  const [sortOption, setSortOption] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [availability, setAvailability] = useState('all');

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handleSortChange = (sort) => {
    setSortOption(sort);
  };

  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
  };

  const handleAvailabilityChange = (status) => {
    setAvailability(status);
  };

  const products = [
    { id: 1, name: 'Tofu', price: 149.9, image: productImage, category: 'food', stock: 10 },
    { id: 2, name: 'Everfresh Tofu 1000gr', price: 699.9, image: productImage1, category: 'food', stock: 0 },
    { id: 3, name: 'Natural Soap', price: 89.9, image: productImage2, category: 'cosmetics', stock: 5 },
    { id: 4, name: 'Detergent', price: 59.9, image: productImage3, category: 'cleaning', stock: 3 },
  ];

  // Filter products based on category
  const filteredByCategory = activeCategory === 'all-products'
    ? products
    : products.filter((product) => product.category === activeCategory);

  // Filter products based on price range
  const filteredByPrice = filteredByCategory.filter(
    (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
  );

  // Filter products based on availability
  const filteredByAvailability = availability === 'all'
    ? filteredByPrice
    : filteredByPrice.filter((product) => product.stock > 0 === (availability === 'in-stock'));

  // Sort products based on selected option
  const sortedProducts = [...filteredByAvailability].sort((a, b) => {
    if (sortOption === 'price-low-high') return a.price - b.price;
    if (sortOption === 'price-high-low') return b.price - a.price;
    if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
    if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
    return 0;
  });

  return (
    <div className="container mx-auto flex">
      {/* Sidebar for Filters */}
      <div className="w-1/4 p-4 border-r">
        <h2 className="text-xl font-bold mb-4">Filter by Category</h2>
        <button
          onClick={() => handleCategoryClick('all-products')}
          className={`block w-full text-left py-2 ${activeCategory === 'all-products' ? 'font-bold' : ''}`}
        >
          All Products
        </button>
        <button
          onClick={() => handleCategoryClick('food')}
          className={`block w-full text-left py-2 ${activeCategory === 'food' ? 'font-bold' : ''}`}
        >
          Food
        </button>
        <button
          onClick={() => handleCategoryClick('cosmetics')}
          className={`block w-full text-left py-2 ${activeCategory === 'cosmetics' ? 'font-bold' : ''}`}
        >
          Cosmetics
        </button>
        <button
          onClick={() => handleCategoryClick('cleaning')}
          className={`block w-full text-left py-2 ${activeCategory === 'cleaning' ? 'font-bold' : ''}`}
        >
          Cleaning
        </button>

        <h2 className="text-xl font-bold mt-8 mb-4">Sort By</h2>
        <button onClick={() => handleSortChange('price-low-high')} className={`block w-full text-left py-2 ${sortOption === 'price-low-high' ? 'font-bold text-blue-700' : ''}`}>
          Price: Low to High
        </button>
        <button onClick={() => handleSortChange('price-high-low')} className={`block w-full text-left py-2 ${sortOption === 'price-high-low' ? 'font-bold text-blue-700' : ''}`}>
          Price: High to Low
        </button>
        <button onClick={() => handleSortChange('name-asc')} className={`block w-full text-left py-2 ${sortOption === 'name-asc' ? 'font-bold text-blue-700' : ''}`}>
          Name: A to Z
        </button>
        <button onClick={() => handleSortChange('name-desc')} className={`block w-full text-left py-2 ${sortOption === 'name-desc' ? 'font-bold text-blue-700' : ''}`}>
          Name: Z to A
        </button>

        <h2 className="text-xl font-bold mt-8 mb-4">Filter by Price</h2>
        <button onClick={() => handlePriceRangeChange([0, 100000])} className={`block w-full text-left py-2 ${priceRange[0] === 0 && priceRange[1] === 100000 ? 'font-bold text-blue-700' : ''}`}>
          All
        </button>
        <button onClick={() => handlePriceRangeChange([0, 100])} className={`block w-full text-left py-2 ${priceRange[0] === 0 && priceRange[1] === 100 ? 'font-bold text-blue-700' : ''}`}>
          ₺0 - ₺100
        </button>
        <button onClick={() => handlePriceRangeChange([100, 500])} className={`block w-full text-left py-2 ${priceRange[0] === 100 && priceRange[1] === 500 ? 'font-bold text-blue-700' : ''}`}>
          ₺100 - ₺500
        </button>
        <button onClick={() => handlePriceRangeChange([500, 1000])} className={`block w-full text-left py-2 ${priceRange[0] === 500 && priceRange[1] === 1000 ? 'font-bold text-blue-700' : ''}`}>
          ₺500 - ₺1000
        </button>

        <h2 className="text-xl font-bold mt-8 mb-4">Availability</h2>
        <button onClick={() => handleAvailabilityChange('all')} className={`block w-full text-left py-2 ${availability === 'all' ? 'font-bold text-blue-700' : ''}`}>
          All
        </button>
        <button onClick={() => handleAvailabilityChange('in-stock')} className={`block w-full text-left py-2 ${availability === 'in-stock' ? 'font-bold text-blue-700' : ''}`}>
          In Stock
        </button>
        <button onClick={() => handleAvailabilityChange('out-of-stock')} className={`block w-full text-left py-2 ${availability === 'out-of-stock' ? 'font-bold text-blue-700' : ''}`}>
          Out of Stock
        </button>
      </div>

      {/* Products Section */}
      <div className="w-3/4 p-4">
        <h1 className="text-3xl font-bold mb-4">Products</h1>
        <div className="grid grid-cols-3 gap-4">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
              <div key={product.id} className="border p-4">
                <img src={product.image} alt={product.name} className="w-full" />
                <p className="font-bold">{product.name}</p>
                <p className="text-green-700">₺{product.price}</p>
                <p className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </p>
                {product.stock >= 0 && (
                  <p className="text-sm text-gray-500 mt-1">Available: {product.stock}</p>
                )}
                <Link to={`/product/${product.id}`}>
                  <button className="mt-2 bg-blue-500 text-white px-2 py-1 rounded">
                    View Details
                  </button>
                </Link>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;