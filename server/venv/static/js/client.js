const chatBody = document.getElementById("chat-body");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

const socket = io("http://localhost:5000");


const botAvatar = "/static/bot-avatar.png"; 
const userAvatar = "/static/user-avatar.png"; 

socket.on("message", (response) => {
  addMessage(response, "bot");
});

sendBtn.addEventListener("click", () => {
  sendMessage();
});

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
  const messageContainer = document.createElement("div");
  messageContainer.className = `message-container message ${sender}`;

  const avatar = document.createElement("img");
  avatar.className = "avatar";
  avatar.src = sender === "bot" ? botAvatar : userAvatar;

  const textBox = document.createElement("div");
  textBox.className = "text-box";
  textBox.textContent = text;

  messageContainer.appendChild(avatar);
  messageContainer.appendChild(textBox);

  chatBody.appendChild(messageContainer);

  chatBody.scrollTop = chatBody.scrollHeight;
}
document.addEventListener("DOMContentLoaded", () => {
  const plusIcon = document.querySelector(".plus-icon");
  const additionalIcons = document.querySelector(".additional-icons");
  const chatInput = document.getElementById("chat-input");

  plusIcon.addEventListener("click", () => {
    additionalIcons.classList.toggle("show");

    if (additionalIcons.classList.contains("show")) {
      chatInput.setAttribute("placeholder", "");
    } else {
      chatInput.setAttribute("placeholder", "Type Something Here");
    }
  });
});

