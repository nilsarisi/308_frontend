import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import {
  AiOutlineUser,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineSearch,
  AiOutlineMenu,
  AiOutlineClose,
} from 'react-icons/ai';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';

const Navbar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [accountMenuVisible, setAccountMenuVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const { cart, isAuthenticated, logout } = useCart();
  const navigate = useNavigate();

  const searchResultsRef = useRef(null);
  const accountMenuRef = useRef(null);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/products');
        setAllProducts(response.data);
      } catch (err) {
        console.error('Failed to fetch products:', err.message);
      }
    };

    fetchProducts();
  }, []);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (query) {
      const filtered = allProducts.filter((product) =>
        product.name
          .split(' ')
          .some((word) => word.toLowerCase().startsWith(query.toLowerCase()))
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setSearchTerm('');
    setFilteredProducts([]);
  };

  const handleMenuToggle = () => setMenuVisible(!menuVisible);

  const toggleAccountMenu = () => setAccountMenuVisible(!accountMenuVisible);

  const handleClickOutside = (e) => {
    if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
      setAccountMenuVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-green-900 text-white shadow-xl relative">
      <div className="flex items-center space-x-3">
        <AiOutlineMenu onClick={handleMenuToggle} className="w-6 h-6 cursor-pointer" />
        <img src={logo} alt="Logo" className="w-14 h-16" />
        <h1 className="font-luckiest-guy text-4xl">Vegan Eats</h1>
      </div>

      <div className="relative flex items-center gap-2 border rounded-lg p-2 max-w-md shadow-md">
        <AiOutlineSearch className="w-6 h-6 text-gray-300 cursor-pointer" />
        <input
          type="text"
          placeholder="Search an item"
          className="w-full outline-none bg-transparent text-white"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && filteredProducts.length > 0 && (
          <div
            ref={searchResultsRef}
            className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-lg mt-2 p-4 z-10"
          >
            <p className="text-gray-600 font-semibold">Search Results:</p>
            <ul className="text-gray-800 mt-2">
              {filteredProducts.map((product) => (
                <li
                  key={product._id}
                  className="hover:bg-gray-200 p-2 cursor-pointer"
                  onClick={() => handleProductClick(product._id)}
                >
                  {product.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        <div className="relative" ref={accountMenuRef}>
          <button
            onClick={toggleAccountMenu}
            className="flex items-center space-x-1 hover:text-blue-300"
          >
            <AiOutlineUser size={24} />
            <span className="font-luckiest-guy text-xl">Account</span>
          </button>
          {accountMenuVisible && (
            <div className="flex flex-col absolute right-0 mt-2 bg-white border rounded-lg shadow-lg p-4 text-black z-10">
              {isAuthenticated ? (
                <>
                  <Link to="/my-account" className="p-2 hover:bg-gray-100 cursor-pointer">
                    My Account
                  </Link>
                  <Link to="/order-status" className="p-2 hover:bg-gray-100 cursor-pointer">
                    Orders
                  </Link>
                  <button onClick={handleLogout} className="p-2 hover:bg-gray-100 cursor-pointer">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="p-2 hover:bg-gray-100 cursor-pointer">
                    Sign In
                  </Link>
                  <Link to="/signup" className="p-2 hover:bg-gray-100 cursor-pointer">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
        <Link to="/favorites" className="flex items-center space-x-1 hover:text-blue-300">
          <AiOutlineHeart size={24} />
          <span className="font-luckiest-guy text-xl">Wishlist</span>
        </Link>
        <Link to="/cart" className="flex items-center space-x-1 hover:text-blue-300 relative">
          <AiOutlineShoppingCart size={24} />
          <span className="font-luckiest-guy text-xl">Cart</span>
          {totalItems > 0 && (
            <p className="absolute top-[-3px] right-[45px] w-4 h-4 flex items-center justify-center bg-white text-black rounded-full text-[8px]">
              {totalItems}
            </p>
          )}
        </Link>
      </div>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-yellow-100 shadow-lg z-30 transform ${
          menuVisible ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <AiOutlineClose
          onClick={handleMenuToggle}
          className="w-6 h-6 cursor-pointer text-black m-4"
        />
        <div className="flex flex-col space-y-4 p-4 text-black">
          <Link to="/" className="hover:text-blue-300" onClick={handleMenuToggle}>
            Home
          </Link>
          <Link to="/products?category=all-products" className="hover:text-blue-300" onClick={handleMenuToggle}>
            All Products
          </Link>
          <Link to="/discounts" className="hover:text-blue-300" onClick={handleMenuToggle}>
            Discounts
          </Link>
          <Link to="/products?category=food" className="hover:text-blue-300" onClick={handleMenuToggle}>
            Food
          </Link>
          <Link to="/products?category=cosmetics" className="hover:text-blue-300" onClick={handleMenuToggle}>
            Cosmetics
          </Link>
          <Link to="/products?category=cleaning" className="hover:text-blue-300" onClick={handleMenuToggle}>
            Cleaning
          </Link>
          <Link to="/about" className="hover:text-blue-300" onClick={handleMenuToggle}>
            About
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;