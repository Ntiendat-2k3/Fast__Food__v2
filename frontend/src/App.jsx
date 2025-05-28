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
import AIAssistant from "./components/AIAssistant"
import { MessageCircle } from "lucide-react"

const App = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)

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
          <Route path="/payment/:method/:orderId" element={<Payment />} />
          <Route path="/thankyou" element={<Thankyou />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </div>
      <Footer />
      <ToastContainer />

      {!showAIAssistant && (
        <button
          onClick={() => setShowAIAssistant(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-4 rounded-full shadow-lg z-40 transition-all duration-300 flex items-center justify-center group hover:scale-110"
          aria-label="Mở trợ lý ảo"
        >
          <MessageCircle size={24} />
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            AI
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 bg-gray-800 text-white text-xs rounded-lg py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Trợ lý ảo hỗ trợ 24/7
          </div>
        </button>
      )}

      {/* AI Assistant Chat Window */}
      <AIAssistant isOpen={showAIAssistant} onClose={() => setShowAIAssistant(false)} />
    </>
  )
}

export default App
