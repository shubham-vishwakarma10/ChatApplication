import express from "express"
import { getUserInfo, login, signup, updateProfile, updateProfileImage, removeProfileImage, logout } from "../controllers/userController.js"
import { verifyToken } from "../middleware/authMidlleware.js"
import multer from "multer"

const authRouter = express.Router()

const upload = multer({dest:"uploads/profiles/"});

authRouter.post("/signup",signup)
authRouter.post("/login",login)
authRouter.get("/user-info",verifyToken,getUserInfo)
authRouter.post("/update-profile",verifyToken,updateProfile)
authRouter.post("/add-profile-image",verifyToken,upload.single("profile-image"),updateProfileImage)
authRouter.delete("/remove-profile-image",verifyToken,removeProfileImage)

authRouter.post("/logout",logout)
export default authRouter;