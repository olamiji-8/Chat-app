const chatBody = document.getElementById("chat-body");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const socketUrl = isLocal
  ? "http://localhost:4000"
  : "https://chat-app-1-co8u.onrender.com";

const socket = io(socketUrl);

socket.on("message", (response) => {
  console.log("Server Response:", response); 
  const { text, image } = response.text;
  addMessage(text, image, "bot");
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
  }
});

function sendMessage() {
  const message = chatInput.value.trim();
  if (message) {
    addMessage(message, null, "user"); 
    chatInput.value = ""; 
    socket.emit("message", message); 
  }
}

function addMessage(text, image, sender) {
  removeTypingIndicator();

  const messageContainer = document.createElement("div");
  messageContainer.className = `message-container ${sender}`; 

  const avatar = document.createElement("img");
  avatar.className = "avatar";
  avatar.src = sender === "bot" ? botAvatar : userAvatar;

  const contentBox = document.createElement("div");
  contentBox.className = "content-box";

  if (text) {
    const textBox = document.createElement("div");
    textBox.className = "text-box";
    textBox.textContent = text;
    contentBox.appendChild(textBox);
  }

  if (image) {
    const imageBox = document.createElement("img");
    imageBox.className = "image-box";
    imageBox.src = image;
    contentBox.appendChild(imageBox);
  }

  messageContainer.appendChild(avatar);
  messageContainer.appendChild(contentBox);
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

document.addEventListener("DOMContentLoaded", () => {
  const plusIcon = document.querySelector(".plus-icon");
  const additionalIcons = document.querySelector(".additional-icons");

  plusIcon.addEventListener("click", () => {
    additionalIcons.classList.toggle("show");

    if (additionalIcons.classList.contains("show")) {
      chatInput.setAttribute("placeholder", "");
    } else {
      chatInput.setAttribute("placeholder", "Type Something Here");
    }
  });
});