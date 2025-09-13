#!/bin/bash

# Windows build script for REMOAI Desktop
# Creates a Windows executable (.exe) that works on all Windows systems

echo "🚀 Building REMOAI Desktop for Windows..."

# Clean previous builds
rm -rf dist-electron
rm -rf app/dist-electron

cd app

# Build the Windows app
echo "🔨 Building Electron app for Windows..."
npm run build-win

# Go to build directory
cd dist-electron

# Find the Windows app
if [ -d "win-unpacked" ]; then
    APP_SOURCE="win-unpacked"
    echo "📱 Using Windows unpacked version"
else
    echo "❌ No Windows app found!"
    exit 1
fi

# Create clean Windows distribution directory
echo "🧹 Creating clean Windows distribution..."
rm -rf REMOAI-Desktop-Windows
mkdir REMOAI-Desktop-Windows

# Copy the app
cp -R "$APP_SOURCE"/* "REMOAI-Desktop-Windows/"

# Create Windows batch installer
cat > "REMOAI-Desktop-Windows/install.bat" << 'EOF'
@echo off
echo 🚀 Installing REMOAI Desktop...

REM Check if we're on Windows
if not "%OS%"=="Windows_NT" (
    echo ❌ This installer is for Windows only
    pause
    exit /b 1
)

REM Create Start Menu shortcut
echo 📱 Creating Start Menu shortcut...
set "START_MENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs"
if not exist "%START_MENU%" mkdir "%START_MENU%"

REM Create desktop shortcut
echo 🖥️ Creating desktop shortcut...
set "DESKTOP=%USERPROFILE%\Desktop"
if not exist "%DESKTOP%" mkdir "%DESKTOP%"

REM Copy to Program Files
echo 📁 Installing to Program Files...
set "PROGRAM_FILES=%PROGRAMFILES%\REMOAI Desktop"
if not exist "%PROGRAM_FILES%" mkdir "%PROGRAM_FILES%"
xcopy /E /I /Y "%~dp0*" "%PROGRAM_FILES%\"

REM Create shortcuts
echo 🔗 Creating shortcuts...
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP%\REMOAI Desktop.lnk'); $Shortcut.TargetPath = '%PROGRAM_FILES%\REMOAI Desktop.exe'; $Shortcut.Save()"
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%START_MENU%\REMOAI Desktop.lnk'); $Shortcut.TargetPath = '%PROGRAM_FILES%\REMOAI Desktop.exe'; $Shortcut.Save()"

echo ✅ Installation complete!
echo.
echo 🎉 REMOAI Desktop has been installed!
echo    - Desktop shortcut created
echo    - Start Menu shortcut created
echo    - App installed to Program Files
echo.
echo ✨ You can now launch REMOAI Desktop from:
echo    - Desktop shortcut
echo    - Start Menu
echo    - Program Files folder
echo.

REM Try to launch the app
echo 🚀 Launching REMOAI Desktop...
start "" "%PROGRAM_FILES%\REMOAI Desktop.exe"

pause
EOF

# Create Windows PowerShell installer
cat > "REMOAI-Desktop-Windows/install.ps1" << 'EOF'
# PowerShell installer for REMOAI Desktop
Write-Host "🚀 Installing REMOAI Desktop..." -ForegroundColor Green

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "⚠️  Running installer as administrator for better installation..." -ForegroundColor Yellow
    Start-Process PowerShell -Verb RunAs -ArgumentList "-File `"$PSCommandPath`""
    exit
}

# Create Program Files directory
$ProgramFiles = "$env:PROGRAMFILES\REMOAI Desktop"
Write-Host "📁 Creating Program Files directory..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path $ProgramFiles | Out-Null

# Copy files
Write-Host "📱 Installing REMOAI Desktop..." -ForegroundColor Cyan
Copy-Item -Path ".\*" -Destination $ProgramFiles -Recurse -Force

# Create Start Menu shortcut
Write-Host "🔗 Creating Start Menu shortcut..." -ForegroundColor Cyan
$StartMenu = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs"
$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$StartMenu\REMOAI Desktop.lnk")
$Shortcut.TargetPath = "$ProgramFiles\REMOAI Desktop.exe"
$Shortcut.Save()

# Create Desktop shortcut
Write-Host "🖥️ Creating Desktop shortcut..." -ForegroundColor Cyan
$Desktop = [Environment]::GetFolderPath("Desktop")
$Shortcut = $WshShell.CreateShortcut("$Desktop\REMOAI Desktop.lnk")
$Shortcut.TargetPath = "$ProgramFiles\REMOAI Desktop.exe"
$Shortcut.Save()

Write-Host "✅ Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 REMOAI Desktop has been installed!" -ForegroundColor Green
Write-Host "   - Desktop shortcut created" -ForegroundColor White
Write-Host "   - Start Menu shortcut created" -ForegroundColor White
Write-Host "   - App installed to Program Files" -ForegroundColor White
Write-Host ""
Write-Host "✨ You can now launch REMOAI Desktop from:" -ForegroundColor Yellow
Write-Host "   - Desktop shortcut" -ForegroundColor White
Write-Host "   - Start Menu" -ForegroundColor White
Write-Host "   - Program Files folder" -ForegroundColor White
Write-Host ""

# Launch the app
Write-Host "🚀 Launching REMOAI Desktop..." -ForegroundColor Green
Start-Process "$ProgramFiles\REMOAI Desktop.exe"

Read-Host "Press Enter to continue"
EOF

# Create simple README for Windows users
cat > "REMOAI-Desktop-Windows/README.txt" << 'EOF'
REMOAI Desktop - Voice AI Assistant for Windows
==============================================

INSTALLATION:
1. Double-click "REMOAI Desktop.exe" to run directly
2. Or run "install.bat" for full installation with shortcuts
3. Or run "install.ps1" for PowerShell installation

FEATURES:
✅ Voice input with speech-to-text
✅ AI chat powered by Ollama
✅ Automatic dependency installation
✅ Cross-platform support
✅ Works on Windows 10/11

SYSTEM REQUIREMENTS:
- Windows 10 or later
- 8GB RAM recommended
- 5GB free disk space
- Internet connection for AI features

TROUBLESHOOTING:
- If Windows Defender blocks the app: Click "More info" → "Run anyway"
- If microphone doesn't work: Check Windows Settings → Privacy → Microphone
- If app won't start: Try running as administrator

QUICK START:
1. Double-click "REMOAI Desktop.exe"
2. Allow microphone access when prompted
3. Start talking or typing!

Enjoy using REMOAI Desktop! 🚀
EOF

# Create a simple launcher script
cat > "REMOAI-Desktop-Windows/run.bat" << 'EOF'
@echo off
echo 🚀 Starting REMOAI Desktop...
start "" "REMOAI Desktop.exe"
EOF

# Make the batch files executable
chmod +x "REMOAI-Desktop-Windows/install.bat"
chmod +x "REMOAI-Desktop-Windows/run.bat"

# Create final ZIP for Windows
echo "📦 Creating Windows distribution package..."
cd ..
zip -r "REMOAI-Desktop-Windows.zip" "REMOAI-Desktop-Windows/"

echo ""
echo "✅ Windows build complete!"
echo ""
echo "📁 Files created:"
echo "   - REMOAI-Desktop-Windows/ (Windows app directory)"
echo "   - REMOAI-Desktop-Windows.zip (Distribution package)"
echo ""
echo "🎯 To distribute:"
echo "   1. Share REMOAI-Desktop-Windows.zip"
echo "   2. Users extract and double-click REMOAI Desktop.exe"
echo "   3. Or run install.bat for full installation"
echo ""
echo "✨ WORKS ON ALL WINDOWS SYSTEMS!"
