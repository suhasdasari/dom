document.addEventListener("DOMContentLoaded", function () {
  const landingPage = document.getElementById("landing-page");
  const mainInterface = document.getElementById("main-interface");
  const getStartedBtn = document.getElementById("get-started-btn");
  const micBtn = document.getElementById("mic-btn");
  const closeBtn = document.getElementById("close-btn");
  const messageInput = document.getElementById("message-input");
  const sendBtn = document.getElementById("send-btn");
  const messagesContainer = document.getElementById("conversation-messages");

  // Show main interface when Get Started is clicked
  getStartedBtn.addEventListener("click", function () {
    landingPage.classList.remove("active");
    mainInterface.classList.add("active");
    // Focus on the message input when entering the chat
    setTimeout(() => {
      messageInput.focus();
    }, 300);
  });

  // Handle send button click
  sendBtn.addEventListener("click", function () {
    sendMessage();
  });

  // Handle Enter key in message input
  messageInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Handle microphone button click
  micBtn.addEventListener("click", function () {
    console.log("Microphone button clicked");
    // Add your microphone functionality here
    // For example: start/stop recording, toggle mute, etc.
  });

  // Handle close button click
  closeBtn.addEventListener("click", function () {
    console.log("Close button clicked");
    // Return to landing page
    mainInterface.classList.remove("active");
    landingPage.classList.add("active");
  });

  // Function to send message
  async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessageToChat(message, "user");
    messageInput.value = "";
    sendBtn.disabled = true;

    try {
      // Send message to Ollama API
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-oss:20b",
          prompt: message,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botResponse =
        data.response || "Sorry, I could not generate a response.";

      // Add bot response to chat
      addMessageToChat(botResponse, "bot");
    } catch (error) {
      console.error("Error sending message:", error);
      addMessageToChat(
        "Sorry, I encountered an error. Please make sure Ollama is running and the gpt-oss:20b model is available.",
        "bot"
      );
    } finally {
      sendBtn.disabled = false;
      messageInput.focus();
    }
  }

  // Function to add message to chat
  function addMessageToChat(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}-message`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";
    contentDiv.textContent = message;

    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Add some interactive feedback
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("mousedown", function () {
      this.style.transform = "scale(0.95)";
    });

    button.addEventListener("mouseup", function () {
      this.style.transform = "";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "";
    });
  });
});
