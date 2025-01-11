import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import TokenHandler from './pages/TokenHandler';
import Products from "./pages/Products";
import Product from "./pages/Product";
import Revenues from "./pages/Revenues";
import Invoice from "./pages/Invoice";
import Refund from "./pages/Refund";
import { SalesManagerProvider } from "./contexts/SalesManager";
import SalesManagerHome from "./pages/SalesManagerHome";

const App = () => {
    return (
        <SalesManagerProvider>
            <div className="bg-gray-50 min-h-screen">
                <Navbar />
            <main className="flex-grow">
                <TokenHandler />
                <Routes>
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="/home" element={<SalesManagerHome />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:productID" element={<Product />} />
                    <Route path="/revenues" element={<Revenues />} />
                    <Route path="/invoice" element={<Invoice />} />
                    <Route path="/refund" element={<Refund/>} />
                </Routes>
            </main>
            </div>
        </SalesManagerProvider>
    );
};

export default App;
