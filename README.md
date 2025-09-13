# REMOAI Desktop

A cross-platform voice AI assistant built with Electron, featuring speech-to-text, AI chat powered by Ollama, and automatic dependency installation.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd rda

# Install dependencies
cd app
npm install

# Start the application
npm start
```

## 📁 Project Structure

```
rda/
├── app/                    # Main application code
│   ├── assets/            # Images and icons
│   ├── backend/           # Backend services
│   ├── resources/         # App resources
│   ├── main.js           # Electron main process
│   ├── index.html        # Main UI
│   ├── script.js         # Frontend logic
│   ├── styles.css        # Styling
│   └── package.json      # App dependencies
├── configs/               # Configuration files
│   └── electron-builder-config.js
├── docs/                  # Documentation
│   ├── README.md
│   ├── SETUP.md
│   └── USER_GUIDE.md
├── scripts/               # Build and utility scripts
│   ├── build-mac.sh
│   ├── build-windows.sh
│   └── build-all.sh
└── README.md             # This file
```

## 🛠️ Building

### Mac (DMG)

```bash
cd app
npm run build-mac
```

### Windows (EXE)

```bash
cd app
npm run build-win
```

### Linux (AppImage)

```bash
cd app
npm run build-linux
```

### All Platforms

```bash
./scripts/build-all.sh
```

## ✨ Features

- 🎤 **Voice Input** - Speech-to-text using OpenAI Whisper
- 🤖 **AI Chat** - Powered by Ollama with Remo persona
- 🔧 **Auto-Installer** - Automatically installs dependencies
- 🖥️ **Cross-Platform** - Works on Mac, Windows, and Linux
- 🎨 **Modern UI** - Clean, responsive interface

## 📖 Documentation

- [Setup Guide](docs/SETUP.md) - Developer setup instructions
- [User Guide](docs/USER_GUIDE.md) - End-user documentation
- [Distribution Guide](docs/DISTRIBUTION_GUIDE.md) - How to distribute the app

## 🚀 Distribution

The app creates native installers for each platform:

- **Mac**: DMG installer
- **Windows**: NSIS installer + Portable EXE
- **Linux**: AppImage + DEB package

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.
