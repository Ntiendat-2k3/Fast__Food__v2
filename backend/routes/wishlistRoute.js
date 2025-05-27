import express from "express"
import { addToWishlist, removeFromWishlist, getWishlist, checkWishlist } from "../controllers/wishlistController.js"
import authMiddleware from "../middleware/auth.js"

const wishlistRouter = express.Router()

wishlistRouter.post("/add", authMiddleware, addToWishlist)
wishlistRouter.post("/remove", authMiddleware, removeFromWishlist)
wishlistRouter.post("/get", authMiddleware, getWishlist)
wishlistRouter.get("/check/:foodId", authMiddleware, checkWishlist)

export default wishlistRouter
