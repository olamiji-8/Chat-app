const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001; 
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4000", 
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", (msg) => {
    console.log(`Received message: ${msg}`);
    const userMessage = msg;
   
    let botResponse;
    if (userMessage.toLowerCase().includes("set alarm")) {
      botResponse = "Alarm set for 10 PM.";
    } else {
      botResponse = "I'm here to assist you.";
    }
    io.emit("message", botResponse);
  });

  socket.on("disconnect", () => {

    console.log("A user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
