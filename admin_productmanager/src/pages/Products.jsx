// Products.jsx - Page to Display Products
import React, { useState } from "react";
import { useProductManager } from "../contexts/ProductManager";

const Products = () => {
  const {
    products,
    loading,
    createProduct,   
    deleteProduct,
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

  if (loading) {
    return <div>Loading products...</div>;
  }

  // form submit handler
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
  
  

  // deleting product
  const handleDeleteProduct = async (productId) => {
    await deleteProduct(productId);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      <form onSubmit={handleCreateProduct} className="mb-8 border p-4">
        <h2 className="text-xl font-bold mb-4">Add New Product</h2>
        <div className="mb-2">
          <label className="block font-semibold">Name:</label>
          <input
            type="text"
            value={newProductData.name}
            onChange={(e) =>
              setNewProductData({ ...newProductData, name: e.target.value })
            }
            className="border px-2 py-1 w-full"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block font-semibold">Description:</label>
          <input
            type="text"
            value={newProductData.description}
            onChange={(e) =>
              setNewProductData({
                ...newProductData,
                description: e.target.value,
              })
            }
            className="border px-2 py-1 w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block font-semibold">Price:</label>
          <input
            type="number"
            step="0.01"
            value={newProductData.price}
            onChange={(e) =>
                setNewProductData({
                ...newProductData,
                price: e.target.value,
                })
            }
            className="border px-2 py-1 w-full"
            required
          />

        </div>
        <div className="mb-2">
          <label className="block font-semibold">Category:</label>
          <input
            type="text"
            value={newProductData.category}
            onChange={(e) =>
              setNewProductData({
                ...newProductData,
                category: e.target.value,
              })
            }
            className="border px-2 py-1 w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block font-semibold">Brand:</label>
          <input
            type="text"
            value={newProductData.brand}
            onChange={(e) =>
              setNewProductData({ ...newProductData, brand: e.target.value })
            }
            className="border px-2 py-1 w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block font-semibold">Stock:</label>
          <input
            type="number"
            step="1" 
            value={newProductData.stock}
            onChange={(e) =>
                setNewProductData({
                ...newProductData,
                stock: e.target.value,
                })
            }
            className="border px-2 py-1 w-full"
         />

        </div>
        <div className="mb-4">
          <label className="block font-semibold">Image URL:</label>
          <input
            type="text"
            value={newProductData.imageURL}
            onChange={(e) =>
              setNewProductData({
                ...newProductData,
                imageURL: e.target.value,
              })
            }
            className="border px-2 py-1 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-6 py-4 text-left w-1/6">
                ID
              </th>
              <th className="border border-gray-300 px-6 py-4 text-left w-1/4">
                Name
              </th>
              <th className="border border-gray-300 px-6 py-4 text-left w-1/6">
                Price
              </th>
              <th className="border border-gray-300 px-6 py-4 text-left w-1/12">
                Stock
              </th>
              <th className="border border-gray-300 px-6 py-4 text-left w-1/12">
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="even:bg-gray-50">
                <td className="border border-gray-300 px-6 py-4 break-words">
                  {product._id}
                </td>
                <td className="border border-gray-300 px-6 py-4">
                  {product.name}
                </td>
                <td className="border border-gray-300 px-6 py-4">
                  ${product.price.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-6 py-4 text-center">
                  {product.stock}
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