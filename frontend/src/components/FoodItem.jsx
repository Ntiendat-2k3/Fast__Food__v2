"use client"

import { useContext } from "react"
import { StoreContext } from "../context/StoreContext"
import { useNavigate } from "react-router-dom"
import { ShoppingCart, Star } from "lucide-react"
import { motion } from "framer-motion"
import { slugify } from "../utils/slugify"

function FoodItem({ name, price, description, image, index }) {
  const { url, addToCart } = useContext(StoreContext)
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/product/${slugify(name)}`)
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart(name, 1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white dark:bg-dark-light rounded-2xl overflow-hidden shadow-custom hover:shadow-hover transition-all hover:-translate-y-1 border border-gray-100 dark:border-dark-lighter cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={url + "/images/" + image || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-2 right-2 bg-white dark:bg-dark rounded-full p-1 shadow-md">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-primary fill-primary" />
            <span className="text-xs font-medium ml-1 text-dark dark:text-white">4.8</span>
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-dark dark:text-white mb-1 truncate">{name}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-primary">{price.toLocaleString("vi-VN")} đ</span>
          <button
            onClick={handleAddToCart}
            className="bg-primary hover:bg-primary-dark text-dark p-2 rounded-full transition-colors"
            type="button"
            aria-label="Thêm vào giỏ hàng"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default FoodItem
