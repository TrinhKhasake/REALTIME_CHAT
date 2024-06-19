import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import http from "http";

dotenv.config();

const __dirname = path.resolve();
const MAIN_PORT = process.env.PORT || 5000;
const BACKUP_SERVER_PORT = process.env.BACKUP_PORT || 5001;

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

const mainServerUrl = `http://localhost:${MAIN_PORT}/health`;

let backupServerInstance = null;
let isBackupActive = false;

function startBackupServer() {
    if (backupServerInstance || isBackupActive) {
        console.log("Backup server is already running or activating.");
        return;
    }

    isBackupActive = true;

    backupServerInstance = backupApp.listen(MAIN_PORT, () => {
        connectToMongoDB();
        console.log(`Backup Server Running on port ${MAIN_PORT}`);
    }).on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.log(`Port ${MAIN_PORT} is in use, waiting for it to be available.`);
            backupServerInstance = null;
            isBackupActive = false;
        } else {
            console.error(err);
        }
    });
}

function stopBackupServer() {
    if (backupServerInstance) {
        backupServerInstance.close(() => {
            console.log("Backup server shut down.");
            backupServerInstance = null;
            isBackupActive = false;
        });
    }
}

function checkMainServer() {
    http.get(mainServerUrl, (res) => {
        if (res.statusCode === 200) {
            if (backupServerInstance) {
                console.log("Main Server is up, shutting down backup server");
                stopBackupServer();
            }
        } else {
            console.log("Main Server is down, starting backup server");
            startBackupServer();
        }
    }).on("error", (err) => {
        console.log("Main Server is down", err.message);
        startBackupServer();
    });
}

// Endpoint to handle main server starting notification
backupApp.post("/main-starting", (req, res) => {
    console.log("Received main server starting notification");
    stopBackupServer();
    res.status(200).send("Backup server will shut down");
});

// Start backup server on BACKUP_SERVER_PORT to listen for main server start notifications
backupApp.listen(BACKUP_SERVER_PORT, () => {
    console.log(`Backup control server running on port ${BACKUP_SERVER_PORT}`);
});

// Initial check
checkMainServer();

// Periodically check every 1 second
setInterval(checkMainServer, 1000);
