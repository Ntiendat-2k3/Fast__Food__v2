"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  Home,
  Package,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  PieChart,
  Tag,
  MessageSquare,
  Moon,
  Sun,
} from "lucide-react"
import { useTheme } from "../context/ThemeContext"

const Sidebar = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
    navigate("/login")
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const menuItems = [
    {
      path: "/",
      name: "Đơn hàng",
      icon: <ShoppingCart size={20} />,
    },
    {
      path: "/list",
      name: "Sản phẩm",
      icon: <Package size={20} />,
    },
    {
      path: "/add",
      name: "Thêm sản phẩm",
      icon: <Home size={20} />,
    },
    {
      path: "/revenue",
      name: "Doanh thu",
      icon: <PieChart size={20} />,
    },
    {
      path: "/vouchers",
      name: "Mã giảm giá",
      icon: <Tag size={20} />,
    },
    {
      path: "/comments",
      name: "Đánh giá",
      icon: <MessageSquare size={20} />,
    },
    {
      path: "/profile",
      name: "Hồ sơ",
      icon: <User size={20} />,
    },
    {
      path: "/chat",
      name: "Tin nhắn",
      icon: <MessageSquare size={20} />
    }
  ]

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-white dark:bg-dark shadow-md md:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${
          isOpen ? "block" : "hidden"
        } bg-gray-900 bg-opacity-50 transition-opacity duration-300`}
        onClick={closeSidebar}
      ></div>

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-dark-light shadow-xl transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center space-x-2" onClick={closeSidebar}>
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold text-primary">Admin</span>
          </Link>
          <button
            onClick={closeSidebar}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "bg-primary text-white"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={closeSidebar}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleTheme}
              className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              <span className="ml-3">{theme === "dark" ? "Sáng" : "Tối"}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              {/* <span className="ml-3">Đăng xuất</span> */}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
