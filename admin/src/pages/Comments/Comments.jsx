"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { MessageSquare, Star, Check, X, Trash2, Search, Filter, RefreshCw } from "lucide-react"
import ConfirmModal from "../../components/ConfirmModal"

const Comments = ({ url }) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, commentId: null })
  const [foodList, setFoodList] = useState([])

  const fetchComments = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${url}/api/comment/all`)
      if (response.data.success) {
        setComments(response.data.data)
      } else {
        toast.error("Lỗi khi tải danh sách đánh giá")
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
      toast.error("Lỗi kết nối đến máy chủ")
    } finally {
      setLoading(false)
    }
  }

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`)
      if (response.data.success) {
        setFoodList(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching food list:", error)
    }
  }

  useEffect(() => {
    fetchComments()
    fetchFoodList()
  }, [])

  const handleStatusChange = async (commentId, isApproved) => {
    try {
      const response = await axios.post(`${url}/api/comment/status`, {
        id: commentId,
        isApproved,
      })
      if (response.data.success) {
        toast.success("Cập nhật trạng thái đánh giá thành công")
        fetchComments()
      } else {
        toast.error(response.data.message || "Lỗi khi cập nhật trạng thái đánh giá")
      }
    } catch (error) {
      console.error("Error updating comment status:", error)
      toast.error("Lỗi kết nối đến máy chủ")
    }
  }

  const handleDeleteClick = (commentId) => {
    setConfirmModal({
      isOpen: true,
      commentId: commentId,
    })
  }

  const handleConfirmDelete = async () => {
    if (confirmModal.commentId) {
      try {
        const response = await axios.post(`${url}/api/comment/delete`, { id: confirmModal.commentId })
        if (response.data.success) {
          toast.success("Xóa đánh giá thành công")
          fetchComments()
        } else {
          toast.error(response.data.message || "Lỗi khi xóa đánh giá")
        }
      } catch (error) {
        console.error("Error deleting comment:", error)
        toast.error("Lỗi kết nối đến máy chủ")
      }
    }
    setConfirmModal({ isOpen: false, commentId: null })
  }

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

  const getFoodName = (foodId) => {
    const food = foodList.find((food) => food._id === foodId)
    return food ? food.name : "Sản phẩm không tồn tại"
  }

  const filteredComments = comments.filter((comment) => {
    // Filter by status
    if (statusFilter === "approved" && !comment.isApproved) return false
    if (statusFilter === "pending" && comment.isApproved) return false

    // Filter by search term
    if (searchTerm) {
      const foodName = getFoodName(comment.foodId).toLowerCase()
      return (
        comment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        foodName.includes(searchTerm.toLowerCase())
      )
    }

    return true
  })

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white dark:bg-dark-light rounded-2xl shadow-custom p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
          <MessageSquare className="mr-2" size={24} />
          Quản lý đánh giá sản phẩm
        </h1>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên người dùng, nội dung hoặc sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark py-3 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark py-3 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Tất cả đánh giá</option>
                <option value="approved">Đã duyệt</option>
                <option value="pending">Chưa duyệt</option>
              </select>
            </div>
            <button
              onClick={fetchComments}
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
        ) : filteredComments.length > 0 ? (
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <div
                key={comment._id}
                className={`bg-white dark:bg-dark rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border ${
                  comment.isApproved
                    ? "border-green-200 dark:border-green-900"
                    : "border-yellow-200 dark:border-yellow-900"
                } p-5`}
              >
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        comment.isApproved
                          ? "bg-green-100 dark:bg-green-900/30 text-green-500"
                          : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500"
                      }`}
                    >
                      {comment.isApproved ? <Check size={20} /> : <X size={20} />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{comment.userName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(comment.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!comment.isApproved && (
                      <button
                        onClick={() => handleStatusChange(comment._id, true)}
                        className="p-2 bg-green-100 text-green-500 rounded-full hover:bg-green-200 transition-colors"
                        title="Duyệt đánh giá"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    {comment.isApproved && (
                      <button
                        onClick={() => handleStatusChange(comment._id, false)}
                        className="p-2 bg-yellow-100 text-yellow-500 rounded-full hover:bg-yellow-200 transition-colors"
                        title="Hủy duyệt"
                      >
                        <X size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteClick(comment._id)}
                      className="p-2 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors"
                      title="Xóa đánh giá"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-dark-lighter rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < comment.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Đánh giá cho: {getFoodName(comment.foodId)}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-dark-lighter rounded-xl">
            <MessageSquare size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl text-gray-500 dark:text-gray-400 mb-2">Không có đánh giá nào</h3>
            <p className="text-gray-400 dark:text-gray-500">Chưa có đánh giá nào phù hợp với tìm kiếm của bạn</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, commentId: null })}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác."
      />
    </div>
  )
}

export default Comments
