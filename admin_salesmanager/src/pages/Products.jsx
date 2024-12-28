// Products.jsx - Page to Display Products
import React, { useState } from "react";
import { useSalesManager } from "../contexts/SalesManager";

const Products = () => {
    const { products, loading, setPrice, applyDiscount } = useSalesManager();
    const [priceInput, setPriceInput] = useState({});
    const [discountInput, setDiscountInput] = useState({});

    if (loading) {
        return <div>Loading products...</div>;
    }

    const handlePriceChange = (productId, value) => {
        setPriceInput({ ...priceInput, [productId]: value });
    };

    const handleDiscountChange = (productId, value) => {
        setDiscountInput({ ...discountInput, [productId]: value });
    };

    const handleSetPrice = (productId) => {
        const newPrice = parseFloat(priceInput[productId]);
        if (!isNaN(newPrice)) {
            setPrice(productId, newPrice);
        }
    };

    const handleApplyDiscount = (productId) => {
        const discountPercentage = parseFloat(discountInput[productId]);
        if (!isNaN(discountPercentage)) {
            applyDiscount(productId, discountPercentage);
        }
    };

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
                            <th className="border border-gray-300 px-6 py-4 text-left w-1/3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {products.map((product) => {
                            const originalPrice = product.originalPrice || product.price || 0;
                            const currentPrice = product.price || 0;
                            const discountPercentage = product.discountPercentage || 0;
                            return (
                            <tr key={product._id} className="even:bg-gray-50">
                                <td className="border border-gray-300 px-6 py-4 break-words">{product._id}</td>
                                <td className="border border-gray-300 px-6 py-4">{product.name}</td>
                                <td className="border border-gray-300 px-6 py-4">
                                    <div>
                                        {product.discountPercentage > 0 ? (
                                            <>
                                                <p>
                                                    <span className="text-sm text-gray-500 line-through">
                                                        Original: ₺{product.originalPrice?.toFixed(2)}
                                                    </span>
                                                </p>
                                                <p>
                                                    <span className="text-sm font-bold">
                                                        Discount: {product.discountPercentage}%
                                                    </span>
                                                </p>
                                                <p>
                                                    <span className="text-lg text-green-600 font-bold">
                                                        Current: ₺{product.price.toFixed(2)}
                                                    </span>
                                                </p>
                                            </>
                                        ) : (
                                            <p>
                                                <span className="text-lg text-green-600 font-bold">
                                                    Price: ₺{product.price.toFixed(2)}
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </td>
                                <td className="border border-gray-300 px-6 py-4 text-center">{product.stock}</td>
                                <td className="border border-gray-300 px-6 py-4">
                                    <div className="flex flex-col space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="number"
                                                placeholder="New Price"
                                                value={priceInput[product._id] || ""}
                                                onChange={(e) => handlePriceChange(product._id, e.target.value)}
                                                className="border rounded px-4 py-1 w-28"
                                            />
                                            <button
                                                onClick={() => handleSetPrice(product._id)}
                                                className="px-4 py-1 bg-blue-500 text-white rounded"
                                            >
                                                Set Price
                                            </button>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="number"
                                                placeholder="Discount %"
                                                value={discountInput[product._id] || ""}
                                                onChange={(e) => handleDiscountChange(product._id, e.target.value)}
                                                className="border rounded px-4 py-1 w-28"
                                            />
                                            <button
                                                onClick={() => handleApplyDiscount(product._id)}
                                                className="px-4 py-1 bg-green-500 text-white rounded"
                                            >
                                                Apply Discount
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                          );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;
