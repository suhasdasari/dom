# REMOAI Desktop - Installation Guide

## Overview

REMOAI Desktop is a voice-activated AI assistant that runs locally on your machine. The application uses Whisper for speech recognition and requires Python dependencies to be installed after the main app installation.

## Installation Process

### Step 1: Install the Main Application

1. Download the DMG file from the releases
2. Double-click the DMG to mount it
3. Drag REMOAI Desktop to your Applications folder
4. Launch the application

### Step 2: Install Python Dependencies (First Run)

When you first launch REMOAI Desktop, it will automatically:

1. **Check for Dependencies**: The app checks if Python dependencies are installed
2. **Download Required Packages**: If not found, it downloads:
   - OpenAI Whisper (speech recognition)
   - PyTorch (AI model execution)
   - Transformers (language models)
   - NumPy & SciPy (scientific computing)
3. **Download AI Models**: Downloads the Whisper base model (~1.5GB)
4. **Enable Voice Features**: Once complete, voice recognition is ready

### What Gets Installed

The following Python packages are installed in your user directory:

- **openai-whisper**: Speech-to-text recognition
- **torch**: PyTorch for AI model execution
- **transformers**: Hugging Face transformers library
- **numpy**: Numerical computing
- **scipy**: Scientific computing

**Total Size**: ~4GB (including models)

### Installation Locations

**macOS**: `~/Library/Application Support/REMOAI Desktop/`
**Windows**: `%LOCALAPPDATA%/REMOAI Desktop/`
**Linux**: `~/.local/share/REMOAI Desktop/`

## System Requirements

### Minimum Requirements
- **macOS**: 10.15+ (Catalina or later)
- **Windows**: Windows 10 or later
- **Linux**: Ubuntu 18.04+ or equivalent
- **Python**: 3.8 or higher
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 5GB free space for dependencies

### Recommended Requirements
- **RAM**: 8GB or more
- **Storage**: SSD for better performance
- **CPU**: Modern multi-core processor

## Troubleshooting

### Python Not Found
If you get a "Python not found" error:
1. Install Python 3.8+ from [python.org](https://python.org)
2. Make sure Python is in your system PATH
3. Restart REMOAI Desktop

### Installation Fails
If dependency installation fails:
1. Check your internet connection
2. Ensure you have sufficient disk space (5GB+)
3. Try running the installer manually:
   ```bash
   python3 install-dependencies.py
   ```

### Permission Errors
If you get permission errors:
1. Make sure you have write access to your home directory
2. On macOS/Linux, you might need to run:
   ```bash
   chmod +x install-dependencies.py
   ```

### Backend Connection Issues
If the app can't connect to the backend:
1. Check if port 3001 is available
2. Restart the application
3. Check firewall settings

## Manual Installation

If automatic installation fails, you can install dependencies manually:

### Option 1: Using the Installer Script
```bash
cd /Applications/REMOAI\ Desktop.app/Contents/Resources/
python3 install-dependencies.py
```

### Option 2: Using pip directly
```bash
pip3 install --user openai-whisper torch transformers numpy scipy
```

## Features After Installation

Once dependencies are installed, you can:

- **Voice Recognition**: Click the microphone to start recording
- **Speech-to-Text**: Speak naturally and see your words transcribed
- **Local Processing**: All processing happens on your device
- **Privacy**: No data is sent to external servers

## Uninstalling

To completely remove REMOAI Desktop:

1. **Delete the Application**: Move REMOAI Desktop from Applications to Trash
2. **Remove Dependencies**: Delete the configuration folder:
   - **macOS**: `~/Library/Application Support/REMOAI Desktop/`
   - **Windows**: `%LOCALAPPDATA%/REMOAI Desktop/`
   - **Linux**: `~/.local/share/REMOAI Desktop/`

## Support

If you encounter issues:

1. Check this troubleshooting guide
2. Ensure your system meets the requirements
3. Try reinstalling dependencies manually
4. Contact support with your system details

## Privacy & Security

- All processing happens locally on your device
- No audio data is sent to external servers
- Configuration files are stored locally
- No telemetry or usage tracking

---

**Note**: The first launch may take several minutes as it downloads and installs the required AI models. Subsequent launches will be much faster.
