import React from "react";
import { Link } from "react-router-dom";

const SalesManagerHome = () => {
  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      {/* Centered at the top */}
      <div className="text-center mt-10 mb-10">
        <h1 className="text-4xl font-bold mb-4">Sales Manager Home</h1>
        <p className="text-xl">
          Welcome to your main dashboard! You can quickly access products, revenues, invoices, and more.
        </p>
      </div>

      {/* Links Section */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-3xl">
        <Link
          to="/products"
          className="block p-4 bg-blue-200 rounded shadow hover:bg-blue-300"
        >
          <h2 className="font-bold text-lg">Manage Products</h2>
          <p>Set prices, apply discounts, etc.</p>
        </Link>

        <Link
          to="/revenues"
          className="block p-4 bg-green-200 rounded shadow hover:bg-green-300"
        >
          <h2 className="font-bold text-lg">Revenues</h2>
          <p>View revenue charts and data.</p>
        </Link>

        <Link
          to="/invoice"
          className="block p-4 bg-yellow-200 rounded shadow hover:bg-yellow-300"
        >
          <h2 className="font-bold text-lg">Invoices</h2>
          <p>Generate or download invoices.</p>
        </Link>

        <Link
          to="/refund"
          className="block p-4 bg-pink-200 rounded shadow hover:bg-pink-300"
        >
          <h2 className="font-bold text-lg">Refund Requests</h2>
          <p>Approve or reject refund requests.</p>
        </Link>
      </div>
    </div>
  );
};

export default SalesManagerHome;
