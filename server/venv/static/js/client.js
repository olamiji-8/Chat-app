const chatBody = document.getElementById("chat-body");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const plusIcon = document.querySelector(".plus-icon");
const additionalIcons = document.querySelector(".additional-icons");

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const socketUrl = isLocal
  ? "http://localhost:4000"
  : "https://chat-app-1-co8u.onrender.com";

const socket = io(socketUrl);


socket.on("message", (response) => {
  const { text, image } = response.text;
  addMessage(text, image, "bot");
  adjustChatBodyScroll(); 
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

chatInput.addEventListener("focus", () => {
  additionalIcons.classList.remove("show");
});

function sendMessage() {
  const message = chatInput.value.trim();
  if (message) {
    addMessage(message, null, "user"); 
    chatInput.value = ""; 
    socket.emit("message", message); 
  }
}

function adjustChatBodyScroll() {
  const chatBody = document.getElementById("chat-body");
  chatBody.scrollTop = chatBody.scrollHeight; // Keep the chat view scrolled to the latest message
}

function addMessage(text, image, sender) {
  removeTypingIndicator();

  const messageContainer = document.createElement("div");
  messageContainer.className = `message-container ${sender}`;

  const avatar = document.createElement("img");
  avatar.className = "avatar";
  avatar.src = sender === "bot" ? botAvatar : userAvatar;

  const contentBox = document.createElement("div");
  contentBox.className = "content-box unified-box"; // Unified border

  if (text) {
    const textBox = document.createElement("div");
    textBox.className = "text-box";
    textBox.innerHTML = formatMessageWithLinks(text); // Add URL support
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

function formatMessageWithLinks(message) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return message.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" class="message-link">${url}</a>`;
  });
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
  plusIcon.addEventListener("click", () => {
    additionalIcons.classList.toggle("show");
  });

  chatInput.addEventListener("focus", () => {
    additionalIcons.classList.remove("show");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const assistantNameElement = document.getElementById("assistant-name");

  const fetchAssistantName = async () => {
    try {
      const response = await fetch('/api/assistant-name');
      const data = await response.json();
      const assistantName = data.name || "Assistant"; 
      assistantNameElement.textContent = assistantName;
    } catch (error) {
      assistantNameElement.textContent = "@Olapelu";
    }
  };

  fetchAssistantName();
});