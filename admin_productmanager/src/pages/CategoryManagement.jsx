import React, { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = "http://localhost:5001";

const CategoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [deleteCategoryName, setDeleteCategoryName] = useState("");
  const [adjustedStocks, setAdjustedStocks] = useState({});

  // Fetch data
  const fetchData = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      // Fetch products
      const productsResponse = await axios.get(`${backendUrl}/api/products`, {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      const fetchedProducts = productsResponse.data.filter(
        (product) => product.category !== "Uncategorized"
      );
      setProducts(fetchedProducts);

      setAdjustedStocks(
        fetchedProducts.reduce((acc, product) => {
          acc[product._id] = product.stock;
          return acc;
        }, {})
      );

      // Fetch categories
      const categoriesResponse = await axios.get(
        `${backendUrl}/api/products/categories`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
        }
      );

      const fetchedCategories = categoriesResponse.data.filter(
        (cat) => cat !== "Uncategorized"
      );

      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching data:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName) {
      alert("Please enter a category name.");
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");

      await axios.post(
        `${backendUrl}/api/products/add-category`,
        { categoryName: newCategoryName },
        {
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
        }
      );

      alert(`Category "${newCategoryName}" added successfully!`);
      setNewCategoryName("");
      fetchData();
    } catch (error) {
      console.error("Error adding category:", error.response?.data || error.message);
      alert("Failed to add category.");
    }
  };

  // Delete category
  const handleRemoveCategory = async (e) => {
    e.preventDefault();
    if (!deleteCategoryName) {
      alert("Please specify a category to remove.");
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.delete(`${backendUrl}/api/products/delete-category`, {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        data: { category: deleteCategoryName },
      });

      alert(`Category "${deleteCategoryName}" removed successfully.`);
      setDeleteCategoryName("");
      fetchData();
    } catch (error) {
      console.error("Error removing category:", error.response?.data || error.message);
      alert("Failed to remove category.");
    }
  };

  // Update stock
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

      alert(`Stock for product ID "${productId}" updated to ${newStock}!`);
      fetchData();
    } catch (error) {
      console.error("Error updating stock:", error.response?.data || error.message);
      alert("Failed to update stock.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Category & Stock Management</h1>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Category Name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        />
        <button
          onClick={handleAddCategory}
          className="bg-green-500 text-white px-4 py-1 rounded"
        >
          Add
        </button>

        <input
          type="text"
          placeholder="Category to Remove"
          value={deleteCategoryName}
          onChange={(e) => setDeleteCategoryName(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        />
        <button
          onClick={handleRemoveCategory}
          className="bg-red-500 text-white px-4 py-1 rounded"
        >
          Remove
        </button>
      </div>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Categories</h2>
        {categories.length > 0 ? (
          <ul className="list-disc pl-5">
            {categories.map((category, index) => (
              <li key={index}>{category}</li>
            ))}
          </ul>
        ) : (
          <p>No categories found.</p>
        )}
      </section>

      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 px-4 py-2">Product ID</th>
            <th className="border border-gray-200 px-4 py-2">Name</th>
            <th className="border border-gray-200 px-4 py-2">Category</th>
            <th className="border border-gray-200 px-4 py-2">Stock</th>
            <th className="border border-gray-200 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className="border border-gray-200 px-4 py-2">{product._id}</td>
              <td className="border border-gray-200 px-4 py-2">{product.name}</td>
              <td className="border border-gray-200 px-4 py-2">{product.category}</td>
              <td className="border border-gray-200 px-4 py-2">{product.stock}</td>
              <td className="border border-gray-200 px-4 py-2">
                <input
                  type="number"
                  value={adjustedStocks[product._id]}
                  onChange={(e) =>
                    setAdjustedStocks((prev) => ({
                      ...prev,
                      [product._id]: Math.max(0, parseInt(e.target.value) || 0),
                    }))
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-20 mr-2"
                />
                <button
                  onClick={() => handleStockUpdate(product._id)}
                  className="bg-blue-500 text-white px-4 py-1 rounded"
                >
                  Update Stock
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryManagement;