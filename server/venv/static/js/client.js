const chatBody = document.getElementById("chat-body");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const socket = io("http://localhost:5000");
socket.on("message", (response) => {
  addMessage(response, "bot");
});

sendBtn.addEventListener("click", () => {
  const message = chatInput.value;
  if (message) {
    addMessage(message, "user");
    socket.emit("message", message); 
    chatInput.value = "";
  }
});
function addMessage(text, sender) {
  const messageElem = document.createElement("div");
  messageElem.className = `message ${sender}`;
  messageElem.textContent = text;
  chatBody.appendChild(messageElem);
  chatBody.scrollTop = chatBody.scrollHeight; 
}
