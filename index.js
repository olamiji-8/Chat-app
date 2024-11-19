const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000; 

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("message", (msg) => {
        io.emit("message", msg); 
    });
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
