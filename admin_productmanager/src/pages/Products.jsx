import React, { useState, useEffect } from "react";
import axios from "axios";
import { useProductManager } from "../contexts/ProductManager";

const backendUrl = "http://localhost:5001";

const Products = () => {
  const {
    products,
    loading,
    createProduct,
    deleteProduct,
    fetchProducts,
  } = useProductManager();

  const [newProductData, setNewProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    imageURL: "",
  });

  const [adjustedStocks, setAdjustedStocks] = useState({});
  const [categories, setCategories] = useState([]);



  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(`${backendUrl}/api/products/distinct-categories`, {
          headers: {
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
  
    fetchCategories();
  }, []);

  useEffect(() => {
    setAdjustedStocks(
      products.reduce((acc, product) => {
        acc[product._id] = product.stock || 0;
        return acc;
      }, {})
    );
  }, [products]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const parsedPrice = parseFloat(newProductData.price) || 0.0;
    const parsedStock = parseInt(newProductData.stock, 10) || 0;

    const productDataToSend = {
      ...newProductData,
      price: parsedPrice,
      stock: parsedStock,
    };

    try {
      await createProduct(productDataToSend);
      setNewProductData({
        name: "",
        description: "",
        price: "",
        category: "",
        brand: "",
        stock: "",
        imageURL: "",
      });
    } catch (error) {
      console.error("Create product failed:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const userConfirmed = window.confirm("Bu ürünü silmek istediğinize emin misiniz?");
    if (userConfirmed) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  const handleStockUpdate = async (productId) => {
    const newStock = adjustedStocks[productId];
    if (newStock === undefined || newStock < 0) {
      alert("Invalid stock value");
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.put(
        `${backendUrl}/api/products/stock/${productId}`,
        { newStock },
        {
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
        }
      );
      // Refresh products after update
      fetchProducts();
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Failed to update stock.");
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      <form onSubmit={handleCreateProduct} className="mb-8 border p-4">
  <h2 className="text-xl font-bold mb-4">Add New Product</h2>
  
  <div className="mb-4">
    <label className="block font-medium mb-1">Name</label>
    <input
      type="text"
      value={newProductData.name}
      onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
      className="w-full border rounded px-2 py-1"
      required
    />
  </div>
  
  <div className="mb-4">
    <label className="block font-medium mb-1">Description</label>
    <textarea
      value={newProductData.description}
      onChange={(e) => setNewProductData({ ...newProductData, description: e.target.value })}
      className="w-full border rounded px-2 py-1"
      required
    ></textarea>
  </div>
  
  <div className="mb-4">
    <label className="block font-medium mb-1">Price</label>
    <input
      type="number"
      value={newProductData.price}
      onChange={(e) => setNewProductData({ ...newProductData, price: e.target.value })}
      className="w-full border rounded px-2 py-1"
      min="0"
      step="0.01"
      required
    />
  </div>
  
  <div className="mb-4">
  <label className="block font-medium mb-1">Category</label>
  <select
    value={newProductData.category}
    onChange={(e) => setNewProductData({ ...newProductData, category: e.target.value })}
    className="w-full border rounded px-2 py-1"
    required
  >
    <option value="">Select a category</option>
    {categories.map((category) => (
      <option key={category} value={category}>
        {category}
      </option>
    ))}
  </select>
</div>
  
  <div className="mb-4">
    <label className="block font-medium mb-1">Brand</label>
    <input
      type="text"
      value={newProductData.brand}
      onChange={(e) => setNewProductData({ ...newProductData, brand: e.target.value })}
      className="w-full border rounded px-2 py-1"
      required
    />
  </div>
  
  <div className="mb-4">
    <label className="block font-medium mb-1">Stock</label>
    <input
      type="number"
      value={newProductData.stock}
      onChange={(e) => setNewProductData({ ...newProductData, stock: e.target.value })}
      className="w-full border rounded px-2 py-1"
      min="0"
      required
    />
  </div>
  
  <div className="mb-4">
    <label className="block font-medium mb-1">Image URL</label>
    <input
      type="url"
      value={newProductData.imageURL}
      onChange={(e) => setNewProductData({ ...newProductData, imageURL: e.target.value })}
      className="w-full border rounded px-2 py-1"
    />
  </div>
  
  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
    Add Product
  </button>
</form>


      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-6 py-4 text-left w-1/6">ID</th>
              <th className="border border-gray-300 px-6 py-4 text-left w-1/4">Name</th>
              <th className="border border-gray-300 px-6 py-4 text-left w-1/6">Price</th>
              <th className="border border-gray-300 px-6 py-4 text-left w-1/12">Stock</th>
              <th className="border border-gray-300 px-6 py-4 text-left w-1/12"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="even:bg-gray-50">
                <td className="border border-gray-300 px-6 py-4 break-words">
                  {product._id}
                </td>
                <td className="border border-gray-300 px-6 py-4">{product.name}</td>
                <td className="border border-gray-300 px-6 py-4">
                  ${product.price.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-6 py-4">
                  <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={adjustedStocks[product._id] ?? 0} 
                    onChange={(e) => {
                      const intValue = parseInt(e.target.value) || 0;
                      setAdjustedStocks((prev) => ({
                        ...prev,
                        [product._id]: Math.max(0, intValue),
                      }));
                    }}
                  />
                    <button
                      onClick={() => handleStockUpdate(product._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Update
                    </button>
                  </div>
                </td>
                <td className="border border-gray-300 px-6 py-4">
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
