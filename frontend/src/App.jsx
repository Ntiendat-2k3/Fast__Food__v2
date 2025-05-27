"use client"

import { useState } from "react"
import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home/Home"
import Cart from "./pages/Cart/Cart"
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder"
import Footer from "./components/Footer"
import LoginPopup from "./components/LoginPopup"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import MyOrders from "./pages/MyOrders/MyOrders"
import Foods from "./pages/Foods/Foods"
import ProductDetail from "./pages/ProductDetail/ProductDetail"
import Contact from "./pages/Contact/Contact"
import Payment from "./pages/Payment/Payment"
import Thankyou from "./pages/Thankyou/Thankyou"
import Wishlist from "./pages/Wishlist/Wishlist"

const App = () => {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/foods" element={<Foods />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/thankyou" element={<Thankyou />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </div>
      <Footer />
      <ToastContainer />
    </>
  )
}

export default App
