import commentModel from "../models/commentModel.js"
import userModel from "../models/userModel.js"
import mongoose from "mongoose"

// Thêm bình luận mới
const addComment = async (req, res) => {
  try {
    const { userId, foodId, rating, comment } = req.body

    console.log("Adding comment:", { userId, foodId, rating, comment })

    // Validate foodId
    if (!foodId || !mongoose.Types.ObjectId.isValid(foodId)) {
      console.log("Invalid foodId:", foodId)
      return res.json({ success: false, message: "ID sản phẩm không hợp lệ" })
    }

    // Lấy thông tin người dùng
    const user = await userModel.findById(userId)
    if (!user) {
      console.log("User not found with ID:", userId)
      return res.json({ success: false, message: "Không tìm thấy người dùng" })
    }

    const newComment = new commentModel({
      userId,
      foodId,
      rating,
      comment,
      userName: user.name,
    })

    const savedComment = await newComment.save()
    console.log("Comment saved successfully:", savedComment._id)

    // Automatically respond to all reviews
    const autoResponse = {
      adminReply: {
        message: `Phản hồi của GreenEats:\nCảm ơn bạn ${user.name} đã đánh giá! Chúng tôi rất vui khi bạn hài lòng với dịch vụ và mong bạn sẽ quay lại ủng hộ chúng tôi.`,
        createdAt: new Date(),
      },
    }

    // Update the comment with the automatic response
    await commentModel.findByIdAndUpdate(savedComment._id, autoResponse)
    console.log("Added automatic response to review")

    res.json({
      success: true,
      message: "Thêm đánh giá thành công",
      commentId: savedComment._id,
    })
  } catch (error) {
    console.log("Error adding comment:", error)
    res.json({ success: false, message: "Lỗi khi thêm đánh giá" })
  }
}

// Lấy danh sách bình luận theo sản phẩm
const getCommentsByFood = async (req, res) => {
  try {
    const { foodId } = req.params
    console.log("Getting comments for food:", foodId)

    // Validate foodId
    if (!foodId || !mongoose.Types.ObjectId.isValid(foodId)) {
      console.log("Invalid foodId:", foodId)
      return res.json({ success: false, message: "ID sản phẩm không hợp lệ" })
    }

    const comments = await commentModel
      .find({
        foodId,
        isApproved: true,
      })
      .sort({ createdAt: -1 })

    console.log(`Found ${comments.length} comments for food ${foodId}`)
    res.json({ success: true, data: comments })
  } catch (error) {
    console.log("Error getting comments by food:", error)
    res.json({ success: false, message: "Lỗi khi lấy danh sách đánh giá" })
  }
}

// Lấy tất cả bình luận (cho admin)
const getAllComments = async (req, res) => {
  try {
    console.log("Getting all comments")
    const comments = await commentModel.find({}).sort({ createdAt: -1 })
    console.log(`Found ${comments.length} total comments`)
    res.json({ success: true, data: comments })
  } catch (error) {
    console.log("Error getting all comments:", error)
    res.json({ success: false, message: "Lỗi khi lấy danh sách đánh giá" })
  }
}

// Phê duyệt/từ chối bình luận
const updateCommentStatus = async (req, res) => {
  try {
    const { id, isApproved } = req.body
    console.log("Updating comment status:", { id, isApproved })

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid comment ID:", id)
      return res.json({ success: false, message: "ID đánh giá không hợp lệ" })
    }

    const updatedComment = await commentModel.findByIdAndUpdate(id, { isApproved }, { new: true })

    if (!updatedComment) {
      console.log("Comment not found with ID:", id)
      return res.json({ success: false, message: "Không tìm thấy đánh giá" })
    }

    console.log("Comment status updated successfully:", updatedComment._id)
    res.json({ success: true, message: "Cập nhật trạng thái đánh giá thành công" })
  } catch (error) {
    console.log("Error updating comment status:", error)
    res.json({ success: false, message: "Lỗi khi cập nhật trạng thái đánh giá" })
  }
}

// Xóa bình luận
const deleteComment = async (req, res) => {
  try {
    const { id } = req.body
    console.log("Deleting comment:", id)

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid comment ID:", id)
      return res.json({ success: false, message: "ID đánh giá không hợp lệ" })
    }

    const deletedComment = await commentModel.findByIdAndDelete(id)

    if (!deletedComment) {
      console.log("Comment not found with ID:", id)
      return res.json({ success: false, message: "Không tìm thấy đánh giá" })
    }

    console.log("Comment deleted successfully:", id)
    res.json({ success: true, message: "Xóa đánh giá thành công" })
  } catch (error) {
    console.log("Error deleting comment:", error)
    res.json({ success: false, message: "Lỗi khi xóa đánh giá" })
  }
}

// Reply to a comment
const replyToComment = async (req, res) => {
  try {
    const { id, message } = req.body
    console.log("Replying to comment:", { id, message })

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid comment ID:", id)
      return res.json({ success: false, message: "ID đánh giá không hợp lệ" })
    }

    if (!message) {
      return res.json({ success: false, message: "Nội dung phản hồi không được để trống" })
    }

    const updatedComment = await commentModel.findByIdAndUpdate(
      id,
      {
        adminReply: {
          message,
          createdAt: new Date(),
        },
      },
      { new: true },
    )

    if (!updatedComment) {
      console.log("Comment not found with ID:", id)
      return res.json({ success: false, message: "Không tìm thấy đánh giá" })
    }

    console.log("Comment reply added successfully:", updatedComment._id)
    res.json({ success: true, message: "Thêm phản hồi thành công" })
  } catch (error) {
    console.log("Error replying to comment:", error)
    res.json({ success: false, message: "Lỗi khi thêm phản hồi" })
  }
}

export { addComment, getCommentsByFood, getAllComments, updateCommentStatus, deleteComment, replyToComment }
