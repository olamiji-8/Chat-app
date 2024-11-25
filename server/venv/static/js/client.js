const chatBody = document.getElementById("chat-body");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

const botAvatar = "/static/bot-avatar.png";
const userAvatar = "/static/user-avatar.png";
const socket = io("http://localhost:4000"); 

let typingTimeout;

socket.on("message", (response) => {
  removeTypingIndicator();
  addMessage(response, "bot");
});

socket.on("typing", () => {
  showTypingIndicator("bot");
});

socket.on("stop_typing", () => {
  removeTypingIndicator();
});

sendBtn.addEventListener("click", () => sendMessage());
chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  } else {
    socket.emit("typing");
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("stop_typing");
    }, 1000);
  }
});

function sendMessage() {
  const message = chatInput.value.trim();
  if (message) {
    addMessage(message, "user");
    chatInput.value = "";
    socket.emit("stop_typing");
    socket.emit("message", message);
  }
}

function addMessage(text, sender) {
  const messageContainer = document.createElement("div");
  messageContainer.className = `message-container ${sender}`;
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

function showTypingIndicator(sender) {
  if (!document.getElementById("typing-indicator")) {
    const typingIndicator = document.createElement("div");
    typingIndicator.className = `message-container ${sender} typing-indicator`;
    typingIndicator.id = "typing-indicator";

    const avatar = document.createElement("img");
    avatar.className = "avatar";
    avatar.src = sender === "bot" ? botAvatar : userAvatar;

    const dots = document.createElement("div");
    dots.className = "typing-dots";
    dots.innerHTML = `<span></span><span></span><span></span>`;

    typingIndicator.appendChild(avatar);
    typingIndicator.appendChild(dots);

    chatBody.appendChild(typingIndicator);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
}

function removeTypingIndicator() {
  const typingIndicator = document.getElementById("typing-indicator");
  if (typingIndicator) {
    chatBody.removeChild(typingIndicator);
  }
}
