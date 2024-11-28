import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';

const Product = () => {
  const { productID } = useParams();
  const [product, setProduct] = useState(null);
  const [staticSimilarProducts, setStaticSimilarProducts] = useState([]); // Static state for similar products
  const [feedback, setFeedback] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addProductToCart, user, isAuthenticated } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await axios.get(`http://localhost:5001/api/products/${productID}`);
        setProduct(productResponse.data);

        const feedbackResponse = await axios.get(`http://localhost:5001/api/products/${productID}/feedback`);
        setFeedback(feedbackResponse.data.visibleComments);

        // Fetch and set similar products once
        const allProductsResponse = await axios.get(`http://localhost:5001/api/products`);
        const allProducts = allProductsResponse.data;

        const filteredSimilarProducts = allProducts
          .filter(
            (p) =>
              p._id !== productID && // Exclude the current product
              p.category === productResponse.data.category && // Same category
              Math.abs(p.price - productResponse.data.price) <= 20 // Within ±20 price range
          )
          .sort(() => Math.random() - 0.5) // Shuffle to randomize
          .slice(0, 4); // Pick up to 4 products

        setStaticSimilarProducts(filteredSimilarProducts);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching product or feedback:', err.message);
        setError('Failed to fetch product details or feedback');
        setLoading(false);
      }
    };

    fetchData();
  }, [productID]);

  const handleAddFeedback = async () => {
    if (!isAuthenticated) {
      alert('You must be logged in to leave feedback.');
      return;
    }

    if (!newRating || newRating < 1 || newRating > 5) {
      alert('Please provide a valid rating between 1 and 5.');
      return;
    }

    try {
      await axios.post(`http://localhost:5001/api/products/${productID}/feedback`, {
        userId: user.id,
        text: newComment || '',
        rating: newRating,
      });

      alert('Your comment will be reviewed before publishing! Thank you for your feedback.');

      // Reset form fields
      setNewComment('');
      setNewRating(0);
    } catch (err) {
      console.error('Failed to add feedback:', err.response?.data || err.message);
      alert('Failed to add feedback');
    }
  };

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      alert('Sorry, this product is out of stock.');
      return;
    }

    const quantityToAdd = Math.min(quantity, product.stock);

    const productToAdd = {
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: quantityToAdd,
      image: product.imageURL,
    };

    addProductToCart(productToAdd);
    alert(`${product.name} added to cart!`);
  };

  if (loading) {
    return <div>Loading product details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex">
        <div className="w-1/2">
          <img src={product.imageURL} alt={product.name} className="w-full" />
        </div>
        <div className="w-1/2 pl-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl text-green-700">₺{product.price}</p>
          <p className="mt-2">{product.description}</p>
          <p className={`mt-4 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? 'In stock' : 'Out of stock'}
          </p>
          {product.stock >= 0 && (
            <p className="text-sm text-gray-500 mt-1">Available: {product.stock}</p>
          )}
          <div className="flex items-center mt-4">
            <button
              onClick={decreaseQuantity}
              className="bg-gray-300 text-black px-2 py-1 rounded"
              disabled={product.stock <= 0}
            >
              -
            </button>
            <span className="mx-2 text-lg">{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="bg-gray-300 text-black px-2 py-1 rounded"
              disabled={quantity >= product.stock}
            >
              +
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className={`mt-4 ${product.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-yellow-500'} text-white px-4 py-2 rounded mr-2`}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Similar Products */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Similar Products</h2>
        <div className="flex space-x-4">
          {staticSimilarProducts.length > 0 ? (
            staticSimilarProducts.map((similarProduct) => (
              <div key={similarProduct._id} className="border p-4 rounded-lg shadow-md">
                <img
                  src={similarProduct.imageURL}
                  alt={similarProduct.name}
                  className="w-full h-40 object-cover mb-4"
                />
                <h3 className="text-lg font-bold">{similarProduct.name}</h3>
                <p className="text-green-700">₺{similarProduct.price}</p>
                <Link
                  to={`/product/${similarProduct._id}`}
                  className="text-blue-500 mt-2 inline-block"
                >
                  View Product
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No similar products found.</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold">Comments and Ratings</h2>
        {feedback.length > 0 ? (
          feedback.map((item) => (
            <div key={item._id} className="border p-4 rounded mb-2">
              <p>Rating: {item.rating}</p>
              <p>{item.text}</p>
            </div>
          ))
        ) : (
          <p>No comments or ratings yet.</p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold">Add Your Feedback</h2>
        <textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />
        <div className="flex space-x-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setNewRating(star)}
              className={`p-2 rounded ${newRating === star ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            >
              {star}
            </button>
          ))}
        </div>
        <button
          onClick={handleAddFeedback}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Product;