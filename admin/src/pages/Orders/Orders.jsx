"use client"

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import ReactPaginate from "react-paginate"
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  CreditCard,
  Wallet,
  Landmark,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import ConfirmModal from "../../components/ConfirmModal"
import "../List/pagination.css"

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredOrders, setFilteredOrders] = useState([])
  const [statusFilter, setStatusFilter] = useState("Tất cả")
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    orderId: null,
    newStatus: "",
    title: "",
    message: "",
  })

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 20
  const pageCount = Math.ceil(filteredOrders.length / itemsPerPage)
  const offset = currentPage * itemsPerPage
  const currentItems = filteredOrders.slice(offset, offset + itemsPerPage)

  // Handle page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected)
  }

  // Fetch all orders from API
  const fetchAllOrders = async () => {
    setLoading(true)
    try {
      const response = await axios.get(url + "/api/order/list")
      if (response.data.success) {
        // Sort orders by date (newest first)
        const sortedOrders = response.data.data.sort((a, b) => {
          return new Date(b.date) - new Date(a.date)
        })
        setOrders(sortedOrders)
        setFilteredOrders(sortedOrders)
      } else {
        toast.error(response.data.message || "Lỗi khi tải danh sách đơn hàng")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error(error.response?.data?.message || "Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  // Update order status
  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value

    setConfirmModal({
      isOpen: true,
      orderId: orderId,
      newStatus: newStatus,
      title: "Xác nhận thay đổi trạng thái",
      message: `Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng thành "${newStatus}"?`,
    })
  }

  const handleConfirmStatusChange = async () => {
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId: confirmModal.orderId,
        status: confirmModal.newStatus,
      })

      if (response.data.success) {
        await fetchAllOrders()
        toast.success("Trạng thái đơn hàng đã được cập nhật")
      } else {
        toast.error(response.data.message || "Lỗi khi cập nhật trạng thái đơn hàng")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.")
    }

    // Close the confirmation modal
    setConfirmModal({
      isOpen: false,
      orderId: null,
      newStatus: "",
      title: "",
      message: "",
    })
  }

  useEffect(() => {
    fetchAllOrders()
  }, [])

  useEffect(() => {
    // Filter orders based on search term and status filter
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.address.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.address.phone.includes(searchTerm) ||
          order._id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "Tất cả") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
    setCurrentPage(0) // Reset to first page when filters change
  }, [searchTerm, statusFilter, orders])

  // Get status icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case "Đang xử lý":
      case "Đang chuẩn bị đồ":
        return <Clock size={18} className="text-yellow-500" />
      case "Đang giao hàng":
        return <Truck size={18} className="text-blue-500" />
      case "Đã giao":
      case "Đã giao hàng":
        return <CheckCircle size={18} className="text-green-500" />
      default:
        return <Package size={18} className="text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Đang xử lý":
      case "Đang chuẩn bị đồ":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "Đang giao hàng":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "Đã giao":
      case "Đã giao hàng":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "COD":
        return <Truck size={16} className="text-gray-600 dark:text-gray-300" />
      case "VNPay":
        return <CreditCard size={16} className="text-blue-500" />
      case "MoMo":
        return <Wallet size={16} className="text-pink-500" />
      case "BankTransfer":
        return <Landmark size={16} className="text-green-500" />
      default:
        return <CreditCard size={16} className="text-gray-500" />
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Đã thanh toán":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "Đang xử lý":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "Thanh toán thất bại":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "Chưa thanh toán":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Không có ngày"

    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Ngày không hợp lệ"
    }

    // Format date to Vietnamese format
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white dark:bg-dark-light rounded-2xl shadow-custom p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Quản lý đơn hàng</h1>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, SĐT hoặc mã đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark py-2 px-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark py-2 px-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Tất cả">Tất cả trạng thái</option>
                <option value="Đang xử lý">Đang xử lý</option>
                <option value="Đang chuẩn bị đồ">Đang chuẩn bị đồ</option>
                <option value="Đang giao hàng">Đang giao hàng</option>
                <option value="Đã giao">Đã giao</option>
              </select>
            </div>
            <button
              onClick={fetchAllOrders}
              className="p-2 bg-gray-100 dark:bg-dark-lighter rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-dark transition-colors"
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {currentItems.map((order) => (
              <div
                key={order._id}
                className="bg-white dark:bg-dark rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-dark-lighter"
              >
                {/* Order Header */}
                <div className="bg-gray-50 dark:bg-dark-lighter p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 dark:border-dark-lighter">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                      <Package size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <p className="text-dark dark:text-white font-medium text-sm">#{order._id.slice(-6)}</p>
                        <span className="mx-2 text-gray-400">•</span>
                        <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                          <Calendar size={12} className="mr-1" />
                          {formatDate(order.date)}
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {order.address.name} • {order.address.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <select
                      onChange={(event) => statusHandler(event, order._id)}
                      value={order.status}
                      className="text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark py-1 px-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Đang xử lý">Đang xử lý</option>
                      <option value="Đang chuẩn bị đồ">Đang chuẩn bị đồ</option>
                      <option value="Đang giao hàng">Đang giao hàng</option>
                      <option value="Đã giao">Đã giao</option>
                    </select>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}
                    >
                      {order.paymentStatus || "Chưa thanh toán"}
                    </span>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Order Items */}
                    <div className="md:col-span-2">
                      <h3 className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-2 font-medium">Sản phẩm</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-100 dark:bg-dark-lighter rounded overflow-hidden mr-2 flex-shrink-0">
                                <img
                                  src={url + "/images/" + item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="text-dark dark:text-white truncate max-w-[150px]">
                                {item.name} <span className="text-gray-500 dark:text-gray-400">x{item.quantity}</span>
                              </span>
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 whitespace-nowrap">
                              {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Info */}
                    <div className="border-t md:border-t-0 md:border-l border-gray-200 dark:border-dark-lighter pt-4 md:pt-0 md:pl-4">
                      <h3 className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-2 font-medium">Thông tin</h3>
                      <div className="space-y-1 text-sm">
                        <p className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Địa chỉ:</span>
                          <span className="text-dark dark:text-white text-right text-xs">{order.address.street}</span>
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center">
                            {getPaymentMethodIcon(order.paymentMethod)}
                            <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                              {order.paymentMethod === "COD"
                                ? "COD"
                                : order.paymentMethod === "VNPay"
                                  ? "VNPay"
                                  : order.paymentMethod === "MoMo"
                                    ? "MoMo"
                                    : "Bank"}
                            </span>
                          </div>
                          <span className="text-lg font-bold text-primary">
                            {order.amount.toLocaleString("vi-VN")} đ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {pageCount > 1 && (
              <div className="flex justify-center mt-6">
                <ReactPaginate
                  previousLabel={<ChevronLeft size={16} />}
                  nextLabel={<ChevronRight size={16} />}
                  breakLabel={"..."}
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageChange}
                  containerClassName={"pagination"}
                  pageClassName={"pagination-item"}
                  pageLinkClassName={"pagination-link"}
                  previousClassName={"pagination-item"}
                  previousLinkClassName={"pagination-link"}
                  nextClassName={"pagination-item"}
                  nextLinkClassName={"pagination-link"}
                  breakClassName={"pagination-item"}
                  breakLinkClassName={"pagination-link"}
                  activeClassName={"active"}
                  forcePage={currentPage}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-dark-lighter rounded-xl">
            <Package size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl text-gray-500 dark:text-gray-400 mb-2">Không có đơn hàng nào</h3>
            <p className="text-gray-400 dark:text-gray-500">Chưa có đơn hàng nào phù hợp với tìm kiếm của bạn</p>
          </div>
        )}
      </div>

      {/* Confirm Status Change Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({
            isOpen: false,
            orderId: null,
            newStatus: "",
            title: "",
            message: "",
          })
        }
        onConfirm={handleConfirmStatusChange}
        title={confirmModal.title}
        message={confirmModal.message}
      />
    </div>
  )
}

export default Orders
