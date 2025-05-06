import express from "express"
import { verifyToken } from "../middleware/authMidlleware.js"
import { createChannel, getChannelMessages, getUserChannels } from "../controllers/channelControllers.js"

const channelRoute = express.Router()

channelRoute.post("/create-channel", verifyToken, createChannel)
channelRoute.get("/get-user-channel", verifyToken, getUserChannels)
channelRoute.get("/get-channel-messages/:channelId", verifyToken, getChannelMessages)

export default channelRoute