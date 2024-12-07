const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv").config();
const robotRoutes = require("./routes/robotRoutes");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5001;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://chat-app-1-co8u.onrender.com", "http://localhost:4000"],
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use("/api", robotRoutes);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", async (msg) => {
    try {
      console.log(`Received message: ${msg}`);
      const userMessage = msg;

      let botResponse;
      if (userMessage.toLowerCase().includes("set alarm")) {
        botResponse = "Alarm set for 10 PM.";
      } else {
        try {
          const response = await axios.post(
            `http://localhost:5000/api/robot-response`,
            { message: userMessage }
          );
          botResponse = response.data.reply;
        } catch (error) {
          console.error("Error making API request:", error.message);
          botResponse = "Sorry, I couldn't process your request.";
        }
      }

      // Emit response only to the sender
      socket.emit("message", botResponse);
    } catch (error) {
      console.error("Error processing message:", error);
      socket.emit("message", "An error occurred while processing your message.");
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
