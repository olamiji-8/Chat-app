const chatBody = document.getElementById("chat-body");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const socket = io("http://localhost:5000");
socket.on("message", (response) => {
    addMessage(response, "bot");
  });
  sendBtn.addEventListener("click", sendMessage);
  
  chatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  });
  function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
      addMessage(message, "user");
      socket.emit("message", message); 
      chatInput.value = ""; 
    }
  }
  function addMessage(text, sender) {
    const messageElement = document.createElement("div");
    messageElement.className = `message ${sender}`;
    messageElement.textContent = text;
  
    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight;
  }