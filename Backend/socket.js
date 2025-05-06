import { Server as SocketIOServer } from "socket.io";
import messageModel from "./models/messageModel.js";
import channelModel from "./models/channelModel.js";

const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        }
    });

    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`Client Disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    };

    const sendMessage = async(message) => {
        const senderSocketId = userSocketMap.get(message.sender)
        const recipientSocketId = userSocketMap.get(message.recipient)

        const createMessage = await messageModel.create(message)


        const messageData = await messageModel.findById(createMessage._id)
        .populate("sender","id email firstname lastname image color")
        .populate("recipient","id email firstname lastname image color")


        if(recipientSocketId){
            io.to(recipientSocketId).emit("recieveMessage",messageData)
        }
        if(senderSocketId){
            io.to(senderSocketId).emit("recieveMessage",messageData)
        }
    }

    const sendChannelMessage = async(message) => {
        const {channelId, sender, content, messageType, fileUrl} = message;

        const createMessage = await messageModel.create({
            sender,
            recipient:null,
            content,
            messageType,
            timestamp:new Date(),
            fileUrl,
        })

        const messageData = await messageModel.findById(createMessage._id).populate("sender","id email firstName lastName image color").exec();

        await channelModel.findByIdAndUpdate(channelId, {
            $push: {messages: createMessage._id}
        })

        const channel = await channelModel.findById(channelId).populate("members");

        const finalData = { ...messageData._doc, channelId:channel._id}

        console.log("finalDataaaaa",finalData);

        if(channel && channel.members){
            channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString())
                if(memberSocketId) {
                    io.to(memberSocketId).emit("recieve-channel-message",finalData)
                }
            })
            
            const adminSocketId = userSocketMap.get(channel.admin._id.toString())
            if(adminSocketId){
                io.to(adminSocketId).emit("recieve-channel-message",finalData)
            }
        }
    }

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User Connected: ${userId}  with socket ID: ${socket.id}`);
        } else {
            console.log("User ID not provided during connection.");
        }

        socket.on("sendMessage",sendMessage)
        socket.on("send-channel-message",sendChannelMessage)
        socket.on("disconnect", () => disconnect(socket));
    });
};

export default setupSocket;
