"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { StoreContext } from "../context/StoreContext"
import { useTheme } from "../context/ThemeContext"
import { ShoppingCart, User, LogOut, Package, Menu, X, Sun, Moon, Bell } from "lucide-react"
import axios from "axios"

const Navbar = ({ setShowLogin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { getTotalCartAmount, token, setToken, cartItems, url } = useContext(StoreContext)
  const { darkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".user-dropdown")) {
        setDropdownOpen(false)
      }
      if (notificationsOpen && !event.target.closest(".notifications-dropdown")) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownOpen, notificationsOpen])

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token) return

      try {
        const response = await axios.get(`${url}/api/notification/user`, {
          headers: { token },
        })

        if (response.data.success) {
          setNotifications(response.data.data)
          // Count unread notifications
          const unread = response.data.data.filter((notification) => !notification.read).length
          setUnreadCount(unread)
        }
      } catch (error) {
        console.error("Error fetching notifications:", error)
      }
    }

    if (token) {
      fetchNotifications()

      // Set up polling to check for new notifications every minute
      const intervalId = setInterval(fetchNotifications, 60000)
      return () => clearInterval(intervalId)
    }
  }, [token, url])

  const markAsRead = async (notificationId) => {
    if (!token) return

    try {
      await axios.post(`${url}/api/notification/read`, { id: notificationId, read: true }, { headers: { token } })

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId ? { ...notification, read: true } : notification,
        ),
      )

      // Update unread count
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken("")
    navigate("/")
  }

  const totalItems = Object.values(cartItems).reduce((a, b) => a + b, 0)

  // Get notification type style
  const getNotificationTypeStyle = (type) => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white dark:bg-dark-light shadow-md py-2" : "bg-transparent dark:bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
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
            <span className="text-xl font-bold text-dark dark:text-white">GreenEats</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium transition-colors ${
                location.pathname === "/"
                  ? "text-primary"
                  : "text-dark dark:text-white hover:text-primary dark:hover:text-primary"
              }`}
            >
              Trang chủ
            </Link>
            <Link
              to="/foods"
              className={`font-medium transition-colors ${
                location.pathname === "/foods"
                  ? "text-primary"
                  : "text-dark dark:text-white hover:text-primary dark:hover:text-primary"
              }`}
            >
              Thực đơn
            </Link>
            <Link
              to="/myorders"
              className={`font-medium transition-colors ${
                location.pathname === "/myorders"
                  ? "text-primary"
                  : "text-dark dark:text-white hover:text-primary dark:hover:text-primary"
              }`}
            >
              Đơn hàng
            </Link>
            <Link
              to="/#contact"
              className={`font-medium transition-colors ${
                location.hash === "#contact"
                  ? "text-primary"
                  : "text-dark dark:text-white hover:text-primary dark:hover:text-primary"
              }`}
            >
              Liên hệ
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-dark dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
              aria-label={darkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>

            {/* Notifications */}
            {token && (
              <div className="notifications-dropdown relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-dark dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
                  aria-expanded={notificationsOpen}
                  aria-haspopup="true"
                >
                  <Bell size={24} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-light rounded-xl shadow-custom py-2 z-10 max-h-96 overflow-y-auto">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-medium text-dark dark:text-white">Thông báo</h3>
                    </div>
                    {notifications.length > 0 ? (
                      <div>
                        {notifications.map((notification) => (
                          <div
                            key={notification._id}
                            className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark cursor-pointer ${
                              !notification.read ? "bg-blue-50 dark:bg-blue-900/10" : ""
                            }`}
                            onClick={() => markAsRead(notification._id)}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <h4
                                className={`font-medium ${!notification.read ? "text-primary" : "text-dark dark:text-white"}`}
                              >
                                {notification.title}
                              </h4>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${getNotificationTypeStyle(notification.type)}`}
                              >
                                {notification.type === "info" && "Thông tin"}
                                {notification.type === "warning" && "Cảnh báo"}
                                {notification.type === "success" && "Thành công"}
                                {notification.type === "error" && "Lỗi"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(notification.createdAt)}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                        <Bell size={24} className="mx-auto mb-2 opacity-50" />
                        <p>Không có thông báo nào</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <Link
              to="/cart"
              className="relative p-2 text-dark dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {!token ? (
              <button
                onClick={() => setShowLogin(true)}
                className="bg-primary hover:bg-primary-dark text-dark font-medium py-2 px-4 rounded-full transition-colors"
              >
                Đăng nhập
              </button>
            ) : (
              <div className="user-dropdown relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="p-2 text-dark dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <User size={24} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-light rounded-xl shadow-custom py-2 z-10">
                    <Link
                      to="/myorders"
                      className="block px-4 py-2 text-sm text-dark dark:text-white hover:bg-primary-light hover:text-dark flex items-center"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Package size={16} className="mr-2" />
                      Đơn hàng của tôi
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setDropdownOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-dark dark:text-white hover:bg-primary-light hover:text-dark flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-dark dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white dark:bg-dark-light rounded-xl shadow-custom p-4">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`font-medium transition-colors ${
                  location.pathname === "/"
                    ? "text-primary"
                    : "text-dark dark:text-white hover:text-primary dark:hover:text-primary"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                to="/foods"
                className={`font-medium transition-colors ${
                  location.pathname === "/foods"
                    ? "text-primary"
                    : "text-dark dark:text-white hover:text-primary dark:hover:text-primary"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Thực đơn
              </Link>
              <Link
                to="/myorders"
                className={`font-medium transition-colors ${
                  location.pathname === "/myorders"
                    ? "text-primary"
                    : "text-dark dark:text-white hover:text-primary dark:hover:text-primary"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Đơn hàng
              </Link>
              <Link
                to="/#contact"
                className={`font-medium transition-colors ${
                  location.hash === "#contact"
                    ? "text-primary"
                    : "text-dark dark:text-white hover:text-primary dark:hover:text-primary"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Liên hệ
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
