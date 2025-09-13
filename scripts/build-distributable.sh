#!/bin/bash

# Build script for REMOAI Desktop that creates a distributable version
# This bypasses Gatekeeper issues by creating a self-contained app

echo "🚀 Building REMOAI Desktop for distribution..."

# Clean previous builds
rm -rf dist-electron

# Build without code signing (for distribution)
cd app

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the app
echo "🔨 Building Electron app..."
npm run build-mac

# Create a distributable package
echo "📦 Creating distributable package..."

cd dist-electron

# Create a simple installer script
cat > install-remoa.sh << 'EOF'
#!/bin/bash

echo "🚀 Installing REMOAI Desktop..."

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ This installer is for macOS only"
    exit 1
fi

# Create Applications directory if it doesn't exist
mkdir -p ~/Applications

# Copy the app to Applications
echo "📱 Installing REMOAI Desktop to Applications..."
cp -R "REMOAI Desktop.app" ~/Applications/

# Make it executable
chmod +x ~/Applications/"REMOAI Desktop.app/Contents/MacOS/REMOAI Desktop"

echo "✅ Installation complete!"
echo ""
echo "🎉 REMOAI Desktop has been installed to ~/Applications/"
echo "   You can now launch it from Launchpad or Applications folder"
echo ""
echo "⚠️  If you see a 'damaged' error:"
echo "   1. Right-click the app in Applications"
echo "   2. Select 'Open'"
echo "   3. Click 'Open' in the dialog"
echo "   4. The app will work normally after that"
echo ""

# Try to open the app
echo "🚀 Launching REMOAI Desktop..."
open ~/Applications/"REMOAI Desktop.app"
EOF

chmod +x install-remoa.sh

# Create a README for users
cat > README.txt << 'EOF'
REMOAI Desktop - Voice AI Assistant
==================================

INSTALLATION:
1. Double-click "install-remoa.sh"
2. Follow the instructions
3. If you see "damaged" error, right-click app → Open

FEATURES:
- Voice input with speech-to-text
- AI chat powered by Ollama
- Automatic dependency installation
- Cross-platform support

SYSTEM REQUIREMENTS:
- macOS 10.15 or later
- 8GB RAM recommended
- 5GB free disk space

TROUBLESHOOTING:
- If app shows "damaged": Right-click → Open
- If microphone doesn't work: Check System Preferences → Security & Privacy → Microphone
- For more help, see the main README.md

Enjoy using REMOAI Desktop! 🚀
EOF

# Create a zip with everything
echo "📦 Creating distribution package..."
zip -r "REMOAI-Desktop-Distributable.zip" "REMOAI Desktop.app" install-remoa.sh README.txt

echo ""
echo "✅ Build complete!"
echo ""
echo "📁 Distribution files created:"
echo "   - REMOAI-Desktop-Distributable.zip (for distribution)"
echo "   - REMOAI Desktop.app (standalone app)"
echo ""
echo "🎯 To distribute:"
echo "   1. Share the ZIP file"
echo "   2. Users extract and run install-remoa.sh"
echo "   3. App installs to Applications folder"
echo ""
echo "⚠️  If users see 'damaged' error:"
echo "   - Right-click app → Open"
echo "   - Or run: xattr -cr 'REMOAI Desktop.app'"
