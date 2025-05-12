import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import "dotenv/config"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import voucherRouter from "./routes/voucherRoute.js"
import commentRouter from "./routes/commentRoute.js"
import notificationRouter from "./routes/notificationRoute.js"
import feedbackRouter from "./routes/feedbackRoute.js"
import messageRouter from "./routes/messageRoute.js"
// import revenueRouter from "./routes/revenueRoute.js"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// app config
const app = express()
const port = process.env.PORT || 4000

// middleware
app.use(express.json())
app.use(cors())

// Create upload directories if they don't exist
const uploadsDir = path.join(__dirname, "uploads")
const chatUploadsDir = path.join(uploadsDir, "chat")
const foodsUploadsDir = path.join(uploadsDir, "foods")

// Ensure directories exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}
if (!fs.existsSync(chatUploadsDir)) {
  fs.mkdirSync(chatUploadsDir, { recursive: true })
}
if (!fs.existsSync(foodsUploadsDir)) {
  fs.mkdirSync(foodsUploadsDir, { recursive: true })
}

// Serve static files with proper MIME types and caching
app.use(
  "/images",
  express.static(uploadsDir, {
    maxAge: "1d", // Cache for 1 day
    setHeaders: (res, path) => {
      // Set proper content type for images
      if (path.endsWith(".jpg") || path.endsWith(".jpeg")) {
        res.setHeader("Content-Type", "image/jpeg")
      } else if (path.endsWith(".png")) {
        res.setHeader("Content-Type", "image/png")
      } else if (path.endsWith(".gif")) {
        res.setHeader("Content-Type", "image/gif")
      } else if (path.endsWith(".webp")) {
        res.setHeader("Content-Type", "image/webp")
      }
    },
  }),
)

// db connection
connectDB()

// api endpoints
app.use("/api/food", foodRouter)
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use("/api/voucher", voucherRouter)
app.use("/api/comment", commentRouter)
app.use("/api/notification", notificationRouter)
app.use("/api/feedback", feedbackRouter)
app.use("/api/message", messageRouter)
// app.use("/api/revenue", revenueRouter)

app.get("/", (req, res) => {
  res.send("API Working")
})

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`)
})
