"use client"

import { useContext, useState } from "react"
import { StoreContext } from "../context/StoreContext"
import axios from "axios"
import { X, Mail, Lock, User } from "lucide-react"

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext)

  const [currState, setCurrState] = useState("Login")
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setData((data) => ({ ...data, [name]: value }))
  }

  const onLogin = async (event) => {
    event.preventDefault()
    let newUrl = url
    if (currState === "Login") {
      newUrl += "/api/user/login"
    } else {
      newUrl += "/api/user/register"
    }

    try {
      const response = await axios.post(newUrl, data)

      if (response.data.success) {
        setToken(response.data.token)
        localStorage.setItem("token", response.data.token)
        setShowLogin(false)
      } else {
        alert(response.data.message)
      }
    } catch (error) {
      alert("Đã xảy ra lỗi. Vui lòng thử lại.")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-fadeIn">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-dark dark:text-white">
              {currState === "Login" ? "Đăng nhập" : "Đăng ký"}
            </h2>
            <button
              onClick={() => setShowLogin(false)}
              className="text-gray-400 hover:text-dark dark:hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={onLogin} className="space-y-4">
            {currState === "Sign Up" && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  name="name"
                  onChange={onChangeHandler}
                  value={data.name}
                  type="text"
                  placeholder="Tên của bạn"
                  required
                  className="w-full bg-white dark:bg-dark-light text-dark dark:text-white border border-gray-300 dark:border-dark-lighter rounded-lg py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                name="email"
                onChange={onChangeHandler}
                value={data.email}
                type="email"
                placeholder="Email của bạn"
                required
                className="w-full bg-white dark:bg-dark-light text-dark dark:text-white border border-gray-300 dark:border-dark-lighter rounded-lg py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                name="password"
                onChange={onChangeHandler}
                value={data.password}
                type="password"
                placeholder="Mật khẩu"
                required
                className="w-full bg-white dark:bg-dark-light text-dark dark:text-white border border-gray-300 dark:border-dark-lighter rounded-lg py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-light text-dark py-3 rounded-lg transition-colors"
            >
              {currState === "Sign Up" ? "Tạo tài khoản" : "Đăng nhập"}
            </button>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 bg-white dark:bg-dark-light border-gray-300 dark:border-dark-lighter rounded focus:ring-primary"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                Bằng cách tiếp tục, tôi đồng ý với điều khoản và chính sách bảo mật
              </label>
            </div>

            {currState === "Login" ? (
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                Tạo tài khoản mới?{" "}
                <button
                  type="button"
                  onClick={() => setCurrState("Sign Up")}
                  className="text-primary hover:underline focus:outline-none"
                >
                  Nhấn vào đây
                </button>
              </p>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                Bạn đã có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => setCurrState("Login")}
                  className="text-primary hover:underline focus:outline-none"
                >
                  Đăng nhập tại đây
                </button>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPopup
