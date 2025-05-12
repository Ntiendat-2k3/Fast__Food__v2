"use client"

import { useState } from "react"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home/Home"
import Foods from "./pages/Foods/Foods"
import ProductDetail from "./pages/ProductDetail/ProductDetail"
import Cart from "./pages/Cart/Cart"
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder"
import Thankyou from "./pages/Thankyou/Thankyou"
import MyOrders from "./pages/MyOrders/MyOrders"
import Contact from "./pages/Contact/Contact"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import LoginPopup from "./components/LoginPopup"

function App() {
  const [showLogin, setShowLogin] = useState(false)

  return (
        <div className="App">
          <Navbar setShowLogin={setShowLogin} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/foods" element={<Foods />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<PlaceOrder />} />
            <Route path="/thankyou" element={<Thankyou />} />
            <Route path="/myorders" element={<MyOrders />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Footer />
          {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
        </div>
  )
}

export default App
