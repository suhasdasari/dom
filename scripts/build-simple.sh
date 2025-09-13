#!/bin/bash

# Simple build script for REMOAI Desktop
# Creates a version that works on other Macs

echo "🚀 Building REMOAI Desktop (Simple Version)..."

# Clean previous builds
rm -rf dist-electron

cd app

# Build the app
echo "🔨 Building Electron app..."
npm run build-mac

# Go to build directory
cd dist-electron

# Apply Gatekeeper fix
echo "🔧 Applying Gatekeeper fix..."
if [ -d "mac/REMOAI Desktop.app" ]; then
    xattr -cr "mac/REMOAI Desktop.app"
    chmod +x "mac/REMOAI Desktop.app/Contents/MacOS/REMOAI Desktop"
    echo "✅ Fixed mac/REMOAI Desktop.app"
fi

if [ -d "mac-arm64/REMOAI Desktop.app" ]; then
    xattr -cr "mac-arm64/REMOAI Desktop.app"
    chmod +x "mac-arm64/REMOAI Desktop.app/Contents/MacOS/REMOAI Desktop"
    echo "✅ Fixed mac-arm64/REMOAI Desktop.app"
fi

# Create user instructions
cat > "HOW_TO_USE.txt" << 'EOF'
REMOAI Desktop - How to Use
===========================

QUICK START:
1. Double-click "REMOAI Desktop.app" to launch
2. If you see "damaged" error, right-click app → Open
3. Click "Open" in the security dialog
4. The app will work normally after that

FEATURES:
- Voice input with speech-to-text
- AI chat powered by Ollama
- Automatic dependency installation
- Cross-platform support

TROUBLESHOOTING:
- "Damaged" error: Right-click app → Open
- Microphone issues: Check System Preferences → Security & Privacy → Microphone
- App won't start: Try running from Terminal: open "REMOAI Desktop.app"

SYSTEM REQUIREMENTS:
- macOS 10.15 or later
- 8GB RAM recommended
- 5GB free disk space

Enjoy using REMOAI Desktop! 🚀
EOF

echo ""
echo "✅ Build complete!"
echo ""
echo "📁 Files created:"
echo "   - mac/REMOAI Desktop.app (Intel Macs)"
echo "   - mac-arm64/REMOAI Desktop.app (Apple Silicon Macs)"
echo "   - HOW_TO_USE.txt (Instructions)"
echo ""
echo "🎯 To distribute:"
echo "   1. Share the entire dist-electron folder"
echo "   2. Users double-click the app"
echo "   3. If 'damaged' error: Right-click → Open"
echo ""
echo "⚠️  Gatekeeper fix applied - should work on other Macs!"
