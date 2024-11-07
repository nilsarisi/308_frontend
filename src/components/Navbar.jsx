import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Replace with your logo path
import { AiOutlineUser, AiOutlineHeart, AiOutlineShoppingCart } from 'react-icons/ai'; // Using react-icons for icons

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-yellow-700 text-white">
      {/* Left side - Logo and Title */}
      <div className="flex items-center space-x-3">
        <img src={logo} alt="Logo" className="w-12 h-15"/>
        <h1 className="font-luckiest-guy text-4xl">Vegan Eats</h1>
      </div>

      {/* Right side - Buttons */}
      <div className="flex space-x-4">
        <Link to="/account" className="flex items-center space-x-1 hover:text-blue-300">
          <AiOutlineUser size={24} />
          <span className='font-luckiest-guy text-xl'>My Account</span>
        </Link>
        <Link to="/favorites" className="flex items-center space-x-1 hover:text-blue-300">
          <AiOutlineHeart size={24} />
          <span className='font-luckiest-guy text-xl'>Wishlist</span>
        </Link>
        <Link to="/cart" className="flex items-center space-x-1 hover:text-blue-300">
          <AiOutlineShoppingCart size={24} />
          <span className='font-luckiest-guy text-xl'>Cart</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
