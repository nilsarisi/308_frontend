import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';

const Product = () => {
  const { productID } = useParams();
  const [product, setProduct] = useState(null); // Holds the fetched product data
  const [products, setProducts] = useState([]); // Holds all products
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [quantity, setQuantity] = useState(1);
  const { addProductToCart } = useCart();

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);

  // Fetch product details and all products when component loads
  useEffect(() => {
    const fetchProductAndProducts = async () => {
      try {
        // Fetch the specific product
        const productResponse = await axios.get(`http://localhost:5001/api/products/${productID}`);
        setProduct(productResponse.data);

        // Fetch all products
        const allProductsResponse = await axios.get(`http://localhost:5001/api/products`);
        setProducts(allProductsResponse.data);

        // Fetch comments
        const commentsResponse = await axios.get(`http://localhost:5001/api/products/${productID}/feedback`);
        setComments(commentsResponse.data);

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product details');
        setLoading(false);
      }
    };

    fetchProductAndProducts();
  }, [productID]);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      alert("Sorry, this product is out of stock.");
      return;
    }

    const quantityToAdd = Math.min(quantity, product.stock);

    const productToAdd = {
      id: product._id, // Using MongoDB _id
      name: product.name,
      price: product.price,
      quantity: quantityToAdd,
      image: product.imageURL,
    };

    addProductToCart(productToAdd);
    alert(`${product.name} added to cart!`);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting comment:', newComment, newRating);
    try {
      const response = await axios.post(`http://localhost:5001/api/products/${productID}/feedback`, {
        userId: 'UserId', // I don't know how to get the user ID yet
        text: newComment,
        rating: newRating,
      });
      console.log('Comment submitted successfully:', response.data);
      setComments([...comments, response.data]);
      setNewComment('');
      setNewRating(0);
    } catch (err) {
      console.error('Failed to post comment', err);
    }
  };

  // Show loading state
  if (loading) {
    return <div>Loading product details...</div>;
  }

  // Show error state
  if (error) {
    return <div>{error}</div>;
  }

  // Render product details
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
            {product.stock > 0 ? "In stock" : "Out of stock"}
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
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-l font-bold">Product Features</h2>
        <ul className="list-disc pl-5 text-xs">
          {Array.isArray(product.features) && product.features.length > 0 ? (
            product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))
          ) : (
            <li>No features available</li>
          )}
        </ul>
      </div>

      <div className="mt-6 mb-12">
        <h2 className="text-l font-bold">Ingredients</h2>
        <ul className="list-disc pl-5 text-xs">
          {Array.isArray(product.ingredients) && product.ingredients.length > 0 ? (
            product.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))
          ) : (
            <li>No ingredients listed</li>
          )}
        </ul>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Similar Products</h2>
        <div className="flex space-x-4">
          {product && Array.isArray(products) && products.length > 0 ? (
            products
              .filter(
                (p) =>
                  p._id !== product._id && // Exclude the current product
                  p.category === product.category && // Same category
                  Math.abs(p.price - product.price) <= 20 // Within ±20 price range
              )
              .sort(() => Math.random() - 0.5) // Shuffle to randomize the products
              .slice(0, 4) // Pick up to 4 products
              .map((similarProduct) => (
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

      {/* Comments and Star Reviews Section */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Comments & Ratings</h2>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="mt-4">
              <p><strong>Rating:</strong> {comment.rating}</p>
              <p>{comment.text}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-2">No comments or ratings yet. Be the first to share your thoughts!</p>
        )}
        
        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mt-4">
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
            <input
              type="number"
              id="rating"
              value={newRating}
              onChange={(e) => setNewRating(e.target.value)}
              min="1"
              max="5"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mt-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
            <textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Product;