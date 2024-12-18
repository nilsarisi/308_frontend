import React from 'react';
import { useCart } from '../contexts/CartContext'; 
import { Link } from 'react-router-dom';

const Favorites = () => {
  const { favorites, removeFromFavorites, isAuthenticated } = useCart();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Please <Link to="/login" className="text-blue-600 underline">log in</Link> to view your favorites.</p>
      </div>
    );
  }

  if (!favorites) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading your favorites...</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg mb-4">You haven't added any products to your favorites yet.</p>
        <Link to="/products" className="text-blue-600 underline">Browse Products</Link>
      </div>
    );
  }

  const handleRemoveFavorite = (productId) => {
    removeFromFavorites(productId);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-6">Your Favorites</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((item) => (
          <div key={item._id} className="bg-white border rounded-lg shadow-sm p-4 flex flex-col">
            <img src={item.imageURL} alt={item.name} className="w-full h-40 object-cover mb-4 rounded" />
            <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
            <p className="text-gray-700 mb-4">${item.price}</p>
            <button
              className="mt-auto bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              onClick={() => handleRemoveFavorite(item._id)}
            >
              Remove from Favorites
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
