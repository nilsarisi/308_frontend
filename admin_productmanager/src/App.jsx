import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Products from "./pages/Products";
import CommentModeration from "./pages/CommentModeration";
import Product from "./pages/Product";
import Orders from "./pages/Orders";
import Invoice from "./pages/Invoice";
import { ProductManagerProvider } from "./contexts/ProductManager";
import Deliverylist from "./pages/Deliverylist";
import CategoryManagement from "./pages/CategoryManagement";
import TokenHandler from './pages/TokenHandler';



const App = () => {
    return (
        <ProductManagerProvider>
            <div className="bg-gray-50 min-h-screen">
                <Navbar />
            <main className="flex-grow">
                <TokenHandler />
                <Routes>
                    <Route path="/" element={<Navigate to="/products" />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:productID" element={<Product />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/invoice" element={<Invoice />} />
                    <Route path="/comment-moderation" element={<CommentModeration />} /> 
                    <Route path="/delivery-list" element={<Deliverylist />} />
                    <Route path="/category-management" element={<CategoryManagement />} />
                </Routes>
            </main>
            </div>
        </ProductManagerProvider>
    );
};

export default App;