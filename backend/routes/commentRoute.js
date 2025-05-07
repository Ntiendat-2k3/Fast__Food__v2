import express from "express"
import {
  addComment,
  getCommentsByFood,
  getAllComments,
  updateCommentStatus,
  deleteComment,
} from "../controllers/commentController.js"
import authMiddleware from "../middleware/auth.js"

const commentRouter = express.Router()

commentRouter.post("/add", authMiddleware, addComment)
commentRouter.get("/food/:foodId", getCommentsByFood)
commentRouter.get("/all", getAllComments)
commentRouter.post("/status", updateCommentStatus)
commentRouter.post("/delete", deleteComment)

export default commentRouter
