# REMOAI Desktop Setup Guide

## Prerequisites

Before running REMOAI Desktop, you need to install the following dependencies:

### 1. Ollama (AI Model Runtime)
```bash
# macOS
brew install ollama

# Or download from: https://ollama.ai/download
```

### 2. FFmpeg (Audio Processing)
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt update && sudo apt install ffmpeg

# Windows
# Download from: https://ffmpeg.org/download.html
```

### 3. OpenAI Whisper (Speech Recognition)
```bash
pip3 install openai-whisper
```

### 4. Node.js Dependencies
```bash
# Backend dependencies
cd backend
npm install

# App dependencies  
cd ../app
npm install
```

## Quick Start

1. **Start Ollama and pull the model:**
   ```bash
   ollama serve
   # In another terminal:
   ollama pull gpt-oss:20b
   ```

2. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```

3. **Launch the app:**
   ```bash
   cd app
   npm start
   ```

## Features

- **Voice Input**: Click the microphone to record and transcribe speech
- **Text Chat**: Type messages directly
- **Remo AI Assistant**: Get help with tasks, reminders, planning, and more
- **Real-time Processing**: Powered by Ollama and Whisper

## Troubleshooting

### "Failed to fetch" error
- Ensure backend is running on `http://localhost:3001`
- Check if all dependencies are installed

### "Transcription error" 
- Verify ffmpeg is installed: `ffmpeg -version`
- Verify whisper is installed: `pip3 show openai-whisper`

### Ollama connection issues
- Ensure Ollama is running: `ollama serve`
- Verify model is pulled: `ollama list`

## System Requirements

- **macOS**: 10.15+ (Intel/Apple Silicon)
- **Windows**: 10+ (64-bit)
- **Linux**: Ubuntu 18.04+ or equivalent
- **RAM**: 8GB+ recommended
- **Storage**: 5GB+ free space

## Support

For issues or questions, please check the troubleshooting section above or create an issue in the repository.
