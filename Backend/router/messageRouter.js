
import express from "express"
import { verifyToken } from "../middleware/authMidlleware.js"
import {getMessages,uploadfile } from "../controllers/messageController.js"
import multer from "multer"

const messageRoute = express.Router()

const upload = multer({dest: "uploads/files"})

messageRoute.post("/get-messages", verifyToken,getMessages)
messageRoute.post("/upload-file", verifyToken, upload.single("file"), uploadfile)

export default messageRoute;