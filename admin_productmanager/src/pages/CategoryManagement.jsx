import React, { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = "http://localhost:5001";

const CategoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Fetch data function remains the same
  const fetchData = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
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

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
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

  const handleDeleteCategory = async (categoryName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the category "${categoryName}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.delete(`${backendUrl}/api/products/delete-category`, {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        data: { category: categoryName },
      });

      alert(`Category "${categoryName}" deleted successfully.`);
      fetchData();
    } catch (error) {
      console.error("Error deleting category:", error.response?.data || error.message);
      alert("Failed to delete category.");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Category Management</h1>

      {/* Add Category Form */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
        <form onSubmit={handleAddCategory} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-2"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Category
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold p-4 border-b">Categories</h2>
        {categories.map((category) => (
          <div key={category} className="border-b last:border-b-0">
            <div className="flex items-center justify-between p-4">
              <button
                onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                className="flex-1 text-left font-medium hover:text-blue-600"
              >
                {category}
                <span className="ml-2 text-gray-500">
                  ({products.filter(p => p.category === category).length} products)
                </span>
              </button>
              <button
                onClick={() => handleDeleteCategory(category)}
                className="text-red-500 px-3 py-1 rounded hover:bg-red-50"
              >
                Delete
              </button>
            </div>

            {/* Products in Category */}
            {expandedCategory === category && (
              <div className="bg-gray-50 p-4">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="px-4 py-2">Product Name</th>
                      <th className="px-4 py-2">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter(product => product.category === category)
                      .map(product => (
                        <tr key={product._id}>
                          <td className="px-4 py-2">{product.name}</td>
                          <td className="px-4 py-2">{product.stock}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
        {categories.length === 0 && (
          <p className="p-4 text-gray-500">No categories found.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;
