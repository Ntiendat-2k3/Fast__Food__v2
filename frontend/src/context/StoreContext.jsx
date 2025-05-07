"use client"

import axios from "axios"
import { createContext, useEffect, useState } from "react"

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({})
  const url = "http://localhost:4000"
  const [token, setToken] = useState("")
  const [food_list, setFoodList] = useState([])

  // Cập nhật hàm addToCart để sử dụng name thay vì itemId
  const addToCart = async (itemName, quantity = 1) => {
    // Cập nhật giỏ hàng trong state
    setCartItems((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] || 0) + quantity, // Sử dụng itemName làm key
    }))

    // Gửi thông tin lên server nếu có token
    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/add`,
          { itemName, quantity }, // Gửi itemName thay vì itemId
          { headers: { token } },
        )
      } catch (error) {
        console.error("Error adding item to cart:", error)
      }
    }
  }

  const removeFromCart = async (itemName) => {
    setCartItems((prev) => ({ ...prev, [itemName]: prev[itemName] - 1 }))
    if (token) {
      await axios.post(url + "/api/cart/remove", { itemName }, { headers: { token } })
    }
  }

  const removeFromCartAll = async (itemName) => {
    setCartItems((prev) => ({ ...prev, [itemName]: 0 }))
    if (token) {
      await axios.post(url + "/api/cart/remove", { itemName }, { headers: { token } })
    }
  }

  const getTotalCartAmount = () => {
    let totalAmount = 0
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => product.name === item)
        if (itemInfo) {
          // Kiểm tra itemInfo có tồn tại không
          totalAmount += itemInfo.price * cartItems[item]
        }
      }
    }
    return totalAmount
  }

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list")
    setFoodList(response.data.data)
  }

  const loadCartData = async (token) => {
    const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } })
    setCartItems(response.data.cartData)
  }

  useEffect(() => {
    async function loadData() {
      await fetchFoodList()
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"))
        await loadCartData(localStorage.getItem("token"))
      }
    }
    loadData()
  }, [])

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCartAll,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  }

  return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>
}

export default StoreContextProvider
