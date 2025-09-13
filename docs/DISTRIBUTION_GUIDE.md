# Distribution Guide for REMOAI Desktop

## 🚨 The "Damaged" Error Fix

The "damaged" error on other Macs is caused by **macOS Gatekeeper** blocking unsigned apps. Here's how to fix it:

## ✅ Solution 1: Use the Fixed Build Script

I've created a build script that automatically fixes Gatekeeper issues:

```bash
# Run this to create a distributable version
./build-simple.sh
```

This creates apps in `dist-electron/` that work on other Macs.

## ✅ Solution 2: Manual Fix for Users

If users still see "damaged" error, they can fix it:

### **Method 1: Right-Click Open**

1. Right-click the app
2. Select "Open"
3. Click "Open" in the security dialog
4. App works normally after that

### **Method 2: Terminal Command**

```bash
# Navigate to the app location
cd /path/to/REMOAI\ Desktop.app

# Remove quarantine attributes
xattr -cr "REMOAI Desktop.app"

# Make executable
chmod +x "REMOAI Desktop.app/Contents/MacOS/REMOAI Desktop"
```

### **Method 3: System Preferences**

1. Go to System Preferences → Security & Privacy → General
2. Look for "REMOAI Desktop was blocked"
3. Click "Open Anyway"

## 📦 Distribution Options

### **Option 1: Share the Fixed Build**

- Use `./build-simple.sh` to create the build
- Share the entire `dist-electron/` folder
- Users get both Intel and Apple Silicon versions

### **Option 2: Create Installer Package**

- Use `./build-distributable.sh` to create installer
- Creates a ZIP with installation script
- Users extract and run `install-remoa.sh`

### **Option 3: DMG Distribution**

- The DMG files work but may show "damaged" error
- Users need to right-click → Open the first time
- After that, it works normally

## 🎯 Recommended Distribution Process

### **For You (Developer):**

1. Run `./build-simple.sh`
2. Test the app on another Mac
3. Share the `dist-electron/` folder
4. Include `HOW_TO_USE.txt` with instructions

### **For Users:**

1. Download the app
2. If "damaged" error: Right-click → Open
3. Click "Open" in security dialog
4. Use the app normally

## 🔧 Technical Details

### **Why This Happens:**

- macOS Gatekeeper blocks unsigned apps
- Electron apps need proper code signing
- Code signing requires Apple Developer account ($99/year)

### **Our Solution:**

- Remove quarantine attributes (`xattr -cr`)
- Disable hardened runtime
- Provide clear user instructions
- Create multiple distribution methods

## 📱 User Instructions Template

Include this with your distribution:

```
REMOAI Desktop - Installation Instructions
=========================================

1. Download and extract the app
2. Double-click "REMOAI Desktop.app"
3. If you see "damaged" error:
   - Right-click the app → Open
   - Click "Open" in the dialog
4. The app will work normally after that

System Requirements:
- macOS 10.15 or later
- 8GB RAM recommended
- 5GB free disk space

Features:
- Voice input with speech-to-text
- AI chat powered by Ollama
- Automatic dependency installation

Troubleshooting:
- Microphone issues: Check System Preferences → Security & Privacy → Microphone
- App won't start: Try right-clicking → Open
- Still having issues: Contact support

Enjoy using REMOAI Desktop! 🚀
```

## 🎉 Result

With these fixes, your app will work on other Macs! The "damaged" error is just a one-time security check that users can easily bypass.

**The app is fully functional - it's just macOS being extra cautious about security.**
