import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import { app as mainApp, server as mainServer } from "./socket/socket.js";

dotenv.config();

const __dirname = path.resolve();
const MAIN_PORT = process.env.PORT || 5000;
const BACKUP_PORT = process.env.BACKUP_PORT || 5001;

const backupApp = express();

backupApp.use(express.json());
backupApp.use(cookieParser());
backupApp.use("/api/auth", authRoutes);
backupApp.use("/api/messages", messageRoutes);
backupApp.use("/api/users", userRoutes);
backupApp.use(express.static(path.join(__dirname, "/frontend/dist")));

backupApp.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

const startBackupServer = (port) => {
    backupApp.listen(port, () => {
        connectToMongoDB();
        console.log(`Backup Server Running on port ${port}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is in use, trying port ${BACKUP_PORT}`);
            startBackupServer(BACKUP_PORT);
        } else {
            console.error(err);
        }
    });
};

startBackupServer(MAIN_PORT);
