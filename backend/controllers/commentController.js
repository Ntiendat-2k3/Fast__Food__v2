import commentModel from "../models/commentModel.js"
import userModel from "../models/userModel.js"

// Thêm bình luận mới
const addComment = async (req, res) => {
  try {
    const { userId, foodId, rating, comment } = req.body

    // Lấy thông tin người dùng
    const user = await userModel.findById(userId)
    if (!user) {
      return res.json({ success: false, message: "Không tìm thấy người dùng" })
    }

    const newComment = new commentModel({
      userId,
      foodId,
      rating,
      comment,
      userName: user.name,
    })

    await newComment.save()
    res.json({ success: true, message: "Thêm đánh giá thành công" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Lỗi khi thêm đánh giá" })
  }
}

// Lấy danh sách bình luận theo sản phẩm
const getCommentsByFood = async (req, res) => {
  try {
    const { foodId } = req.params
    const comments = await commentModel
      .find({
        foodId,
        isApproved: true,
      })
      .sort({ createdAt: -1 })

    res.json({ success: true, data: comments })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Lỗi khi lấy danh sách đánh giá" })
  }
}

// Lấy tất cả bình luận (cho admin)
const getAllComments = async (req, res) => {
  try {
    const comments = await commentModel.find({}).sort({ createdAt: -1 })
    res.json({ success: true, data: comments })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Lỗi khi lấy danh sách đánh giá" })
  }
}

// Phê duyệt/từ chối bình luận
const updateCommentStatus = async (req, res) => {
  try {
    const { id, isApproved } = req.body
    await commentModel.findByIdAndUpdate(id, { isApproved })
    res.json({ success: true, message: "Cập nhật trạng thái đánh giá thành công" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Lỗi khi cập nhật trạng thái đánh giá" })
  }
}

// Xóa bình luận
const deleteComment = async (req, res) => {
  try {
    await commentModel.findByIdAndDelete(req.body.id)
    res.json({ success: true, message: "Xóa đánh giá thành công" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Lỗi khi xóa đánh giá" })
  }
}

export { addComment, getCommentsByFood, getAllComments, updateCommentStatus, deleteComment }
