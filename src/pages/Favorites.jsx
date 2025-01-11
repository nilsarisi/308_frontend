import React from 'react';
import { useCart } from '../contexts/CartContext'; 
import { Link } from 'react-router-dom';

const Favorites = () => {
  const { favorites, removeFromFavorites, addProductToCart, isAuthenticated } = useCart();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">
          Please <Link to="/login" className="text-blue-600 underline">log in</Link> to view your favorites.
        </p>
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

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      alert('Sorry, this product is out of stock.');
      return;
    }
  
    const productToAdd = {
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1, // Default to 1 for favorites
      stock: product.stock,
      image: product.imageURL,
    };
  
    addProductToCart(productToAdd);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-6">Your Favorites</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((item) => {
          // Calculate discounted price if applicable
          const discountedPrice = item.originalPrice
            ? item.originalPrice - (item.originalPrice * item.discountPercentage) / 100
            : item.price;

          return (
            <div key={item._id} className="bg-white border rounded-lg shadow-sm p-4 flex flex-col">
              {/* Make image clickable to navigate to product details */}
              <Link to={`/product/${item._id}`}>
                <img
                  src={item.imageURL}
                  alt={item.name}
                  className="w-full h-40 object-cover mb-4 rounded hover:opacity-90 transition-opacity"
                />
              </Link>

              {/* Make name clickable to navigate to product details */}
              <Link to={`/product/${item._id}`}>
                <h2 className="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors">
                  {item.name}
                </h2>
              </Link>

              {/* Discount/Price Section */}
              {item.discountPercentage && item.discountPercentage > 0 ? (
                <div className="mb-4">
                  <p className="text-sm line-through text-gray-500">
                    ₺{item.originalPrice?.toFixed(2)}
                  </p>
                  <p className="text-lg text-green-600 font-bold">
                    ₺{discountedPrice.toFixed(2)} ({item.discountPercentage}% OFF)
                  </p>
                </div>
              ) : (
                <p className="text-lg text-green-600 font-bold mb-4">
                  ₺{item.price?.toFixed(2)}
                </p>
              )}

              <button
                className="mt-auto bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 mb-2"
                onClick={() => handleRemoveFavorite(item._id)}
              >
                Remove from Favorites
              </button>
              <button
                onClick={() => handleAddToCart(item)}
                className={`mt-auto ${
                  item.stock === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-600'
                } text-white py-2 px-4 rounded`}
                disabled={item.stock === 0}
              >
                {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Favorites;
