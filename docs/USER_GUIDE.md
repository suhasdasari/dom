# REMOAI Desktop - User Guide

## For End Users (Non-Developers)

### What is REMOAI Desktop?

REMOAI Desktop is a voice-enabled AI personal assistant that runs on your computer. You can talk to it or type messages, and it will help you with tasks, reminders, and everyday requests.

### Easy Installation Options

#### Option 1: Pre-built Package (Easiest)

1. Download the latest release from GitHub
2. Extract the zip file
3. Run `install-remoa.sh` (first time only)
4. Run `start-remoa.sh` to launch the app

#### Option 2: Simple Installer

1. Download and run the installer for your platform:
   - **macOS**: `REMOAI-Desktop-1.0.0.dmg`
   - **Windows**: `REMOAI-Desktop-Setup-1.0.0.exe`
   - **Linux**: `REMOAI-Desktop-1.0.0.AppImage`

### What You Need

The installer will automatically set up:

- **Ollama** - The AI brain that powers conversations
- **FFmpeg** - Processes your voice recordings
- **Whisper** - Converts your speech to text

### How to Use

#### Starting the App

1. Make sure Ollama is running (the installer will guide you)
2. Launch REMOAI Desktop
3. Click the microphone to talk, or type in the chat box

#### Voice Commands

- Click the microphone button
- Speak your request clearly
- Click again to stop recording
- The app will transcribe and respond automatically

#### Example Requests

- "Set a reminder to call mom at 3 PM"
- "What's the weather like today?"
- "Help me plan my day"
- "Order pizza for dinner"
- "Create a shopping list"

### Troubleshooting

#### "Failed to fetch" Error

- Make sure Ollama is running: Open Terminal and type `ollama serve`
- Check your internet connection

#### Voice Not Working

- Check microphone permissions in System Preferences
- Make sure you're speaking clearly and close to the microphone
- Try typing instead of using voice

#### App Won't Start

- Make sure all dependencies are installed
- Try running the installer again
- Check the troubleshooting section in SETUP.md

### Getting Help

- Check the [Issues](https://github.com/suhasdasari/dom/issues) page
- Read the full [SETUP.md](SETUP.md) guide
- Contact support if needed

### System Requirements

- **macOS**: 10.15 or later
- **Windows**: 10 or later
- **Linux**: Ubuntu 18.04 or equivalent
- **RAM**: 8GB recommended
- **Storage**: 5GB free space

### Privacy

- All processing happens on your computer
- Your voice data is not stored or sent anywhere
- Conversations are private and secure

---

**Enjoy using REMOAI Desktop! 🚀**
