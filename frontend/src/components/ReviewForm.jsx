"use client"

import { useState, useContext, useEffect } from "react"
import { Star } from "lucide-react"
import { toast } from "react-toastify"
import axios from "axios"
import { StoreContext } from "../context/StoreContext"

const ReviewForm = ({ foodId, onReviewSubmitted, onCancel }) => {
  const { url, user, token } = useContext(StoreContext)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userData, setUserData] = useState(null)

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      // First try to get user from context
      if (user && user._id) {
        console.log("Using user data from context:", user)
        setUserData(user)
        return
      }

      // Then try to get from localStorage
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          console.log("Using user data from localStorage:", parsedUser)
          setUserData(parsedUser)
          return
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error)
      }

      // If still no user data, try to fetch from API
      const storedToken = localStorage.getItem("token")
      if (storedToken) {
        try {
          console.log("Fetching user data from API with token:", storedToken)
          const response = await axios.get(`${url}/api/user/profile`, {
            headers: { token: storedToken },
          })

          if (response.data.success && response.data.user) {
            console.log("Retrieved user data from API:", response.data.user)
            setUserData(response.data.user)
            localStorage.setItem("user", JSON.stringify(response.data.user))
            return
          }
        } catch (error) {
          console.error("Error fetching user data from API:", error)
        }
      }

      console.warn("Could not load user data from any source")
    }

    loadUserData()
  }, [user, url])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Get token from localStorage
    const storedToken = localStorage.getItem("token")

    // Check if user is logged in
    if (!storedToken) {
      toast.error("Vui lòng đăng nhập để đánh giá")
      return
    }

    console.log("Using token for review submission:", storedToken)

    // Check if we have user data
    if (!userData || !userData._id) {
      console.error("No user data available:", {
        contextUser: user,
        localUserData: userData,
        localStorageToken: storedToken,
        localStorageUser: localStorage.getItem("user"),
      })

      toast.error("Không thể xác định thông tin người dùng, vui lòng đăng nhập lại")
      return
    }

    if (!foodId) {
      toast.error("Không thể xác định sản phẩm để đánh giá")
      return
    }

    if (comment.trim().length < 5) {
      toast.error("Vui lòng nhập nội dung đánh giá (ít nhất 5 ký tự)")
      return
    }

    try {
      setIsSubmitting(true)

      console.log("Submitting review with:", {
        userId: userData._id,
        foodId,
        rating,
        comment,
      })

      // Use the token directly in the headers
      const response = await axios.post(
        `${url}/api/comment/add`,
        {
          userId: userData._id,
          foodId,
          rating,
          comment,
        },
        {
          headers: {
            token: storedToken, // Use 'token' instead of 'Authorization'
          },
        },
      )

      console.log("Review submission response:", response.data)

      if (response.data.success) {
        toast.success("Đánh giá của bạn đã được gửi thành công")
        setComment("")
        setRating(5)
        if (onReviewSubmitted) {
          onReviewSubmitted({
            _id: response.data.commentId || Date.now(),
            userId: userData._id,
            foodId,
            rating,
            comment,
            userName: userData.name,
            createdAt: new Date(),
            isApproved: true,
          })
        }
      } else {
        toast.error(response.data.message || "Có lỗi xảy ra khi gửi đánh giá")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error("Có lỗi xảy ra khi gửi đánh giá: " + (error.response?.data?.message || error.message))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-medium text-dark dark:text-white mb-4">Viết đánh giá của bạn</h3>

      {userData ? (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-dark-light rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Đánh giá với tên: <span className="font-medium text-dark dark:text-white">{userData.name}</span>
          </p>
        </div>
      ) : (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">Đang tải thông tin người dùng...</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Đánh giá của bạn</label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 focus:outline-none"
              >
                <Star
                  size={24}
                  className={`${
                    (hoverRating || rating) >= star
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  } transition-colors`}
                />
              </button>
            ))}
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              {rating === 1 && "Rất tệ"}
              {rating === 2 && "Tệ"}
              {rating === 3 && "Bình thường"}
              {rating === 4 && "Tốt"}
              {rating === 5 && "Rất tốt"}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-700 dark:text-gray-300 mb-2">
            Nội dung đánh giá
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-dark text-gray-700 dark:text-gray-300"
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-light transition-colors"
            >
              Hủy
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !userData}
            className="px-4 py-2 bg-primary hover:bg-primary-light text-dark rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReviewForm
