import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Replace with your logo path
import { AiOutlineUser, AiOutlineHeart, AiOutlineShoppingCart, AiOutlineSearch, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'; // Using react-icons for icons

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <nav className="flex items-center justify-between p-4 bg-green-900 text-white shadow-xl relative">
      {/* Left side - Logo and Title */}
      <div className="flex items-center space-x-3">
        {/* Menu Icon to Toggle Slide-Out Menu */}
        <AiOutlineMenu
          onClick={() => setMenuVisible(true)}
          className="w-6 h-6 cursor-pointer"
        />
        
        {/* Logo */}
        <img src={logo} alt="Logo" className="w-14 h-16" />
        
        {/* Title */}
        <h1 className="font-luckiest-guy text-4xl">Vegan Eats</h1>
      </div>

      {/* Middle part - Search Bar */}
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
              <li className="hover:bg-gray-200 p-2 cursor-pointer">Sunscreen</li>
              <li className="hover:bg-gray-200 p-2 cursor-pointer">Shampoo</li>
            </ul>
          </div>
        )}
      </div>

      {/* Right side - Account, Wishlist, and Cart Icons */}
      <div className="flex space-x-4">
        {/* Account Link with Dropdown */}
        <div className="relative group">
          <Link to="/account" className="flex items-center space-x-1 hover:text-blue-300">
            <AiOutlineUser size={24} />
            <span className="font-luckiest-guy text-xl">Account</span>
          </Link>
          {/* Dropdown Menu */}
          <div className="hidden group-hover:flex flex-col absolute right-0 mt-2 bg-white border rounded-lg shadow-lg p-4 text-black z-10">
            <Link to="/my-account" className="p-2 hover:bg-gray-100 cursor-pointer">My Account</Link>
            <Link to="/orders" className="p-2 hover:bg-gray-100 cursor-pointer">Orders</Link>
            <button onClick={() => {/* handle logout */}} className="p-2 hover:bg-gray-100 cursor-pointer">Logout</button>
            <Link to="/login" className="block px-4 py-2 hover:bg-gray-200">Login</Link>
          </div>
        </div>

        <Link to="/favorites" className="flex items-center space-x-1 hover:text-blue-300">
          <AiOutlineHeart size={24} />
          <span className="font-luckiest-guy text-xl">Wishlist</span>
        </Link>

        <Link to="/cart" className="flex items-center space-x-1 hover:text-blue-300 relative">
          <AiOutlineShoppingCart size={24} />
          <span className="font-luckiest-guy text-xl">Cart</span>
          <p className="absolute top-[-3px] right-[45px] w-4 h-4 flex items-center justify-center bg-white text-black rounded-full text-[8px]">
            9
          </p>
        </Link>
      </div>

      {/* Slide-Out Menu */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-yellow-700 shadow-lg z-30 transform ${menuVisible ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        {/* Close Icon */}
        <AiOutlineClose
          onClick={() => setMenuVisible(false)}
          className="w-6 h-6 cursor-pointer text-white m-4"
        />
        {/* Menu Links */}
        <div className="flex flex-col space-y-4 p-4 text-white">
          <Link to="/" className="hover:text-blue-300" onClick={() => setMenuVisible(false)}>Home</Link>
          <Link to="/products" className="hover:text-blue-300" onClick={() => setMenuVisible(false)}>All Products</Link>
          <Link to="/discounts" className="hover:text-blue-300" onClick={() => setMenuVisible(false)}>Discounts</Link>
          <Link to="/food" className="hover:text-blue-300" onClick={() => setMenuVisible(false)}>Food</Link>
          <Link to="/cosmetics" className="hover:text-blue-300" onClick={() => setMenuVisible(false)}>Cosmetics</Link>
          <Link to="/cleaning" className="hover:text-blue-300" onClick={() => setMenuVisible(false)}>Cleaning</Link>
          <Link to="/about" className="hover:text-blue-300" onClick={() => setMenuVisible(false)}>About</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 