import messageModel from "../models/messageModel.js"
import userModel from "../models/userModel.js"
import mongoose from "mongoose"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { content, userId } = req.body
    const senderId = req.user._id

    // Get user info
    const user = await userModel.findById(senderId)
    if (!user) {
      return res.json({ success: false, message: "User not found" })
    }

    // Handle image upload if present
    let imagePath = null
    if (req.file) {
      // Store the relative path to the image
      imagePath = `chat/${path.basename(req.file.path)}`
    }

    // Create new message
    const newMessage = new messageModel({
      userId: user.role === "admin" ? userId : senderId, // If admin, use the target userId
      userName: user.name,
      content: content || "",
      image: imagePath,
      isAdmin: user.role === "admin",
      recipientId: user.role === "admin" ? userId : null, // Store the recipient ID for admin messages
    })

    await newMessage.save()

    res.json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    })
  } catch (error) {
    console.error("Error sending message:", error)
    res.json({ success: false, message: "Error sending message" })
  }
}

// Get messages for a user
const getUserMessages = async (req, res) => {
  try {
    const userId = req.user._id

    // Get all messages for this user or from admin to this user
    const messages = await messageModel
      .find({
        $or: [
          { userId }, // Messages from this user
          { recipientId: userId, isAdmin: true }, // Admin messages to this user
        ],
      })
      .sort({ createdAt: 1 })

    res.json({ success: true, data: messages })
  } catch (error) {
    console.error("Error getting messages:", error)
    res.json({ success: false, message: "Error getting messages" })
  }
}

// Get all messages (admin only)
const getAllMessages = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.json({ success: false, message: "Unauthorized" })
    }

    // Get all unique users who have sent messages
    const users = await messageModel.aggregate([
      { $match: { isAdmin: false } },
      { $group: { _id: "$userId", userName: { $first: "$userName" }, lastMessage: { $max: "$createdAt" } } },
      { $sort: { lastMessage: -1 } },
    ])

    res.json({ success: true, data: users })
  } catch (error) {
    console.error("Error getting all messages:", error)
    res.json({ success: false, message: "Error getting all messages" })
  }
}

// Get conversation with a specific user (admin only)
const getUserConversation = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.json({ success: false, message: "Unauthorized" })
    }

    const { userId } = req.params

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.json({ success: false, message: "Invalid user ID" })
    }

    // Get all messages between admin and this user
    const messages = await messageModel
      .find({
        $or: [
          { userId, isAdmin: false }, // Messages from this specific user
          { recipientId: userId, isAdmin: true }, // Admin messages specifically for this user
        ],
      })
      .sort({ createdAt: 1 })

    // Mark messages as read
    await messageModel.updateMany({ userId, isAdmin: false, read: false }, { $set: { read: true } })

    res.json({ success: true, data: messages })
  } catch (error) {
    console.error("Error getting conversation:", error)
    res.json({ success: false, message: "Error getting conversation" })
  }
}

// Mark messages as read
const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.body

    // Validate messageId
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.json({ success: false, message: "Invalid message ID" })
    }

    // Update message
    await messageModel.findByIdAndUpdate(messageId, { read: true })

    res.json({ success: true, message: "Message marked as read" })
  } catch (error) {
    console.error("Error marking message as read:", error)
    res.json({ success: false, message: "Error marking message as read" })
  }
}

export { sendMessage, getUserMessages, getAllMessages, getUserConversation, markAsRead }
