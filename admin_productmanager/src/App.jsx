import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Products from "./pages/Products";
import Product from "./pages/Product";
import Orders from "./pages/Orders";
import Invoice from "./pages/Invoice";
import { ProductManagerProvider } from "./contexts/ProductManager";


const App = () => {
    return (
        <ProductManagerProvider>
            <div className="bg-gray-50 min-h-screen">
                <Navbar />
            <main className="flex-grow">
                <Routes>
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:productID" element={<Product />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/invoice" element={<Invoice />} />
                </Routes>
            </main>
            </div>
        </ProductManagerProvider>
    );
};

export default App;
