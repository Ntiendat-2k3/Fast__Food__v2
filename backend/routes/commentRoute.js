import express from "express"
import {
  addComment,
  getCommentsByFood,
  getAllComments,
  updateCommentStatus,
  deleteComment,
} from "../controllers/commentController.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// Add a new comment (requires authentication)
router.post("/add", auth, addComment)

// Get comments by food ID (public)
router.get("/food/:foodId", getCommentsByFood)

// Get all comments (admin only, requires authentication)
router.get("/all", getAllComments)

// Update comment status (admin only, requires authentication)
router.post("/status", updateCommentStatus)

// Delete a comment (admin only, requires authentication)
router.post("/delete", deleteComment)

export default router
