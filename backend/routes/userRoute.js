import express from "express"
import { loginUser, registerUser, getUserProfile, adminLogin } from "../controllers/userController.js"
import auth from "../middleware/auth.js"

const router = express.Router()

router.post("/login", loginUser)
router.post("/admin/login", adminLogin)
router.post("/register", registerUser)
router.get("/profile", auth, getUserProfile)

export default router
