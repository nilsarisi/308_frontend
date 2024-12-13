// Products.jsx - Page to Display Products
import React, { useState } from "react";
import { useProductManager } from "../contexts/ProductManager";

const Products = () => {
    const { products, loading } = useProductManager();

    if (loading) {
        return <div>Loading products...</div>;
    }


    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Products</h1>
            <div className="overflow-x-auto">
                <table className="table-auto border-collapse border border-gray-300 w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-6 py-4 text-left w-1/6">ID</th>
                            <th className="border border-gray-300 px-6 py-4 text-left w-1/4">Name</th>
                            <th className="border border-gray-300 px-6 py-4 text-left w-1/6">Price</th>
                            <th className="border border-gray-300 px-6 py-4 text-left w-1/12">Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id} className="even:bg-gray-50">
                                <td className="border border-gray-300 px-6 py-4 break-words">{product._id}</td>
                                <td className="border border-gray-300 px-6 py-4">{product.name}</td>
                                <td className="border border-gray-300 px-6 py-4">${product.price.toFixed(2)}</td>
                                <td className="border border-gray-300 px-6 py-4 text-center">{product.stock}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;
