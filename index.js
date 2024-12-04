const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv").config();
const robotRoutes = require("./routes/robotRoutes");

const app = express();
const PORT = process.env.PORT || 5001;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4000",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use("/api", robotRoutes); 

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", async (msg) => {
    console.log(`Received message: ${msg}`);
    const userMessage = msg;

    let botResponse;
    if (userMessage.toLowerCase().includes("set alarm")) {
      botResponse = "Alarm set for 10 PM.";
    } else {
      try {
        const axios = require("axios");
        const response = await axios.post(
          `https://chat-app-cqha.onrender.com:${PORT}/api/robot-response`,
          { message: userMessage }
        );
        botResponse = response.data.reply;
      } catch (error) {
        botResponse = "Sorry, something went wrong!";
      }
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
