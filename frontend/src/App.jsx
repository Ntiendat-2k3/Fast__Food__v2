"use client"
import { useState } from "react"
import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home/Home"
import Cart from "./pages/Cart/Cart"
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder"
import Footer from "./components/Footer"
import LoginPopup from "./components/LoginPopup"
import Thankyou from "./pages/Thankyou/Thankyou"
import MyOrders from "./pages/MyOrders/MyOrders"
import Foods from "./pages/Foods/Foods"
import ProductDetail from "./pages/ProductDetail/ProductDetail"
import Payment from "./pages/Payment/Payment"

const App = () => {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className="min-h-screen bg-white dark:bg-dark font-sans transition-colors duration-300">
        <Navbar setShowLogin={setShowLogin} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/foods" element={<Foods />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<PlaceOrder />} />
            <Route path="/thankyou" element={<Thankyou />} />
            <Route path="/myorders" element={<MyOrders />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/payment/:method/:orderId" element={<Payment />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App
