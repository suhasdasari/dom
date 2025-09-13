document.addEventListener("DOMContentLoaded", function () {
  const landingPage = document.getElementById("landing-page");
  const installationScreen = document.getElementById("installation-screen");
  const mainInterface = document.getElementById("main-interface");
  const getStartedBtn = document.getElementById("get-started-btn");
  const micBtn = document.getElementById("mic-btn");
  const closeBtn = document.getElementById("close-btn");
  const messageInput = document.getElementById("message-input");
  const sendBtn = document.getElementById("send-btn");
  const messagesContainer = document.getElementById("conversation-messages");

  // Check if we're in Electron (packaged app)
  const isElectron = window.require !== undefined;

  // Initialize app based on environment
  if (isElectron) {
    initializeElectronApp();
  } else {
    initializeWebApp();
  }

  // Initialize Electron app with auto-installer
  async function initializeElectronApp() {
    try {
      // Show installation screen first
      landingPage.classList.remove("active");
      installationScreen.classList.add("active");

      // Check dependencies
      const deps = await window.electronAPI.checkDependencies();

      if (deps.ollama && deps.whisper) {
        // All dependencies installed, go to main interface
        showMainInterface();
      } else {
        // Install missing dependencies
        await installDependencies();
        showMainInterface();
      }
    } catch (error) {
      console.error("Failed to initialize app:", error);
      showMainInterface(); // Fallback to main interface
    }
  }

  // Initialize web app (development)
  function initializeWebApp() {
    // Web app doesn't need auto-installer
    showLandingPage();
  }

  // Show landing page
  function showLandingPage() {
    landingPage.classList.add("active");
    installationScreen.classList.remove("active");
    mainInterface.classList.remove("active");
  }

  // Show main interface
  function showMainInterface() {
    landingPage.classList.remove("active");
    installationScreen.classList.remove("active");
    mainInterface.classList.add("active");

    // Focus on the message input when entering the chat
    setTimeout(() => {
      messageInput.focus();
      // Check microphone permission on startup
      checkMicrophonePermission();
    }, 300);
  }

  // Install dependencies with progress tracking
  async function installDependencies() {
    updateStatusMessage("Installing required components...");

    // Start installation
    const success = await window.electronAPI.installDependencies();

    if (success) {
      updateStatusMessage("Installation completed successfully!");
    } else {
      updateStatusMessage(
        "Installation failed. Please check the console for details."
      );
    }

    return success;
  }

  // Update installation progress
  function updateInstallationProgress(progress) {
    // Update Ollama progress
    const ollamaProgress = document.getElementById("ollama-progress");
    const ollamaIcon = ollamaProgress.querySelector(".status-icon");
    const ollamaPercent = ollamaProgress.querySelector(".progress-percent");
    const ollamaFill = ollamaProgress.querySelector(".progress-fill");

    ollamaIcon.textContent =
      progress.ollama.status === "completed"
        ? "✅"
        : progress.ollama.status === "installing"
        ? "⏳"
        : progress.ollama.status === "error"
        ? "❌"
        : "⏳";
    ollamaPercent.textContent = `${progress.ollama.progress}%`;
    ollamaFill.style.width = `${progress.ollama.progress}%`;

    // Update Whisper progress
    const whisperProgress = document.getElementById("whisper-progress");
    const whisperIcon = whisperProgress.querySelector(".status-icon");
    const whisperPercent = whisperProgress.querySelector(".progress-percent");
    const whisperFill = whisperProgress.querySelector(".progress-fill");

    whisperIcon.textContent =
      progress.whisper.status === "completed"
        ? "✅"
        : progress.whisper.status === "installing"
        ? "⏳"
        : progress.whisper.status === "error"
        ? "❌"
        : "⏳";
    whisperPercent.textContent = `${progress.whisper.progress}%`;
    whisperFill.style.width = `${progress.whisper.progress}%`;
  }

  // Update status message
  function updateStatusMessage(message) {
    const statusElement = document.getElementById("status-message");
    if (statusElement) {
      statusElement.textContent = message;
    }
  }

  // Show main interface when Get Started is clicked (for web app)
  getStartedBtn.addEventListener("click", function () {
    if (!isElectron) {
      showMainInterface();
    }
  });

  // Check microphone permission on startup
  async function checkMicrophonePermission() {
    try {
      // Try to get microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop immediately - we just wanted to check permission
      stream.getTracks().forEach((track) => track.stop());
      console.log("Microphone permission granted");
    } catch (err) {
      console.log("Microphone permission not granted yet");
      // Don't show error on startup, just log it
    }
  }

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
  micBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    console.log("Microphone button clicked");

    // Check if we're in Electron and request permissions
    if (window.require) {
      requestMicrophonePermission()
        .then(() => {
          toggleRecording();
        })
        .catch((err) => {
          console.error("Permission denied:", err);
          addMessageToChat(
            "Microphone permission is required. Please allow microphone access in System Preferences > Security & Privacy > Microphone, then restart the app.",
            "bot"
          );
        });
    } else {
      toggleRecording();
    }
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
      // Persona: Remo, a general-purpose AI personal assistant
      const personaPreamble =
        "You are Remo, a helpful, friendly, proactive AI personal assistant. You help users with everyday tasks such as reminders, to-dos, planning, ordering food, finding information, and breaking down steps. Speak in first person as Remo, be concise but warm, and always consider actionable next steps. If something requires real-world actions (like ordering food), explain how you would proceed and ask for required details.";

      const fullPrompt = `${personaPreamble}\n\nUser: ${message}\nRemo:`;

      // Send message to Ollama API
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-oss:20b",
          prompt: fullPrompt,
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

  // Voice recording and transcription
  let mediaRecorder = null;
  let recordedChunks = [];
  let isRecording = false;

  // Request microphone permission for Electron
  async function requestMicrophonePermission() {
    try {
      // First try to get media stream to trigger permission request
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1,
          sampleRate: 48000,
        },
      });

      // Stop the stream immediately - we just wanted to trigger permission
      stream.getTracks().forEach((track) => track.stop());

      return Promise.resolve();
    } catch (err) {
      console.error("Microphone permission error:", err);
      throw new Error(
        "Microphone access denied. Please allow microphone access and try again."
      );
    }
  }

  async function toggleRecording() {
    // Prevent multiple rapid clicks
    if (micBtn.disabled) return;

    try {
      if (!isRecording) {
        micBtn.disabled = true;
        await startRecording();
        micBtn.disabled = false;
      } else {
        micBtn.disabled = true;
        await stopRecording();
        micBtn.disabled = false;
      }
    } catch (err) {
      console.error("Recording error:", err);
      setMicVisualState(false);
      isRecording = false;
      micBtn.disabled = false;
    }
  }

  function setMicVisualState(active) {
    if (active) {
      micBtn.classList.add("recording");
    } else {
      micBtn.classList.remove("recording");
    }
  }

  async function startRecording() {
    // Request mic with reasonable constraints
    const stream = await navigator.mediaDevices
      .getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1,
          sampleRate: 48000,
        },
      })
      .catch((err) => {
        console.error("Microphone access denied:", err);

        // Check if we're in Electron (packaged app)
        if (window.require) {
          throw new Error(
            "Microphone access denied. Please:\n1. Go to System Preferences > Security & Privacy > Microphone\n2. Check the box next to REMOAI Desktop\n3. Restart the app and try again."
          );
        } else {
          throw new Error(
            "Microphone access is required. Please allow microphone access and try again."
          );
        }
      });

    recordedChunks = [];

    // Prefer Opus in WebM which backend expects
    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : MediaRecorder.isTypeSupported("audio/webm")
      ? "audio/webm"
      : "";

    mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = async () => {
      try {
        const blob = new Blob(recordedChunks, {
          type: mimeType || "audio/webm",
        });

        // Check if we have any audio data
        if (blob.size === 0) {
          throw new Error("No audio recorded. Please try speaking louder.");
        }

        const base64Audio = await blobToBase64(blob);

        // Send to backend Whisper endpoint
        const resp = await fetch("http://localhost:3001/api/transcribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            audioData: base64Audio,
            audioFormat: "webm",
          }),
        });

        let result;
        if (!resp.ok) {
          // Try to read error payload to show a helpful message
          try {
            const errJson = await resp.json();
            throw new Error(errJson.error || `HTTP ${resp.status}`);
          } catch (_) {
            throw new Error(`Transcription failed: HTTP ${resp.status}`);
          }
        } else {
          result = await resp.json();
          if (!result.success) {
            throw new Error(result.error || "Transcription unsuccessful");
          }
        }

        const text = (result.transcription || "").trim();
        if (text) {
          messageInput.value = text;
          await sendMessage();
        } else {
          addMessageToChat(
            "I didn't catch that. Please try speaking more clearly.",
            "bot"
          );
        }
      } catch (err) {
        console.error("Transcription error:", err);
        const friendly =
          (err && err.message) ||
          "Sorry, I couldn't transcribe your audio. Please try again.";
        addMessageToChat(`Transcription error: ${friendly}`, "bot");
      } finally {
        // Stop all tracks to release the mic
        try {
          mediaRecorder &&
            mediaRecorder.stream &&
            mediaRecorder.stream.getTracks().forEach((t) => t.stop());
        } catch (_) {}
        isRecording = false;
        setMicVisualState(false);
      }
    };

    mediaRecorder.start();
    isRecording = true;
    setMicVisualState(true);
  }

  async function stopRecording() {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      isRecording = false;
      setMicVisualState(false);
    }
  }

  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        const base64 = typeof dataUrl === "string" ? dataUrl.split(",")[1] : "";
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
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
