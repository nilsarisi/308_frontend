import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import {
  AiOutlineUser,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineSearch,
  AiOutlineMenu,
  AiOutlineClose,
} from 'react-icons/ai';
import { useCart } from '../contexts/CartContext'; // Import useCart

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [accountMenuVisible, setAccountMenuVisible] = useState(false);
  const { cart } = useCart(); // Access cart from context

  // Calculate total number of items in the cart
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const closeAccountMenu = () => {
    setAccountMenuVisible(false);
  };

  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleAccountMenu = () => {
    setAccountMenuVisible(!accountMenuVisible);
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-green-900 text-white shadow-xl relative">
      {/* Left Side - Logo and Title */}
      <div className="flex items-center space-x-3">
        {/* Menu Icon */}
        <AiOutlineMenu
          onClick={handleMenuToggle}
          className="w-6 h-6 cursor-pointer"
        />

        {/* Logo */}
        <img src={logo} alt="Logo" className="w-14 h-16" />

        {/* Title */}
        <h1 className="font-luckiest-guy text-4xl">Vegan Eats</h1>
      </div>

      {/* Center - Search Bar */}
      <div
        className="relative flex items-center gap-2 border rounded-lg p-2 max-w-md shadow-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AiOutlineSearch className="w-6 h-6 text-gray-300 cursor-pointer" />
        <input
          type="text"
          placeholder="Search an item"
          className="w-full outline-none bg-transparent text-white"
        />
        {isHovered && (
          <div className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-lg mt-2 p-4 z-10">
            <p className="text-gray-600 font-semibold">Popular Searches:</p>
            <ul className="text-gray-800 mt-2">
              <li className="hover:bg-gray-200 p-2 cursor-pointer">Tofu</li>
              <li className="hover:bg-gray-200 p-2 cursor-pointer">
                Sunscreen
              </li>
              <li className="hover:bg-gray-200 p-2 cursor-pointer">Shampoo</li>
            </ul>
          </div>
        )}
      </div>

      {/* Right Side - Account, Wishlist, Cart */}
      <div className="flex space-x-4">
        {/* Account Link and Dropdown */}
        <div className="relative">
          <button
            onClick={toggleAccountMenu}
            className="flex items-center space-x-1 hover:text-blue-300"
          >
            <AiOutlineUser size={24} />
            <span className="font-luckiest-guy text-xl">Account</span>
          </button>

          {/* Dropdown Menu */}
          {accountMenuVisible && (
            <div className="flex flex-col absolute right-0 mt-2 bg-white border rounded-lg shadow-lg p-4 text-black z-10">
              <Link
                to="/my-account"
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={closeAccountMenu}
              >
                My Account
              </Link>
              <Link
                to="/orders"
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={closeAccountMenu}
              >
                Orders
              </Link>
              <button
                onClick={() => {
                  /* handle logout */
                  closeAccountMenu();
                }}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </button>
              <Link
                to="/login"
                className="block px-4 py-2 hover:bg-gray-200"
                onClick={closeAccountMenu}
              >
                Login
              </Link>
            </div>
          )}
        </div>

        <Link
          to="/favorites"
          className="flex items-center space-x-1 hover:text-blue-300"
        >
          <AiOutlineHeart size={24} />
          <span className="font-luckiest-guy text-xl">Wishlist</span>
        </Link>

        <Link
          to="/cart"
          className="flex items-center space-x-1 hover:text-blue-300 relative"
        >
          <AiOutlineShoppingCart size={24} />
          <span className="font-luckiest-guy text-xl">Cart</span>
          {totalItems > 0 && (
            <p className="absolute top-[-3px] right-[45px] w-4 h-4 flex items-center justify-center bg-white text-black rounded-full text-[8px]">
              {totalItems}
            </p>
          )}
        </Link>
      </div>

      {/* Slide-Out Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-yellow-100 shadow-lg z-30 transform ${
          menuVisible ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        {/* Close Icon */}
        <AiOutlineClose
          onClick={handleMenuToggle}
          className="w-6 h-6 cursor-pointer text-black m-4"
        />
        {/* Menu Links */}
        <div className="flex flex-col space-y-4 p-4 text-black">
          <Link to="/" className="hover:text-blue-300" onClick={handleMenuToggle}>
            Home
          </Link>
          <Link
            to="/products"
            className="hover:text-blue-300"
            onClick={handleMenuToggle}
          >
            All Products
          </Link>
          <Link
            to="/discounts"
            className="hover:text-blue-300"
            onClick={handleMenuToggle}
          >
            Discounts
          </Link>
          <Link to="/food" className="hover:text-blue-300" onClick={handleMenuToggle}>
            Food
          </Link>
          <Link
            to="/cosmetics"
            className="hover:text-blue-300"
            onClick={handleMenuToggle}
          >
            Cosmetics
          </Link>
          <Link
            to="/cleaning"
            className="hover:text-blue-300"
            onClick={handleMenuToggle}
          >
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
