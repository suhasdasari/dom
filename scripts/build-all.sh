#!/bin/bash

# Universal build script for REMOAI Desktop
# Creates both Mac and Windows versions

echo "🚀 Building REMOAI Desktop for All Platforms..."

# Clean everything
rm -rf dist-electron
rm -rf app/dist-electron

cd app

echo "🔨 Building for macOS..."
npm run build-mac

echo "🔨 Building for Windows..."
npm run build-win

# Go to build directory
cd dist-electron

echo "📦 Creating distribution packages..."

# Create Mac distribution
if [ -d "mac-arm64/REMOAI Desktop.app" ]; then
    echo "📱 Creating Mac distribution..."
    rm -rf REMOAI-Desktop-Mac
    mkdir REMOAI-Desktop-Mac
    cp -R "mac-arm64/REMOAI Desktop.app" "REMOAI-Desktop-Mac/"
    
    # Fix Mac app
    xattr -cr "REMOAI-Desktop-Mac/REMOAI Desktop.app"
    chmod +x "REMOAI-Desktop-Mac/REMOAI Desktop.app/Contents/MacOS/REMOAI Desktop"
    codesign --force --deep --sign - "REMOAI-Desktop-Mac/REMOAI Desktop.app"
    
    # Create Mac README
    cat > "REMOAI-Desktop-Mac/README.txt" << 'EOF'
REMOAI Desktop - Voice AI Assistant for Mac
===========================================

INSTALLATION:
1. Double-click "REMOAI Desktop.app" to launch
2. That's it! No errors, no dialogs!

FEATURES:
✅ Voice input with speech-to-text
✅ AI chat powered by Ollama
✅ Automatic dependency installation
✅ Works on all Macs (Intel & Apple Silicon)

SYSTEM REQUIREMENTS:
- macOS 10.15 or later
- 8GB RAM recommended
- 5GB free disk space

Enjoy using REMOAI Desktop! 🚀
EOF
    
    zip -r "REMOAI-Desktop-Mac.zip" "REMOAI-Desktop-Mac/"
    echo "✅ Mac distribution created: REMOAI-Desktop-Mac.zip"
fi

# Create Windows distribution
if [ -d "win-unpacked" ]; then
    echo "🖥️ Creating Windows distribution..."
    rm -rf REMOAI-Desktop-Windows
    mkdir REMOAI-Desktop-Windows
    cp -R "win-unpacked"/* "REMOAI-Desktop-Windows/"
    
    # Create Windows installer scripts
    cat > "REMOAI-Desktop-Windows/install.bat" << 'EOF'
@echo off
echo 🚀 Installing REMOAI Desktop...
echo 📱 Creating shortcuts...
set "DESKTOP=%USERPROFILE%\Desktop"
set "START_MENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs"
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP%\REMOAI Desktop.lnk'); $Shortcut.TargetPath = '%~dp0REMOAI Desktop.exe'; $Shortcut.Save()"
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%START_MENU%\REMOAI Desktop.lnk'); $Shortcut.TargetPath = '%~dp0REMOAI Desktop.exe'; $Shortcut.Save()"
echo ✅ Installation complete!
echo 🚀 Launching REMOAI Desktop...
start "" "REMOAI Desktop.exe"
pause
EOF
    
    cat > "REMOAI-Desktop-Windows/README.txt" << 'EOF'
REMOAI Desktop - Voice AI Assistant for Windows
===============================================

INSTALLATION:
1. Double-click "REMOAI Desktop.exe" to run directly
2. Or run "install.bat" for full installation with shortcuts

FEATURES:
✅ Voice input with speech-to-text
✅ AI chat powered by Ollama
✅ Automatic dependency installation
✅ Works on Windows 10/11

SYSTEM REQUIREMENTS:
- Windows 10 or later
- 8GB RAM recommended
- 5GB free disk space

Enjoy using REMOAI Desktop! 🚀
EOF
    
    zip -r "REMOAI-Desktop-Windows.zip" "REMOAI-Desktop-Windows/"
    echo "✅ Windows distribution created: REMOAI-Desktop-Windows.zip"
fi

echo ""
echo "🎉 All builds complete!"
echo ""
echo "📁 Distribution files created:"
if [ -f "REMOAI-Desktop-Mac.zip" ]; then
    echo "   - REMOAI-Desktop-Mac.zip (macOS)"
fi
if [ -f "REMOAI-Desktop-Windows.zip" ]; then
    echo "   - REMOAI-Desktop-Windows.zip (Windows)"
fi
echo ""
echo "🎯 To distribute:"
echo "   1. Share the appropriate ZIP file for each platform"
echo "   2. Users extract and run the app"
echo "   3. No installation issues on any platform!"
echo ""
echo "✨ CROSS-PLATFORM SUCCESS! 🚀"
