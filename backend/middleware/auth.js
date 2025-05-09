import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"

const auth = async (req, res, next) => {
  try {
    console.log("Auth middleware headers:", req.headers)

    const token = req.headers.token || req.headers.authorization?.split(" ")[1]

    if (!token) {
      console.log("No token found in headers")
      return res.json({ success: false, message: "Authentication failed: No token provided" })
    }

    console.log("Token received:", token.substring(0, 10) + "...")

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log("Token decoded successfully:", decoded)

      // Find the user by ID
      const user = await userModel.findById(decoded.id)

      if (!user) {
        console.log("User not found with ID:", decoded.id)
        return res.json({ success: false, message: "Authentication failed: User not found" })
      }

      // Set the user ID in the request body
      req.body.userId = decoded.id

      // Set the user in the request object
      req.user = user

      console.log("Authentication successful for user:", user.name)
      next()
    } catch (error) {
      console.error("Token verification error:", error)
      return res.json({ success: false, message: "Authentication failed: Invalid token" })
    }
  } catch (error) {
    console.error("Auth middleware error:", error)
    return res.json({ success: false, message: "Authentication failed: Server error" })
  }
}

export default auth
