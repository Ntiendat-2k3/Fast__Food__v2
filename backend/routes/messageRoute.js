import express from "express"
import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"
import {
  sendMessage,
  getUserMessages,
  getAllMessages,
  getUserConversation,
  markAsRead,
} from "../controllers/messageController.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// Set up multer for file uploads
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadDir = path.join(__dirname, "../uploads/chat")

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, "chat-" + uniqueSuffix + ext)
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"), false)
    }
    cb(null, true)
  },
})

// Send a message (with optional image)
router.post("/send", auth, upload.single("image"), sendMessage)

// Get messages for current user
router.get("/user", auth, getUserMessages)

// Get all users with messages (admin only)
router.get("/all", auth, getAllMessages)

// Get conversation with specific user (admin only)
router.get("/conversation/:userId", auth, getUserConversation)

// Mark message as read
router.post("/read", auth, markAsRead)

export default router
