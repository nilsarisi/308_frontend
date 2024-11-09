import React from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from "./pages/Home"
import About from "./pages/About"
import Cart from "./pages/Cart"
import Collection from "./pages/Collection"
import Login from "./pages/Login"
import Contact from "./pages/Contact"
import Order from "./pages/Order"
import PlaceOrder from "./pages/PlaceOrder"
import Product from "./pages/Product"
import './index.css'

const App = () => {
  return (
      <div>
      <Navbar></Navbar>
       <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/about' element={<About/>}></Route>
          <Route path='/cart' element={<Cart/>}></Route>
          <Route path='/collection' element={<Collection/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/contact' element={<Contact/>}></Route>
          <Route path='/order' element={<Order/>}></Route>
          <Route path='/placeorder' element={<PlaceOrder/>}></Route>
          <Route path='/product/:productID' element={<Product/>}></Route>
        </Routes>
        
      <Product></Product>
      <Footer></Footer>
      
    </div>
  )
}

export default App