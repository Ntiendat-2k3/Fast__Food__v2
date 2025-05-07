"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import {
  Sun,
  Moon,
  Settings,
  Menu,
  X,
  Home,
  PlusCircle,
  List,
  TrendingUp,
  Tag,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  LogOut,
} from "lucide-react"

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { darkMode, toggleDarkMode } = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { path: "/", label: "Quản lý đơn hàng", icon: <Home size={20} /> },
    { path: "/add", label: "Thêm sản phẩm", icon: <PlusCircle size={20} /> },
    { path: "/list", label: "Fast Food", icon: <List size={20} /> },
    { path: "/revenue", label: "Doanh thu", icon: <TrendingUp size={20} /> },
    { path: "/vouchers", label: "Quản lý voucher", icon: <Tag size={20} /> },
    { path: "/comments", label: "Đánh giá sản phẩm", icon: <MessageSquare size={20} /> },
    { path: "/profile", label: "Cài đặt", icon: <Settings size={20} /> },
  ]

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-dark-light shadow-md py-3 md:hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
              <div className="bg-primary p-2 rounded-lg mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-dark"
                >
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-dark dark:text-white">Admin Panel</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-lighter rounded-full transition-colors"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-lighter rounded-full transition-colors"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="mt-4 bg-white dark:bg-dark-light rounded-xl shadow-custom p-4">
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path)
                      setMobileMenuOpen(false)
                    }}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                      location.pathname === item.path
                        ? "bg-primary text-dark"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-lighter"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white dark:bg-dark-light shadow-lg z-50 transition-all duration-300 hidden md:flex flex-col ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-lighter">
          <div className={`flex items-center ${collapsed ? "justify-center w-full" : ""}`}>
            <div className="bg-primary p-2 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-dark"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              </svg>
            </div>
            {!collapsed && <span className="text-xl font-bold text-dark dark:text-white ml-2">Admin Panel</span>}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`flex items-center w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                    location.pathname === item.path
                      ? "bg-primary text-dark"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-lighter"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  <span>{item.icon}</span>
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-dark-lighter">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleDarkMode}
              className={`p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-lighter rounded-full transition-colors ${
                collapsed ? "mx-auto" : ""
              }`}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {!collapsed && (
              <button
                onClick={() => {
                  // Implement logout functionality
                  navigate("/login")
                }}
                className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-lighter rounded-full transition-colors"
                aria-label="Logout"
              >
                <LogOut size={20} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
