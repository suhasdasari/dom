#!/bin/bash

# REMOAI Desktop App Packager
# Creates a distributable package with all dependencies bundled

set -e

echo "📦 REMOAI Desktop App Packager"
echo "=============================="

# Check if we're in the right directory
if [[ ! -f "app/package.json" ]] || [[ ! -f "backend/package.json" ]]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Create distribution directory
DIST_DIR="remoa-desktop-dist"
echo "📁 Creating distribution directory: $DIST_DIR"
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

# Copy app files
echo "📱 Copying app files..."
cp -r app/* "$DIST_DIR/"
rm -rf "$DIST_DIR/node_modules" 2>/dev/null || true

# Copy backend files
echo "🔧 Copying backend files..."
mkdir -p "$DIST_DIR/backend"
cp -r backend/* "$DIST_DIR/backend/"
rm -rf "$DIST_DIR/backend/node_modules" 2>/dev/null || true

# Copy documentation
echo "📚 Copying documentation..."
cp README.md SETUP.md "$DIST_DIR/"

# Create a simple launcher script
echo "🚀 Creating launcher script..."
cat > "$DIST_DIR/start-remoa.sh" << 'EOF'
#!/bin/bash

echo "🚀 Starting REMOAI Desktop..."

# Check if Ollama is running
if ! curl -s http://localhost:11434/api/tags >/dev/null 2>&1; then
    echo "⚠️  Ollama is not running. Please start it first:"
    echo "   ollama serve"
    echo ""
    echo "   Or install Ollama from: https://ollama.ai"
    exit 1
fi

# Check if backend dependencies are installed
if [[ ! -d "backend/node_modules" ]]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Check if app dependencies are installed
if [[ ! -d "node_modules" ]]; then
    echo "📦 Installing app dependencies..."
    npm install
fi

# Start backend in background
echo "🔧 Starting backend server..."
cd backend && npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start the app
echo "📱 Starting REMOAI Desktop app..."
cd .. && npm start

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null" EXIT
EOF

chmod +x "$DIST_DIR/start-remoa.sh"

# Create Windows batch file
cat > "$DIST_DIR/start-remoa.bat" << 'EOF'
@echo off
echo 🚀 Starting REMOAI Desktop...

REM Check if Ollama is running
curl -s http://localhost:11434/api/tags >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Ollama is not running. Please start it first:
    echo    ollama serve
    echo.
    echo    Or install Ollama from: https://ollama.ai
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend && npm install && cd ..
)

if not exist "node_modules" (
    echo 📦 Installing app dependencies...
    npm install
)

REM Start backend
echo 🔧 Starting backend server...
start /b cmd /c "cd backend && npm start"

REM Wait a moment
timeout /t 3 /nobreak >nul

REM Start app
echo 📱 Starting REMOAI Desktop app...
npm start
EOF

# Create a simple installer
echo "📋 Creating installer script..."
cat > "$DIST_DIR/install-remoa.sh" << 'EOF'
#!/bin/bash

echo "🎯 REMOAI Desktop Installer"
echo "=========================="

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
else
    echo "❌ Unsupported OS. Please install dependencies manually."
    exit 1
fi

echo "📱 Detected OS: $OS"

# Install Ollama
if ! command -v ollama >/dev/null 2>&1; then
    echo "📥 Installing Ollama..."
    if [[ "$OS" == "macos" ]]; then
        if ! command -v brew >/dev/null 2>&1; then
            echo "📥 Installing Homebrew first..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        fi
        brew install ollama
    elif [[ "$OS" == "linux" ]]; then
        curl -fsSL https://ollama.ai/install.sh | sh
    fi
else
    echo "✅ Ollama already installed"
fi

# Install FFmpeg
if ! command -v ffmpeg >/dev/null 2>&1; then
    echo "📥 Installing FFmpeg..."
    if [[ "$OS" == "macos" ]]; then
        brew install ffmpeg
    elif [[ "$OS" == "linux" ]]; then
        sudo apt update && sudo apt install -y ffmpeg
    fi
else
    echo "✅ FFmpeg already installed"
fi

# Install Whisper
if ! python3 -c "import whisper" 2>/dev/null; then
    echo "📥 Installing Whisper..."
    pip3 install openai-whisper
else
    echo "✅ Whisper already installed"
fi

# Pull Ollama model
echo "🤖 Setting up AI model..."
ollama pull gpt-oss:20b || ollama pull llama2

echo ""
echo "🎉 Installation complete!"
echo ""
echo "🚀 To start REMOAI Desktop:"
echo "   ./start-remoa.sh"
EOF

chmod +x "$DIST_DIR/install-remoa.sh"

# Create a simple README for the distribution
cat > "$DIST_DIR/README.txt" << 'EOF'
REMOAI Desktop - Voice AI Assistant
===================================

QUICK START:
1. Run: ./install-remoa.sh (first time only)
2. Run: ./start-remoa.sh

WHAT YOU NEED:
- Ollama (AI runtime) - installer will set this up
- FFmpeg (audio processing) - installer will set this up  
- Whisper (speech recognition) - installer will set this up

FEATURES:
- Voice input with speech-to-text
- AI chat powered by Ollama
- Remo personal assistant persona
- Cross-platform (macOS, Linux, Windows)

TROUBLESHOOTING:
- If "Failed to fetch" error: make sure Ollama is running (ollama serve)
- If transcription fails: check FFmpeg and Whisper are installed
- For more help, see SETUP.md

Enjoy using REMOAI Desktop! 🚀
EOF

# Create a zip file
echo "📦 Creating distribution package..."
ZIP_NAME="remoa-desktop-$(date +%Y%m%d).zip"
zip -r "$ZIP_NAME" "$DIST_DIR" -x "*.DS_Store" "*/node_modules/*"

echo ""
echo "✅ Distribution package created: $ZIP_NAME"
echo ""
echo "📋 To distribute:"
echo "   1. Share the $ZIP_NAME file"
echo "   2. Users extract and run: ./install-remoa.sh"
echo "   3. Then run: ./start-remoa.sh"
echo ""
echo "🎯 Users only need to:"
echo "   - Extract the zip file"
echo "   - Run the installer once"
echo "   - Start the app anytime"
