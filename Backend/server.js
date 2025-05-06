import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDb from "./config/connectdb.js";
import cookieParser from "cookie-parser";
import authRouter from "./router/authRouter.js";
import path from "path";
import { fileURLToPath } from "url";
import contactRoute from "./router/contactRouter.js";
import setupSocket from "./socket.js";
import messageRoute from "./router/messageRouter.js";
import channelRoute from "./router/channelRouter.js";

const app = express();
app.use(
    cors({
        origin:"http://localhost:5173",
        methods:["GET","POST","PUT","DELETE","PATCH"],
        credentials:true
    })
)

app.use(cookieParser())
app.use(express.json())

app.use("/api/auth",authRouter)
app.use("/api/contacts",contactRoute)
app.use("/api/messages",messageRoute)
app.use("/api/channel",channelRoute)
// app.use("/uploads/profiles", express.static("uploads/profiles"))


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads/file", express.static(path.join(__dirname, "uploads/file")));

const PORT = 5000
connectDb()
    .then(() => {
        const server = app.listen(PORT, () => {
            console.log("Database is connected");
            console.log(`Server running on http://localhost:${PORT}`);
        });

        setupSocket(server);
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
        process.exit(1); // Stop process if DB connection fails
    });

