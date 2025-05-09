"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { StoreContext } from "../context/StoreContext"
import { useTheme } from "../context/ThemeContext"
import { ShoppingCart, User, LogOut, Package, Menu, X, Sun, Moon } from "lucide-react"

const Navbar = ({ setShowLogin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { getTotalCartAmount, token, setToken, cartItems } = useContext(StoreContext)
  const { darkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

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
      if (dropdownOpen && !event.target.closest(".relative")) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownOpen])

  const logout = () => {
    localStorage.removeItem("token")
    setToken("")
    navigate("/")
  }

  const totalItems = Object.values(cartItems).reduce((a, b) => a + b, 0)

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
              <div className="relative">
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
