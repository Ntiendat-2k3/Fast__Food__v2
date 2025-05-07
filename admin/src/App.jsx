import { Routes, Route } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import Add from "./pages/Add/Add"
import List from "./pages/List/List"
import Orders from "./pages/Orders/Orders"
import Profile from "./pages/Profile/Profile"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Revenue from "./pages/Revenue/Revenue"
import Vouchers from "./pages/Vouchers/Vouchers"
import Comments from "./pages/Comments/Comments"
import { ThemeProvider } from "./context/ThemeContext"

const App = () => {
  const url = "http://localhost:4000"

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-dark text-gray-900 dark:text-white transition-colors duration-300">
        <ToastContainer />
        <Sidebar />
        <main className="md:ml-64 pt-20 md:pt-0 transition-all duration-300">
          <div className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/add" element={<Add url={url} />} />
              <Route path="/list" element={<List url={url} />} />
              <Route path="/" element={<Orders url={url} />} />
              <Route path="/revenue" element={<Revenue url={url} />} />
              <Route path="/vouchers" element={<Vouchers url={url} />} />
              <Route path="/comments" element={<Comments url={url} />} />
              <Route path="/profile" element={<Profile url={url} />} />
            </Routes>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
