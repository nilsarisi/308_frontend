import React from 'react';

const Account = () => {
  return (
    <div className="container mx-auto mt-12 p-4">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
        <p className="text-lg">
          Welcome to your account page. Here, you can view and update your personal information, manage your orders, and more!
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <a href="/order-status" className="text-blue-500 hover:underline">
              View Order Status
            </a>
          </li>
          <li>
            <a href="/favorites" className="text-blue-500 hover:underline">
              Manage Wishlist
            </a>
          </li>
          <li>
            <a href="/account-info" className="text-blue-500 hover:underline">
              Account Information
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Account;