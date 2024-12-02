import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const Products = () => {
  const { category } = useParams(); // Kategoriyi URL'den alıyoruz
  const [products, setProducts] = useState([]); // Ürünler
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtrelenmiş Ürünler
  const [sortOption, setSortOption] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 100000]);

  // Ürünleri API'den alıyoruz
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/products'); // API'den ürünleri al
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Kategoriye göre ürünleri filtrele
  useEffect(() => {
    let updatedProducts = [...products];

    // Kategoriye göre filtreleme
    if (category && category !== 'all-products') {
      updatedProducts = updatedProducts.filter((product) => product.category === category);
    }

    // Fiyat aralığına göre filtreleme
    updatedProducts = updatedProducts.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sıralama işlemi
    if (sortOption === 'price-low-high') {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high-low') {
      updatedProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name-asc') {
      updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'name-desc') {
      updatedProducts.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredProducts(updatedProducts);
  }, [category, priceRange, sortOption, products]);

  return (
    <div className="container mx-auto flex">
      {/* Sol Menü (Filtreleme) */}
      <div className="w-1/4 p-4 border-r">
        <h2 className="text-xl font-bold mb-4">Filter by Category</h2>
        <Link
          to="/products"
          className={`block w-full text-left py-2 ${category === 'all-products' ? 'font-bold' : ''}`}
        >
          All Products
        </Link>
        <Link
          to="/category/food"
          className={`block w-full text-left py-2 ${category === 'food' ? 'font-bold' : ''}`}
        >
          Food
        </Link>
        <Link
          to="/category/cosmetics"
          className={`block w-full text-left py-2 ${category === 'cosmetics' ? 'font-bold' : ''}`}
        >
          Cosmetics
        </Link>
        <Link
          to="/category/cleaning"
          className={`block w-full text-left py-2 ${category === 'cleaning' ? 'font-bold' : ''}`}
        >
          Cleaning
        </Link>

        {/* Fiyat aralığı */}
        <h2 className="text-xl font-bold mt-8 mb-4">Filter by Price</h2>
        <button
          onClick={() => setPriceRange([0, 100000])}
          className={`block w-full text-left py-2 ${
            priceRange[0] === 0 && priceRange[1] === 100000 ? 'font-bold' : ''
          }`}
        >
          All
        </button>
        <button
          onClick={() => setPriceRange([0, 100])}
          className={`block w-full text-left py-2 ${
            priceRange[0] === 0 && priceRange[1] === 100 ? 'font-bold' : ''
          }`}
        >
          ₺0 - ₺100
        </button>
        <button
          onClick={() => setPriceRange([100, 500])}
          className={`block w-full text-left py-2 ${
            priceRange[0] === 100 && priceRange[1] === 500 ? 'font-bold' : ''
          }`}
        >
          ₺100 - ₺500
        </button>
        <button
          onClick={() => setPriceRange([500, 1000])}
          className={`block w-full text-left py-2 ${
            priceRange[0] === 500 && priceRange[1] === 1000 ? 'font-bold' : ''
          }`}
        >
          ₺500 - ₺1000
        </button>

        {/* Sıralama */}
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
      </div>

      {/* Ürünler Bölümü */}
      <div className="w-3/4 p-4">
        <h1 className="text-3xl font-bold mb-4">Products</h1>
        <div className="grid grid-cols-3 gap-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="border p-4">
                <img src={product.imageURL} alt={product.name} className="w-full" />
                <p className="font-bold">{product.name}</p>
                <p className="text-green-700">₺{product.price}</p>
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