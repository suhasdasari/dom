document.addEventListener("DOMContentLoaded", function () {
  const landingPage = document.getElementById("landing-page");
  const mainInterface = document.getElementById("main-interface");
  const getStartedBtn = document.getElementById("get-started-btn");
  const micBtn = document.getElementById("mic-btn");
  const closeBtn = document.getElementById("close-btn");
  const messageInput = document.getElementById("message-input");
  const sendBtn = document.getElementById("send-btn");
  const chatMessages = document.getElementById("chat-messages");

  // Conversation state
  let isWaitingForResponse = false;
  let conversationHistory = [];

  // Show main interface when Get Started is clicked
  getStartedBtn.addEventListener("click", function () {
    landingPage.classList.remove("active");
    mainInterface.classList.add("active");
    // Focus on input when entering conversation
    setTimeout(() => messageInput.focus(), 100);
  });

  // Handle send message
  function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || isWaitingForResponse) return;

    // Add user message to chat
    addMessageToChat(message, "user");

    // Add to conversation history
    conversationHistory.push({ role: "user", content: message });

    messageInput.value = "";

    // Disable input while waiting for response
    setWaitingState(true);

    // Send to Ollama with context
    sendToOllama(message);
  }

  // Send message on button click
  sendBtn.addEventListener("click", sendMessage);

  // Send message on Enter key
  messageInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Add message to chat UI
  function addMessageToChat(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}-message`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";
    contentDiv.textContent = message;

    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Set waiting state for input
  function setWaitingState(waiting) {
    isWaitingForResponse = waiting;
    sendBtn.disabled = waiting;
    messageInput.disabled = waiting;

    if (waiting) {
      sendBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                </svg>
            `;
    } else {
      sendBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                </svg>
            `;
    }
  }

  // Build context prompt from conversation history
  function buildContextPrompt(currentMessage) {
    let contextPrompt =
      "You are a helpful AI assistant. Here's our conversation so far:\n\n";

    // Add recent conversation history (last 10 exchanges to keep context manageable)
    const recentHistory = conversationHistory.slice(-10);
    for (const msg of recentHistory) {
      contextPrompt += `${msg.role === "user" ? "Human" : "Assistant"}: ${
        msg.content
      }\n`;
    }

    contextPrompt += `\nHuman: ${currentMessage}\nAssistant:`;
    return contextPrompt;
  }

  // Send message to Ollama
  async function sendToOllama(message) {
    try {
      // Build context-aware prompt
      const contextPrompt = buildContextPrompt(message);

      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-oss:20b",
          prompt: contextPrompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 500,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botResponse =
        data.response || "Sorry, I could not generate a response.";

      // Add bot response to conversation history
      conversationHistory.push({ role: "assistant", content: botResponse });

      // Add bot response to chat
      addMessageToChat(botResponse, "bot");
    } catch (error) {
      console.error("Error calling Ollama:", error);
      const errorMessage =
        "Sorry, I encountered an error. Please make sure Ollama is running and the gpt-oss:20b model is loaded.";
      addMessageToChat(errorMessage, "bot");
      conversationHistory.push({ role: "assistant", content: errorMessage });
    } finally {
      setWaitingState(false);
      messageInput.focus();
    }
  }

  // Handle microphone button click
  micBtn.addEventListener("click", function () {
    console.log("Microphone button clicked");
    // Add your microphone functionality here
    // For example: start/stop recording, toggle mute, etc.
  });

  // Clear conversation
  function clearConversation() {
    conversationHistory = [];
    chatMessages.innerHTML = `
            <div class="message bot-message">
                <div class="message-content">
                    Hello! I'm your AI assistant powered by GPT OSS 20b. How can I help you today?
                </div>
            </div>
        `;
  }

  // Handle close button click
  closeBtn.addEventListener("click", function () {
    console.log("Close button clicked");
    // Clear conversation and return to landing page
    clearConversation();
    mainInterface.classList.remove("active");
    landingPage.classList.add("active");
  });

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
