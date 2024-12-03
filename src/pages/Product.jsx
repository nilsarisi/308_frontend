import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <>
      {Array.from({ length: fullStars }, (_, index) => (
        <span key={`full-${index}`} className="text-yellow-500">★</span>
      ))}
      {halfStar && <span className="text-yellow-500">☆</span>}
      {Array.from({ length: emptyStars }, (_, index) => (
        <span key={`empty-${index}`} className="text-gray-300">★</span>
      ))}
    </>
  );
};

const Product = () => {
  const { productID } = useParams();
  const [product, setProduct] = useState(null);
  const [staticSimilarProducts, setStaticSimilarProducts] = useState([]); // Static state for similar products
  const [products, setProducts] = useState([]);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addProductToCart, user, isAuthenticated } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product details and increase popularity
        const productResponse = await axios.get(`http://localhost:5001/api/products/${productID}`);
        setProduct(productResponse.data);

        // Increase product popularity
        await axios.put(`http://localhost:5001/api/products/${productID}/increase-popularity`);

        // Fetch comments and ratings for the product
        setComments(productResponse.data.comments.filter(comment => comment.isVisible));
        setRatings(productResponse.data.ratings);

        // Fetch all products to filter similar ones
        const allProductsResponse = await axios.get(`http://localhost:5001/api/products`);
        const allProducts = allProductsResponse.data;

        // Filter and randomize similar products
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
        setProducts(allProducts); // Set all products in the state

        setLoading(false); // Stop loading
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

    try {
      // Post feedback
      const response = await axios.post(`http://localhost:5001/api/products/${productID}/feedback`, {
        userId: user.id,
        username: user.name,
        text: newComment || '',
        rating: newRating,
      });

      if (newComment) {
        alert('Your comment will be reviewed before publishing! Thank you for your feedback.');
      }

      if (newRating) {
        alert('Your rating is published. Thank you for your rating.');
      }

      // Update comments and ratings state with the new feedback
      if (newComment) {
        setComments([...comments, response.data.product.comments.pop()]);
      }
      if (newRating) {
        setRatings([...ratings, response.data.product.ratings.pop()]);
      }

      // Reset form fields
      setNewComment('');
      setNewRating(0);

      // Reroute to the same page to refresh the data
      navigate(0);
    } catch (err) {
      if (err.response && err.response.data) {
        alert(err.response.data.error);
      } else {
        console.error('Failed to add feedback:', err.message);
        alert('Failed to add feedback');
      }
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
      stock: product.stock,
      image: product.imageURL,
    };

    addProductToCart(productToAdd);
    alert(`${product.name} added to cart!`);
  };

  const averageRating = ratings.length > 0 ? (ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length).toFixed(1) : 0;
  const userRating = ratings.find(rating => rating.user === user?.id)?.rating || 'Not rated yet';

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
          <div className="mt-4">
            <p className="text-lg font-bold">Average Rating: {averageRating} {renderStars(averageRating)}</p>
            <p className="text-lg font-bold">Your Rating: {userRating} {userRating !== 'Not rated yet' && renderStars(userRating)}</p>
          </div>
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
        {product && Array.isArray(products) && products.length > 0 ? (
            products
              .filter(
                (p) =>
                  p._id !== product._id && // Exclude the current product
                  p.category === product.category && // Same category
                  Math.abs(p.price - product.price) <= 20 // Within ±20 price range
              )
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

      <div className="mt-8">
  <h2 className="text-2xl font-bold">Comments and Ratings</h2>
  {comments.length > 0 ? (
    comments
      .filter((item) => item.isVisible)
      .map((item) => {
        const rating = ratings.find(rating => rating.user.toString() === item.user.toString())?.rating || 'Not rated';
        return (
          <div key={item._id} className="border p-4 rounded mb-2">
            <p>Rating (1-5): {renderStars(rating)}</p>
            <p>{item.username}</p>
            <p>{item.text}</p>
          </div>
        );
      })
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