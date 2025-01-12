import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]); // Backend data
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all-products');
  const [sortOption, setSortOption] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [availability, setAvailability] = useState('all');
  const [searchParams] = useSearchParams(); // For reading query params

  const [categories, setCategories] = useState([]);

  // Fetch products from the backend
  useEffect(() => {
    axios
      .get('http://localhost:5001/api/products') // Replace with your actual API endpoint
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data); // Initial filtering
      })
      .catch((error) => console.error('Error fetching products:', error));
  }, []);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Eğer public hale getirdiyseniz token şart değil, şu 2 satırı silebilirsiniz.
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get("http://localhost:5001/api/products/categories", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);


  // Update active category from URL
  useEffect(() => {
    const categoryFromParams = searchParams.get('category'); // Get category from query params
    if (categoryFromParams) {
      setActiveCategory(categoryFromParams);
    }
  }, [searchParams]);

  // Update filtered products when filters change
  useEffect(() => {
    let updatedProducts = [...products];

    // Filter by category
    if (activeCategory !== 'all-products') {
      updatedProducts = updatedProducts.filter(
        (product) => product.category === activeCategory
      );
    }

    // Filter by price range
    updatedProducts = updatedProducts.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by availability
    if (availability !== 'all') {
      const isAvailable = availability === 'in-stock';
      updatedProducts = updatedProducts.filter(
        (product) => (product.stock > 0) === isAvailable
      );
    }

    // Sort products
    if (sortOption === 'price-low-high') {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high-low') {
      updatedProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name-asc') {
      updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'name-desc') {
      updatedProducts.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === 'popularity') {
      updatedProducts.sort((a, b) => b.popularity - a.popularity); // Assuming 'popularity' is a field in your product data
    }

    setFilteredProducts(updatedProducts);
  }, [activeCategory, priceRange, availability, sortOption, products]);

  return (
    <div className="container mx-auto flex">
      {/* Sidebar for Filters */}
      <div className="w-1/4 p-4 border-r">
        <h2 className="text-xl font-bold mb-4">Filter by Category</h2>
        <button
          onClick={() => setActiveCategory('all-products')}
          className={`block w-full text-left py-2 ${
            activeCategory === 'all-products' ? 'font-bold' : ''
          }`}
        >
          All Products
        </button>

        {categories.map((cat) => {
          const displayName = cat.charAt(0).toUpperCase() + cat.slice(1);

          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`block w-full text-left py-2 ${
                activeCategory === cat ? 'font-bold' : ''
              }`}
            >
              {displayName}
            </button>
          );
        })}

        <h2 className="text-xl font-bold mt-8 mb-4">Sort By</h2>
        <button
          onClick={() => setSortOption('price-low-high')}
          className={`block w-full text-left py-2 ${
            sortOption === 'price-low-high' ? 'font-bold text-blue-700' : ''
          }`}
        >
          Price: Low to High
        </button>
        <button
          onClick={() => setSortOption('price-high-low')}
          className={`block w-full text-left py-2 ${
            sortOption === 'price-high-low' ? 'font-bold text-blue-700' : ''
          }`}
        >
          Price: High to Low
        </button>
        <button
          onClick={() => setSortOption('name-asc')}
          className={`block w-full text-left py-2 ${
            sortOption === 'name-asc' ? 'font-bold text-blue-700' : ''
          }`}
        >
          Name: A to Z
        </button>
        <button
          onClick={() => setSortOption('name-desc')}
          className={`block w-full text-left py-2 ${
            sortOption === 'name-desc' ? 'font-bold text-blue-700' : ''
          }`}
        >
          Name: Z to A
        </button>
        <button
          onClick={() => setSortOption('popularity')}
          className={`block w-full text-left py-2 ${
            sortOption === 'popularity' ? 'font-bold text-blue-700' : ''
          }`}
        >
          Popularity
        </button>

        <h2 className="text-xl font-bold mt-8 mb-4">Filter by Price</h2>
        <button
          onClick={() => setPriceRange([0, 100000])}
          className={`block w-full text-left py-2 ${
            priceRange[0] === 0 && priceRange[1] === 100000 ? 'font-bold text-blue-700' : ''
          }`}
        >
          All
        </button>
        <button
          onClick={() => setPriceRange([0, 100])}
          className={`block w-full text-left py-2 ${
            priceRange[0] === 0 && priceRange[1] === 100 ? 'font-bold text-blue-700' : ''
          }`}
        >
          $0 - $100
        </button>
        <button
          onClick={() => setPriceRange([100, 500])}
          className={`block w-full text-left py-2 ${
            priceRange[0] === 100 && priceRange[1] === 500 ? 'font-bold text-blue-700' : ''
          }`}
        >
          $100 - $500
        </button>
        <button
          onClick={() => setPriceRange([500, 1000])}
          className={`block w-full text-left py-2 ${
            priceRange[0] === 500 && priceRange[1] === 1000 ? 'font-bold text-blue-700' : ''
          }`}
        >
          $500 - $1000
        </button>

        <h2 className="text-xl font-bold mt-8 mb-4">Availability</h2>
        <button
          onClick={() => setAvailability('all')}
          className={`block w-full text-left py-2 ${
            availability === 'all' ? 'font-bold text-blue-700' : ''
          }`}
        >
          All
        </button>
        <button
          onClick={() => setAvailability('in-stock')}
          className={`block w-full text-left py-2 ${
            availability === 'in-stock' ? 'font-bold text-blue-700' : ''
          }`}
        >
          In Stock
        </button>
        <button
          onClick={() => setAvailability('out-of-stock')}
          className={`block w-full text-left py-2 ${
            availability === 'out-of-stock' ? 'font-bold text-blue-700' : ''
          }`}
        >
          Out of Stock
        </button>
      </div>

      {/* Products Section */}
      <div className="w-3/4 p-4">
        <h1 className="text-3xl font-bold mb-4">Products</h1>
        <div className="grid grid-cols-3 gap-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="border p-4">
                <img src={product.imageURL} alt={product.name} className="w-full" />
                <p className="font-bold">{product.name}</p>
                {product.discountPercentage ? (
              <div className="mt-2">
                <p className="text-sm line-through text-gray-500">
                  ${product.originalPrice.toFixed(2)}
                </p>
                <p className="text-lg text-green-600 font-bold">
                  ${product.price.toFixed(2)} ({product.discountPercentage}% OFF)
                </p>
              </div>
            ) : (
              <p className="text-lg text-gray-700 mt-2">${product.price.toFixed(2)}</p>
            )}
                <p className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </p>
                {product.stock > 0 && (
                  <p className="text-sm text-gray-500 mt-1">Available: {product.stock}</p>
                )}
                <Link to={`/product/${product._id}`}>
                  <button className="mt-2 bg-blue-500 text-white px-2 py-1 rounded">
                    View Details
                  </button>
                </Link>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;