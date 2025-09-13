#!/bin/bash

# Fix script for REMOAI Desktop Gatekeeper issues
# Run this if you see "damaged" error on other Macs

echo "🔧 Fixing REMOAI Desktop Gatekeeper issues..."

# Find the app
APP_PATH=""
if [ -f "REMOAI Desktop.app" ]; then
    APP_PATH="REMOAI Desktop.app"
elif [ -f "dist-electron/mac/REMOAI Desktop.app" ]; then
    APP_PATH="dist-electron/mac/REMOAI Desktop.app"
elif [ -f "app/dist-electron/mac/REMOAI Desktop.app" ]; then
    APP_PATH="app/dist-electron/mac/REMOAI Desktop.app"
else
    echo "❌ REMOAI Desktop.app not found"
    echo "   Please run this script from the directory containing the app"
    exit 1
fi

echo "📱 Found app at: $APP_PATH"

# Remove quarantine attributes
echo "🔓 Removing quarantine attributes..."
xattr -cr "$APP_PATH"

# Remove extended attributes that cause issues
echo "🧹 Cleaning extended attributes..."
xattr -d com.apple.quarantine "$APP_PATH" 2>/dev/null || true
xattr -d com.apple.metadata:kMDItemWhereFroms "$APP_PATH" 2>/dev/null || true

# Make sure it's executable
echo "⚡ Making app executable..."
chmod +x "$APP_PATH/Contents/MacOS/REMOAI Desktop"

echo ""
echo "✅ Gatekeeper fix applied!"
echo ""
echo "🎉 You can now run the app normally:"
echo "   open '$APP_PATH'"
echo ""
echo "📝 If you still see issues:"
echo "   1. Right-click the app → Open"
echo "   2. Or go to System Preferences → Security & Privacy → General"
echo "   3. Click 'Open Anyway' if prompted"
