// Auto-installer for REMOAI Desktop
// Downloads and installs Ollama and Whisper automatically

const { exec, spawn } = require("child_process");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const os = require("os");

const execAsync = promisify(exec);

class AutoInstaller {
  constructor() {
    this.isInstalling = false;
    this.installProgress = {
      ollama: { status: "pending", progress: 0 },
      whisper: { status: "pending", progress: 0 },
    };
  }

  async checkDependencies() {
    console.log("🔍 Checking dependencies...");

    const checks = await Promise.allSettled([
      this.checkOllama(),
      this.checkWhisper(),
    ]);

    console.log("Dependency check results:", {
      ollama: {
        status: checks[0].status,
        value: checks[0].value,
        reason: checks[0].reason,
      },
      whisper: {
        status: checks[1].status,
        value: checks[1].value,
        reason: checks[1].reason,
      },
    });

    return {
      ollama: checks[0].status === "fulfilled" && checks[0].value,
      whisper: checks[1].status === "fulfilled" && checks[1].value,
    };
  }

  async checkOllama() {
    try {
      console.log("🔍 Checking Ollama installation...");
      const { stdout, stderr } = await execAsync("ollama --version");
      console.log("✅ Ollama is installed");
      console.log("Ollama version:", stdout.trim());
      if (stderr) console.log("Ollama stderr:", stderr);
      return true;
    } catch (error) {
      console.log("❌ Ollama not found");
      console.log("Ollama check error:", error.message);
      return false;
    }
  }

  async checkWhisper() {
    console.log("🔍 Checking Whisper installation...");
    
    // Method 1: Try Python import
    try {
      const { stdout, stderr } = await execAsync('python3 -c "import whisper"');
      console.log("✅ Whisper is installed (Python import)");
      console.log("Whisper check stdout:", stdout);
      if (stderr) console.log("Whisper check stderr:", stderr);
      return true;
    } catch (error) {
      console.log("❌ Whisper not found via Python import");
      console.log("Whisper check error:", error.message);
    }

    // Method 2: Try whisper command directly
    try {
      const { stdout, stderr } = await execAsync("whisper --help");
      console.log("✅ Whisper is installed (command line)");
      console.log("Whisper command stdout:", stdout);
      if (stderr) console.log("Whisper command stderr:", stderr);
      return true;
    } catch (error) {
      console.log("❌ Whisper not found via command line");
      console.log("Whisper command error:", error.message);
    }

    // Method 3: Check if whisper is in PATH
    try {
      const { stdout } = await execAsync("which whisper");
      if (stdout.trim()) {
        console.log("✅ Whisper found in PATH:", stdout.trim());
        return true;
      }
    } catch (error) {
      console.log("❌ Whisper not in PATH");
    }

    console.log("❌ Whisper not found by any method");
    return false;
  }

  async installOllama() {
    console.log("📥 Installing Ollama...");
    this.installProgress.ollama.status = "installing";
    this.installProgress.ollama.progress = 10;

    try {
      const platform = os.platform();

      if (platform === "darwin") {
        // macOS - install via Homebrew
        this.installProgress.ollama.progress = 30;

        // Check if Homebrew is installed
        try {
          await execAsync("brew --version");
        } catch (error) {
          console.log("📥 Installing Homebrew...");
          const brewInstallScript =
            '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"';
          await execAsync(brewInstallScript);
        }

        this.installProgress.ollama.progress = 50;

        // Install Ollama
        await execAsync("brew install ollama");
        this.installProgress.ollama.progress = 80;

        // Start Ollama service
        await execAsync("ollama serve &");
        this.installProgress.ollama.progress = 100;
      } else if (platform === "linux") {
        // Linux - install via script
        this.installProgress.ollama.progress = 30;
        await execAsync("curl -fsSL https://ollama.ai/install.sh | sh");
        this.installProgress.ollama.progress = 80;
        await execAsync("ollama serve &");
        this.installProgress.ollama.progress = 100;
      } else if (platform === "win32") {
        // Windows - download installer
        this.installProgress.ollama.progress = 30;
        const { downloadFile } = require("./download-utils");
        const installerPath = path.join(os.tmpdir(), "ollama-installer.exe");

        await downloadFile("https://ollama.ai/download/windows", installerPath);
        this.installProgress.ollama.progress = 50;

        // Run installer silently
        await execAsync(`"${installerPath}" /S`);
        this.installProgress.ollama.progress = 80;

        // Start Ollama
        await execAsync("ollama serve &");
        this.installProgress.ollama.progress = 100;
      }

      this.installProgress.ollama.status = "completed";
      console.log("✅ Ollama installed successfully");

      // Pull the model
      await this.pullModel();
    } catch (error) {
      console.error("❌ Failed to install Ollama:", error);
      this.installProgress.ollama.status = "error";
      throw error;
    }
  }

  async installWhisper() {
    console.log("📥 Installing Whisper...");
    this.installProgress.whisper.status = "installing";
    this.installProgress.whisper.progress = 10;

    try {
      // Install Whisper via pip with --break-system-packages flag
      this.installProgress.whisper.progress = 30;
      console.log("Running: pip3 install openai-whisper --break-system-packages");
      
      // Add timeout to prevent hanging
      const installPromise = execAsync("pip3 install openai-whisper --break-system-packages");
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Installation timeout after 5 minutes")), 300000)
      );
      
      await Promise.race([installPromise, timeoutPromise]);
      console.log("✅ Whisper pip installation completed");

      this.installProgress.whisper.progress = 80;

      // Verify installation
      console.log("Verifying Whisper installation...");
      await execAsync(
        "python3 -c \"import whisper; print('Whisper installed successfully')\""
      );

      this.installProgress.whisper.progress = 100;
      this.installProgress.whisper.status = "completed";
      console.log("✅ Whisper installed successfully");
    } catch (error) {
      console.error("❌ Failed to install Whisper:", error);
      this.installProgress.whisper.status = "error";
      throw error;
    }
  }

  async pullModel() {
    console.log("🤖 Downloading AI model...");
    try {
      // Try to pull gpt-oss:20b first, fallback to llama2
      try {
        await execAsync("ollama pull gpt-oss:20b");
        console.log("✅ gpt-oss:20b model downloaded");
      } catch (error) {
        console.log("⚠️ gpt-oss:20b not available, downloading llama2...");
        await execAsync("ollama pull llama2");
        console.log("✅ llama2 model downloaded");
      }
    } catch (error) {
      console.error("❌ Failed to download model:", error);
      throw error;
    }
  }

  async installAll() {
    if (this.isInstalling) {
      console.log("⏳ Installation already in progress...");
      return;
    }

    this.isInstalling = true;
    console.log("🚀 Starting automatic installation...");

    try {
      // Check what needs to be installed
      const deps = await this.checkDependencies();

      const installTasks = [];

      if (!deps.ollama) {
        installTasks.push(this.installOllama());
      } else {
        this.installProgress.ollama.status = "completed";
        this.installProgress.ollama.progress = 100;
      }

      if (!deps.whisper) {
        installTasks.push(this.installWhisper());
      } else {
        this.installProgress.whisper.status = "completed";
        this.installProgress.whisper.progress = 100;
      }

      // Install missing dependencies
      if (installTasks.length > 0) {
        console.log(`Installing ${installTasks.length} missing dependencies...`);
        try {
          await Promise.all(installTasks);
        } catch (error) {
          console.error("❌ One or more installations failed:", error);
          throw error;
        }
      } else {
        console.log("✅ All dependencies are already installed");
      }

      console.log("🎉 All dependencies installed successfully!");
      return true;
    } catch (error) {
      console.error("❌ Installation failed:", error);
      return false;
    } finally {
      this.isInstalling = false;
    }
  }

  getProgress() {
    return this.installProgress;
  }

  isInstallingInProgress() {
    return this.isInstalling;
  }
}

module.exports = AutoInstaller;
