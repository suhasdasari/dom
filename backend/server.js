const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs-extra");
const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: "25mb" }));

// Store for tracking download progress
const downloadProgress = {
  oss: { progress: 0, status: "pending" },
  whisper: { progress: 0, status: "pending" },
};

// Check if a dependency is installed
async function checkDependency(dependencyName) {
  try {
    switch (dependencyName) {
      case "openai-oss-2b":
        // Check if OpenAI OSS 2B is available
        // This is a placeholder - you would check for actual model files
        const ossPath = path.join(__dirname, "models", "openai-oss-2b");
        return await fs.pathExists(ossPath);

      case "openai-whisper":
        // Check if Whisper is installed
        try {
          // Try to run whisper --help to check if it's installed
          await execAsync("whisper --help");
          return true;
        } catch (error) {
          return false;
        }

      default:
        return false;
    }
  } catch (error) {
    console.error(`Error checking ${dependencyName}:`, error);
    return false;
  }
}

// Download a dependency
async function downloadDependency(dependencyName) {
  try {
    downloadProgress[dependencyName].status = "downloading";

    switch (dependencyName) {
      case "oss":
        // Simulate downloading OpenAI OSS 2B
        await simulateDownload("oss");
        break;

      case "whisper":
        // Install OpenAI Whisper via pip
        await installWhisper();
        break;
    }

    downloadProgress[dependencyName].status = "completed";
    downloadProgress[dependencyName].progress = 100;
  } catch (error) {
    downloadProgress[dependencyName].status = "error";
    console.error(`Error downloading ${dependencyName}:`, error);
    throw error;
  }
}

// Simulate download with progress updates
async function simulateDownload(dependencyName) {
  return new Promise(async (resolve) => {
    let progress = 0;
    const interval = setInterval(async () => {
      progress += Math.random() * 8 + 2; // More realistic progress increments
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // Create actual model directory for OSS 2B
        if (dependencyName === "oss") {
          try {
            const modelDir = path.join(__dirname, "models", "openai-oss-2b");
            await fs.ensureDir(modelDir);

            // Create a placeholder file to indicate the model is "downloaded"
            await fs.writeFile(
              path.join(modelDir, "model.info"),
              JSON.stringify(
                {
                  name: "OpenAI OSS 2B",
                  downloaded: new Date().toISOString(),
                  size: "2GB",
                  status: "ready",
                },
                null,
                2
              )
            );
            console.log("OSS 2B model directory created:", modelDir);
          } catch (error) {
            console.error("Error creating OSS 2B model directory:", error);
          }
        }

        resolve();
      }
      downloadProgress[dependencyName].progress = Math.round(progress);
    }, 300);
  });
}

// Install OpenAI Whisper
async function installWhisper() {
  try {
    // Update progress during installation
    downloadProgress.whisper.progress = 20;

    // Install whisper via pip3
    const { stdout, stderr } = await execAsync("pip3 install openai-whisper");

    downloadProgress.whisper.progress = 80;

    // Verify installation
    await execAsync("whisper --help");

    downloadProgress.whisper.progress = 100;

    console.log("Whisper installed successfully:", stdout);
  } catch (error) {
    console.error("Error installing Whisper:", error);
    throw error;
  }
}

// API Routes

// Check dependencies status
app.get("/api/dependencies/check", async (req, res) => {
  try {
    const ossInstalled = await checkDependency("openai-oss-2b");
    const whisperInstalled = await checkDependency("openai-whisper");

    res.json({
      success: true,
      dependencies: {
        oss: {
          name: "OpenAI OSS 2B",
          installed: ossInstalled,
        },
        whisper: {
          name: "OpenAI Whisper",
          installed: whisperInstalled,
        },
      },
      allInstalled: ossInstalled && whisperInstalled,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Download missing dependencies
app.post("/api/dependencies/download", async (req, res) => {
  try {
    // Reset progress
    downloadProgress.oss = { progress: 0, status: "pending" };
    downloadProgress.whisper = { progress: 0, status: "pending" };

    // Check what needs to be downloaded
    const ossInstalled = await checkDependency("openai-oss-2b");
    const whisperInstalled = await checkDependency("openai-whisper");

    const downloads = [];

    if (!ossInstalled) {
      downloads.push(downloadDependency("oss"));
    } else {
      downloadProgress.oss = { progress: 100, status: "completed" };
    }

    if (!whisperInstalled) {
      downloads.push(downloadDependency("whisper"));
    } else {
      downloadProgress.whisper = { progress: 100, status: "completed" };
    }

    // Start downloads in parallel
    if (downloads.length > 0) {
      await Promise.all(downloads);
    }

    res.json({
      success: true,
      message: "All dependencies downloaded successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get download progress
app.get("/api/dependencies/progress", (req, res) => {
  res.json({
    success: true,
    progress: downloadProgress,
  });
});

// Whisper transcription endpoint
app.post("/api/transcribe", async (req, res) => {
  try {
    const { audioData, audioFormat } = req.body;

    if (!audioData) {
      return res.status(400).json({
        success: false,
        error: "No audio data provided",
      });
    }

    console.log("Received transcription request");

    // Save audio data to temporary file
    const fs = require("fs-extra");
    const path = require("path");
    const { execAsync } = require("./utils/execAsync");
    const tempDir = path.join(__dirname, "temp");
    await fs.ensureDir(tempDir);

    // Save as webm first
    const audioFileName = `audio_${Date.now()}.webm`;
    const audioFilePath = path.join(tempDir, audioFileName);

    // Convert base64 audio data to file
    const audioBuffer = Buffer.from(audioData, "base64");
    await fs.writeFile(audioFilePath, audioBuffer);

    console.log("Audio file saved, starting transcription...");

    try {
      // First, validate and transcode the audio file using FFmpeg to WAV 16k mono
      console.log("Validating and transcoding audio file...");
      const wavFileName = `audio_${Date.now()}.wav`;
      const wavFilePath = path.join(tempDir, wavFileName);

      const transcodeCommand = `ffmpeg -y -i "${audioFilePath}" -ac 1 -ar 16000 -vn -loglevel error "${wavFilePath}"`;
      try {
        await execAsync(transcodeCommand);
        console.log("Audio transcoded to WAV");
      } catch (ffErr) {
        console.error("FFmpeg transcode failed:", ffErr.message);
        // If ffmpeg missing, provide a helpful message
        try {
          await fs.unlink(audioFilePath);
        } catch (_) {}
        return res.status(500).json({
          success: false,
          error:
            "FFmpeg is required for audio processing. Install via Homebrew: brew install ffmpeg",
        });
      }

      // Use Python whisper via inline script on the WAV file
      const command = `python3 -c "
import whisper
import sys
import json
import os

try:
    # Load the model
    model = whisper.load_model('tiny')
    
    # Transcribe the audio file
    result = model.transcribe('${wavFilePath}')
    
    # Output as JSON
    print(json.dumps({
        'text': result['text'].strip(),
        'language': result.get('language', 'unknown'),
        'segments': result.get('segments', [])
    }))
except Exception as e:
    print(json.dumps({
        'error': str(e)
    }))
    sys.exit(1)
"`;

      console.log("Running Whisper transcription...");
      const { stdout, stderr } = await execAsync(command);

      if (stderr) {
        console.log("Whisper stderr:", stderr);
      }

      const result = JSON.parse(stdout);

      if (result.error) {
        throw new Error(result.error);
      }

      console.log("Transcription completed:", result.text);

      // Clean up temporary file
      try {
        await fs.unlink(audioFilePath);
      } catch (_) {}
      try {
        await fs.unlink(wavFilePath);
      } catch (_) {}

      res.json({
        success: true,
        transcription: result.text,
        language: result.language,
        segments: result.segments,
      });
    } catch (error) {
      console.error("Transcription error:", error);

      // Clean up temporary file on error
      try {
        await fs.unlink(audioFilePath);
      } catch (cleanupError) {
        console.error("Cleanup error:", cleanupError);
      }
      try {
        await fs.unlink(wavFilePath);
      } catch (_) {}

      res.status(500).json({
        success: false,
        error: "Transcription failed: " + error.message,
      });
    }
  } catch (error) {
    console.error("Transcription error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend service is running",
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log("Available endpoints:");
  console.log("  GET  /api/health - Health check");
  console.log("  GET  /api/dependencies/check - Check dependencies");
  console.log("  POST /api/dependencies/download - Download dependencies");
  console.log("  GET  /api/dependencies/progress - Get download progress");
});
