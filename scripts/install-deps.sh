#!/bin/bash

# REMOAI Desktop Dependencies Installer
# This script installs all required dependencies for REMOAI Desktop

set -e

echo "🚀 REMOAI Desktop Dependencies Installer"
echo "========================================"

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS="windows"
else
    echo "❌ Unsupported operating system: $OSTYPE"
    exit 1
fi

echo "📱 Detected OS: $OS"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install dependencies based on OS
install_dependencies() {
    echo ""
    echo "📦 Installing dependencies..."
    
    if [[ "$OS" == "macos" ]]; then
        # Check for Homebrew
        if ! command_exists brew; then
            echo "📥 Installing Homebrew..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        fi
        
        # Install Ollama
        if ! command_exists ollama; then
            echo "📥 Installing Ollama..."
            brew install ollama
        else
            echo "✅ Ollama already installed"
        fi
        
        # Install FFmpeg
        if ! command_exists ffmpeg; then
            echo "📥 Installing FFmpeg..."
            brew install ffmpeg
        else
            echo "✅ FFmpeg already installed"
        fi
        
    elif [[ "$OS" == "linux" ]]; then
        # Update package list
        echo "📥 Updating package list..."
        sudo apt update
        
        # Install FFmpeg
        if ! command_exists ffmpeg; then
            echo "📥 Installing FFmpeg..."
            sudo apt install -y ffmpeg
        else
            echo "✅ FFmpeg already installed"
        fi
        
        # Install Ollama
        if ! command_exists ollama; then
            echo "📥 Installing Ollama..."
            curl -fsSL https://ollama.ai/install.sh | sh
        else
            echo "✅ Ollama already installed"
        fi
        
    elif [[ "$OS" == "windows" ]]; then
        echo "⚠️  Windows installation requires manual steps:"
        echo "   1. Download Ollama from: https://ollama.ai/download"
        echo "   2. Download FFmpeg from: https://ffmpeg.org/download.html"
        echo "   3. Add both to your PATH"
        return
    fi
    
    # Install Python Whisper
    if ! command_exists python3; then
        echo "❌ Python 3 is required but not installed"
        echo "   Please install Python 3 from: https://python.org"
        exit 1
    fi
    
    if ! python3 -c "import whisper" 2>/dev/null; then
        echo "📥 Installing OpenAI Whisper..."
        pip3 install openai-whisper
    else
        echo "✅ Whisper already installed"
    fi
    
    # Install Node.js dependencies
    echo "📥 Installing Node.js dependencies..."
    
    if [[ -d "backend" ]]; then
        echo "   Installing backend dependencies..."
        cd backend && npm install && cd ..
    fi
    
    if [[ -d "app" ]]; then
        echo "   Installing app dependencies..."
        cd app && npm install && cd ..
    fi
}

# Pull Ollama model
pull_model() {
    echo ""
    echo "🤖 Setting up AI model..."
    
    if command_exists ollama; then
        echo "📥 Pulling gpt-oss:20b model (this may take a while)..."
        ollama pull gpt-oss:20b || {
            echo "⚠️  Failed to pull gpt-oss:20b, trying alternative model..."
            ollama pull llama2 || echo "❌ Failed to pull any model"
        }
    else
        echo "❌ Ollama not found, please install it first"
    fi
}

# Verify installation
verify_installation() {
    echo ""
    echo "🔍 Verifying installation..."
    
    local all_good=true
    
    if command_exists ollama; then
        echo "✅ Ollama installed"
    else
        echo "❌ Ollama not found"
        all_good=false
    fi
    
    if command_exists ffmpeg; then
        echo "✅ FFmpeg installed"
    else
        echo "❌ FFmpeg not found"
        all_good=false
    fi
    
    if python3 -c "import whisper" 2>/dev/null; then
        echo "✅ Whisper installed"
    else
        echo "❌ Whisper not found"
        all_good=false
    fi
    
    if [[ -d "backend/node_modules" ]]; then
        echo "✅ Backend dependencies installed"
    else
        echo "❌ Backend dependencies not found"
        all_good=false
    fi
    
    if [[ -d "app/node_modules" ]]; then
        echo "✅ App dependencies installed"
    else
        echo "❌ App dependencies not found"
        all_good=false
    fi
    
    if [[ "$all_good" == true ]]; then
        echo ""
        echo "🎉 All dependencies installed successfully!"
        echo ""
        echo "🚀 To start REMOAI Desktop:"
        echo "   1. Start Ollama: ollama serve"
        echo "   2. Start backend: cd backend && npm start"
        echo "   3. Start app: cd app && npm start"
    else
        echo ""
        echo "❌ Some dependencies failed to install. Please check the errors above."
        exit 1
    fi
}

# Main execution
main() {
    install_dependencies
    pull_model
    verify_installation
}

# Run main function
main "$@"
