import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import VeganSlider from '../components/VeganSlider'; 
import tofuImage from '../assets/tofu.png';  
import everfreshTofuImage from '../assets/everfreshTofu.png'; 

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('');

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  return (
    <div>
      {/* Slider */}
      <VeganSlider />  

      {/* Categories Section */}
      <div className="container mx-auto py-16">
        <div className="flex flex-wrap justify-center mt-8">
          <Link
            to="/category/all-products"
            onClick={() => handleCategoryClick('all-products')}
            className={`text-xl mx-10 pb-2 ${activeCategory === 'all-products' ? 'border-b-4 border-green-500' : 'hover:border-b-4 hover:border-green-900'}`}
          >
            All Products
          </Link>
          <Link
            to="/category/food"
            onClick={() => handleCategoryClick('food')}
            className={`text-xl mx-10 pb-2 ${activeCategory === 'food' ? 'border-b-4 border-green-500' : 'hover:border-b-4 hover:border-green-900'}`}
          >
            Food
          </Link>
          <Link
            to="/category/cosmetics"
            onClick={() => handleCategoryClick('cosmetics')}
            className={`text-xl mx-10 pb-2 ${activeCategory === 'cosmetics' ? 'border-b-4 border-green-500' : 'hover:border-b-4 hover:border-green-900'}`}
          >
            Cosmetics
          </Link>
          <Link
            to="/category/cleaning"
            onClick={() => handleCategoryClick('cleaning')}
            className={`text-xl mx-10 pb-2 ${activeCategory === 'cleaning' ? 'border-b-4 border-green-500' : 'hover:border-b-4 hover:border-green-900'}`}
          >
            Cleaning
          </Link>
          <Link
            to="/category/aromatherapy"
            onClick={() => handleCategoryClick('aromatherapy')}
            className={`text-xl mx-10 pb-2 ${activeCategory === 'aromatherapy' ? 'border-b-4 border-green-500' : 'hover:border-b-4 hover:border-green-900'}`}
          >
            Aromatherapy
          </Link>
          <Link
            to="/category/vegan-life"
            onClick={() => handleCategoryClick('vegan-life')}
            className={`text-xl mx-10 pb-2 ${activeCategory === 'vegan-life' ? 'border-b-4 border-green-500' : 'hover:border-b-4 hover:border-green-900'}`}
          >
            Vegan life
          </Link>
        </div>
      </div>

      {/* Product Highlights */}
      <div className="bg-gray-100 py-16">
        <h2 className="text-2xl font-bold text-center">Our Products</h2>
        <div className="flex justify-center mt-8 space-x-8">
          <div className="w-60 bg-white p-4 rounded-lg shadow-lg">
            <img src={tofuImage} alt="Tofu" className="w-full h-40 object-cover rounded-md" />
            <h3 className="text-xl mt-4">Tofu</h3>
            <p className="text-green-700 mt-2">₺149,90</p>
            <button className="mt-4 bg-yellow-500 text-black py-2 px-4 rounded-full">Add to Cart</button>
          </div>
          <div className="w-60 bg-white p-4 rounded-lg shadow-lg">
            <img src={everfreshTofuImage} alt="Everfresh Tofu" className="w-full h-40 object-cover rounded-md" />
            <h3 className="text-xl mt-4">Everfresh Tofu</h3>
            <p className="text-green-700 mt-2">₺699,90</p>
            <button className="mt-4 bg-yellow-500 text-black py-2 px-4 rounded-full">Add to Cart</button>
          </div>
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
        <button className="mt-4 bg-yellow-500 text-black py-2 px-6 rounded-full">Subscribe</button>
      </div>
    </div>
  );
};

export default Home;
