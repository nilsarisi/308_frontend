import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Cart from './pages/Cart';
import Collection from './pages/Collection';
import Login from './pages/Login';
import Contact from './pages/Contact';
import Order from './pages/Order';
import PlaceOrder from './pages/PlaceOrder';
import Product from './pages/Product';
import Products from './pages/Products';
import { CartProvider } from './contexts/CartContext';
import './index.css';
import OrderSuccess from './pages/OrderSuccess';

const App = () => {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/order" element={<Order />} />
            <Route path="/placeorder" element={<PlaceOrder />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/products" element={<Products />} />
            <Route path="/category/:category" element={<Products />} />
            <Route path="/product/:productID" element={<Product />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
};

export default App;