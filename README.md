# REMOAI Desktop

A voice-enabled AI personal assistant desktop app powered by Ollama and Whisper.

## Features

- 🎤 **Voice Input**: Click to record and transcribe speech using OpenAI Whisper
- 💬 **Text Chat**: Type messages directly in the chat interface
- 🤖 **Remo AI Assistant**: Get help with tasks, reminders, planning, and everyday requests
- ⚡ **Real-time Processing**: Powered by Ollama for fast AI responses

## Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/suhasdasari/dom.git
cd dom

# Run the automated installer
./install-deps.sh
```

### Option 2: Manual Setup

See [SETUP.md](SETUP.md) for detailed installation instructions.

## Usage

1. **Start Ollama:**

   ```bash
   ollama serve
   ```

2. **Start the backend:**

   ```bash
   cd backend
   npm start
   ```

3. **Launch the app:**
   ```bash
   cd app
   npm start
   ```

## System Requirements

- **macOS**: 10.15+ (Intel/Apple Silicon)
- **Windows**: 10+ (64-bit)
- **Linux**: Ubuntu 18.04+ or equivalent
- **RAM**: 8GB+ recommended
- **Storage**: 5GB+ free space

## Dependencies

- [Ollama](https://ollama.ai) - AI model runtime
- [FFmpeg](https://ffmpeg.org) - Audio processing
- [OpenAI Whisper](https://github.com/openai/whisper) - Speech recognition
- Node.js 16+ - JavaScript runtime

## Troubleshooting

See [SETUP.md](SETUP.md) for common issues and solutions.

## License

MIT
