import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const __dirname = path.resolve();
// PORT should be assigned after calling dotenv.config() because we need to access the env variables.
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).send("Main Server is healthy");
});

// Notify backup server that main server is starting
const notifyBackupServer = () => {
    const options = {
        hostname: "localhost",
        port: 5001, // assuming backup server is running on port 5001 for this signal
        path: "/main-starting",
        method: "POST"
    };

    const req = http.request(options, (res) => {
        console.log("Notified backup server that main server is starting");
    });

    req.on("error", (err) => {
        console.error("Error notifying backup server:", err.message);
    });

    req.end();
};

// Attempt to start the main server with retries
const startMainServer = (retryCount = 0) => {
    const maxRetries = 5;
    const retryDelay = 3000; // 3 seconds

    server.listen(PORT, () => {
        connectToMongoDB();
        console.log(`Server Running on port ${PORT}`);
        notifyBackupServer();
    }).on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            if (retryCount < maxRetries) {
                console.log(`Port ${PORT} is in use, retrying in ${retryDelay / 1000} seconds...`);
                setTimeout(() => startMainServer(retryCount + 1), retryDelay);
            } else {
                console.error(`Failed to start server after ${maxRetries} retries.`);
            }
        } else {
            console.error(err);
        }
    });
};

startMainServer();
