# REMOAI Desktop App

A modern, minimalist desktop application built with Electron featuring voice chat functionality with animated logo and live listening effects.

## ✨ Features

- **🎨 Clean Interface**: Minimalist design with centered logo and voice chat button
- **🔄 Logo Animation**: Smooth rotation animation with continuous "live listening" effect
- **🎤 Voice Chat Ready**: PNG icon support for custom voice chat functionality
- **📱 Responsive Design**: Clean, modern aesthetic with smooth transitions
- **🖥️ Cross-Platform**: Works on both Intel and Apple Silicon Macs
- **📦 Professional Packaging**: DMG and ZIP distribution packages

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation & Running

1. **Install dependencies:**
```bash
npm install
```

2. **Run the application:**
```bash
npm start
```

3. **Development mode (with DevTools):**
```bash
npm run dev
```

## 📁 Project Structure

```
REMOAI/
├── main.js              # Electron main process
├── index.html           # Main HTML structure
├── styles.css           # CSS styling and animations
├── script.js            # JavaScript functionality
├── package.json         # Project configuration
├── assets/              # Asset folder
│   ├── logo.png         # App logo (place your logo here)
│   └── voice-icon.png   # Voice chat icon (place your icon here)
└── dist/                # Generated distribution files
    ├── mac/             # Intel Mac app bundle
    ├── mac-arm64/      # Apple Silicon Mac app bundle
    ├── *.dmg           # DMG installers
    └── *.zip           # ZIP packages
```

## 🎯 How It Works

### Landing Page
- **Clean Interface**: Centered logo with voice chat button
- **PNG Icon Support**: Ready for your custom voice chat icon
- **Smooth Design**: Minimalist aesthetic

### Main Interface (After clicking voice chat button)
- **Logo Animation**: Initial 360° spin + continuous rotation
- **Live Listening Effect**: Continuous rotation indicates active voice processing
- **Bottom Controls**: Microphone and close (X) buttons
- **Navigation**: Click X to return to landing page

## 📦 Building Distribution Packages

### Generate DMG Installers
```bash
npm run build-mac
```

**Output:**
- `REMOAI Desktop-1.0.0.dmg` - Intel Mac installer (~94MB)
- `REMOAI Desktop-1.0.0-arm64.dmg` - Apple Silicon Mac installer (~89MB)

### Generate ZIP Packages
```bash
npm run build-mac
```

**Output:**
- `REMOAI Desktop-1.0.0-mac.zip` - Intel Mac package (~91MB)
- `REMOAI Desktop-1.0.0-arm64-mac.zip` - Apple Silicon Mac package (~86MB)

### Build for Other Platforms
```bash
# Windows
npm run build-win

# Linux
npm run build-linux

# All platforms
npm run dist
```

## 🎨 Customization

### Adding Your Logo
1. Place your logo as `logo.png` in the `assets/` folder
2. The logo will automatically appear in the center of both pages
3. Logo size: Recommended 180x180 pixels or larger

### Adding Your Voice Icon
1. Place your voice chat icon as `voice-icon.png` in the `assets/` folder
2. The icon will appear on the voice chat button
3. Icon size: Recommended 24x24 pixels

### Customizing Animations
- **Logo Rotation**: Modify `@keyframes rotateLogo` and `@keyframes continuousRotate` in `styles.css`
- **Button Effects**: Update hover and active states in `styles.css`
- **Transitions**: Adjust timing and easing in CSS transitions

### Customizing Functionality
- **Button Actions**: Modify event listeners in `script.js`
- **Window Properties**: Update window configuration in `main.js`
- **App Metadata**: Change app details in `package.json`

## 🔧 Development

### Available Scripts
```bash
npm start          # Run the app
npm run dev        # Run with DevTools
npm run build      # Build for current platform
npm run build-mac  # Build for macOS
npm run build-win  # Build for Windows
npm run build-linux # Build for Linux
npm run dist       # Build all platforms
```

### File Sizes Explained
- **DMG/ZIP Size (~90MB)**: Normal for Electron apps
- **Electron Framework**: ~80-85MB (Chromium + Node.js + system libraries)
- **Your App Code**: ~5-10MB
- **Comparison**: Discord (~150MB), Slack (~200MB), VS Code (~300MB)

## 📋 Requirements

### System Requirements
- **macOS**: 10.14 or later
- **Windows**: Windows 10 or later
- **Linux**: Ubuntu 18.04 or later

### Development Requirements
- **Node.js**: v16 or higher
- **npm**: v7 or higher

## 🚀 Distribution

### For End Users
1. **Download** the appropriate DMG or ZIP file
2. **DMG**: Double-click to mount, drag app to Applications
3. **ZIP**: Extract and drag app to Applications
4. **Launch** from Applications or Launchpad

### For Developers
- **Source Code**: Available in this repository
- **Dependencies**: Listed in `package.json`
- **Build Process**: Uses electron-builder for packaging

## 🎨 Design Features

- **Minimalist Interface**: Clean, focused design
- **Smooth Animations**: Professional transitions and effects
- **Live Listening Indicator**: Rotating logo shows active voice processing
- **Responsive Layout**: Adapts to different screen sizes
- **Modern Typography**: System fonts for native feel

## 📝 License

MIT License - Feel free to use and modify as needed.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

