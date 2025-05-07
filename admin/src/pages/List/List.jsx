"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { Search, Trash2, Filter, RefreshCw, Edit } from "lucide-react"
import EditFoodModal from "./EditFoodModal"
import ReactPaginate from "react-paginate"
import ConfirmModal from "../../components/ConfirmModal"
import "./pagination.css"

const List = ({ url }) => {
  const [list, setList] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tất cả")
  const [loading, setLoading] = useState(true)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [currentFood, setCurrentFood] = useState(null)
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, itemId: null })

  // Pagination states
  const [pageCount, setPageCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [displayedItems, setDisplayedItems] = useState([])
  const itemsPerPage = 16

  const categories = ["Tất cả", "Burger", "Burito", "Gà", "Hot dog", "Pasta", "Salad", "Sandwich", "Tart"]

  const fetchList = async (category = "Tất cả") => {
    setLoading(true)
    try {
      const response = await axios.get(`${url}/api/food/list?category=${category !== "Tất cả" ? category : ""}`)
      if (response.data.success) {
        setList(response.data.data)
      } else {
        toast.error("Error fetching products")
      }
    } catch (error) {
      toast.error("Error connecting to server")
    } finally {
      setLoading(false)
    }
  }

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId })
      if (response.data.success) {
        await fetchList(selectedCategory)
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message || "Lỗi khi xóa sản phẩm")
      }
    } catch (error) {
      console.error("Error removing product:", error)
      toast.error(error.response?.data?.message || "Lỗi kết nối đến máy chủ")
    }
  }

  useEffect(() => {
    fetchList(selectedCategory)
  }, [selectedCategory])

  useEffect(() => {
    // Filter items based on search term
    let filteredItems = list
    if (searchTerm.trim() !== "") {
      filteredItems = list.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Calculate pagination
    setPageCount(Math.ceil(filteredItems.length / itemsPerPage))

    // Get current page items
    const startIndex = currentPage * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setDisplayedItems(filteredItems.slice(startIndex, endIndex))
  }, [list, searchTerm, currentPage])

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(0) // Reset to first page on new search
    if (searchTerm.trim() === "") {
      fetchList(selectedCategory)
    } else {
      const filteredList = list.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      setList(filteredList)
    }
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setSearchTerm("")
    setCurrentPage(0) // Reset to first page on category change
  }

  const handleEditClick = (food) => {
    setCurrentFood(food)
    setEditModalOpen(true)
  }

  const handleEditSuccess = () => {
    fetchList(selectedCategory)
    setEditModalOpen(false)
    setCurrentFood(null)
  }

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected)
  }

  const handleDeleteClick = (foodId) => {
    setConfirmModal({
      isOpen: true,
      itemId: foodId,
    })
  }

  const handleConfirmDelete = () => {
    if (confirmModal.itemId) {
      removeFood(confirmModal.itemId)
    }
    setConfirmModal({ isOpen: false, itemId: null })
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white dark:bg-dark-light rounded-2xl shadow-custom p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Danh sách sản phẩm</h1>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark py-3 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 px-4 flex items-center bg-primary rounded-r-lg text-dark"
            >
              Tìm
            </button>
          </form>

          {/* Category Filter */}
          <div className="flex items-center">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="pl-10 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark py-3 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => fetchList(selectedCategory)}
              className="ml-2 p-3 bg-gray-100 dark:bg-dark-lighter rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-dark transition-colors"
              title="Refresh"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : displayedItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white dark:bg-dark rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-dark-lighter"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={`${url}/images/${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-1">{item.name}</h3>
                    <div className="flex items-center mb-2">
                      <span className="bg-primary-light text-dark text-xs px-2 py-1 rounded-full">{item.category}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary">{item.price.toLocaleString("vi-VN")} đ</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="p-2 bg-blue-100 text-blue-500 rounded-full hover:bg-blue-200 transition-colors"
                          title="Sửa sản phẩm"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item._id)}
                          className="p-2 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pageCount > 1 && (
              <div className="pagination-container mt-8">
                <ReactPaginate
                  previousLabel={"←"}
                  nextLabel={"→"}
                  pageCount={pageCount}
                  onPageChange={handlePageChange}
                  containerClassName={"pagination"}
                  previousLinkClassName={"pagination__link"}
                  nextLinkClassName={"pagination__link"}
                  disabledClassName={"pagination__link--disabled"}
                  activeClassName={"pagination__link--active"}
                  forcePage={currentPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-dark-lighter rounded-xl">
            <img
              src="/placeholder.svg?height=120&width=120"
              alt="Không có kết quả"
              className="mx-auto mb-4 opacity-50"
            />
            <h3 className="text-xl text-gray-500 dark:text-gray-400 mb-2">Không tìm thấy sản phẩm</h3>
            <p className="text-gray-400 dark:text-gray-500">Hãy thử thay đổi tìm kiếm hoặc danh mục</p>
          </div>
        )}
      </div>

      {/* Edit Food Modal */}
      {editModalOpen && currentFood && (
        <EditFoodModal
          food={currentFood}
          url={url}
          onClose={() => setEditModalOpen(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, itemId: null })}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
      />
    </div>
  )
}

export default List
