import express from "express"
import { loginUser, registerUser, getUserProfile } from "../controllers/userController.js"
import auth from "../middleware/auth.js"

const router = express.Router()

router.post("/login", loginUser)
router.post("/register", registerUser)
router.get("/profile", auth, getUserProfile)

export default router
