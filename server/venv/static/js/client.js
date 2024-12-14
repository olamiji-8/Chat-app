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

plusIcon.addEventListener("click", () => {
  // Clear the placeholder text
  chatInput.placeholder = "";

  // Move the additional icons closer to the plus icon
  additionalIcons.style.transform = "translateX(-5%)"; // Adjust the value as needed
});

chatInput.addEventListener("focus", () => {
  additionalIcons.classList.remove("show");

  // If the input is empty, restore the placeholder text
  if (!chatInput.value.trim()) {
    chatInput.placeholder = "Type Something Here"; // Replace with your desired placeholder text
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

  // Add timestamp
  const timestamp = document.createElement("div");
  timestamp.className = "timestamp";
  const currentTime = new Date();
  timestamp.textContent = formatTime(currentTime);

  contentBox.appendChild(timestamp);

  messageContainer.appendChild(avatar);
  messageContainer.appendChild(contentBox);
  chatBody.appendChild(messageContainer);

  chatBody.scrollTop = chatBody.scrollHeight;
}

function formatTime(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  const ampm = hours >= 12 ? "PM" : "AM";
  return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
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

function formatMessageWithLinks(message) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return message.replace(urlRegex, (url) => {
    if (isYouTubeLink(url)) {
      return `
        <iframe 
          class="embedded-media"
          width="100%" 
          height="315" 
          src="https://www.youtube.com/embed/${extractYouTubeID(url)}" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>`;
    } else if (isSpotifyLink(url)) {
      return `
        <iframe 
          class="embedded-media"
          src="https://open.spotify.com/embed/track/${extractSpotifyID(url)}" 
          width="100%" 
          height="80" 
          frameborder="0" 
          allowtransparency="true" 
          allow="encrypted-media">
        </iframe>`;
    } else if (isVideoLink(url)) {
      return `
        <video controls class="embedded-media">
          <source src="${url}" type="video/mp4">
          Your browser does not support the video tag.
        </video>`;
    } else if (isAudioLink(url)) {
      return `
        <audio controls class="embedded-media">
          <source src="${url}" type="audio/mpeg">
          Your browser does not support the audio tag.
        </audio>`;
    } else {
      return `<a href="${url}" target="_blank" class="message-link">${url}</a>`;
    }
  });
}

// Helper functions to detect links and extract IDs
function isYouTubeLink(url) {
  return /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)/.test(url);
}

function extractYouTubeID(url) {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function isSpotifyLink(url) {
  return /(?:https?:\/\/)?(?:open\.spotify\.com\/track\/)/.test(url);
}

function extractSpotifyID(url) {
  const match = url.match(/track\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

function isVideoLink(url) {
  return /\.(mp4|webm|ogg)$/i.test(url);
}

function isAudioLink(url) {
  return /\.(mp3|wav|ogg)$/i.test(url);
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