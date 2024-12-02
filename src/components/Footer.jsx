import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full p-4 bg-gray-600 text-white text-center">
      <p className='font-luckiest-guy text-lg'>&copy; {new Date().getFullYear()} Vegan Eats. All rights reserved.</p>
      <p>
        <a href="/privacy" className="hover:text-blue-400">Privacy Policy</a> | 
        <a href="/terms" className="hover:text-blue-400"> Terms of Service</a>
      </p>
    </footer>
  );
};

export default Footer;