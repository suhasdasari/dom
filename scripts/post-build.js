// Post-build script for Electron app
// This runs after the Electron app is built

const fs = require('fs');
const path = require('path');

console.log('🔧 Running post-build steps...');

// Create a simple launcher for the built app
const launcherScript = `#!/bin/bash
# REMOAI Desktop Launcher
# This script starts the necessary services and launches the app

echo "🚀 Starting REMOAI Desktop..."

# Check if Ollama is running
if ! curl -s http://localhost:11434/api/tags >/dev/null 2>&1; then
    echo "⚠️  Ollama is not running. Please start it first:"
    echo "   ollama serve"
    echo ""
    echo "   Or install Ollama from: https://ollama.ai"
    echo "   Press any key to continue anyway..."
    read -n 1
fi

# Start the Electron app
exec "$0" "$@"
`;

// Write launcher script
const outputDir = process.argv[2] || 'dist-electron';
const launcherPath = path.join(outputDir, 'start-remoa.sh');

fs.writeFileSync(launcherPath, launcherScript);
fs.chmodSync(launcherPath, '755');

console.log('✅ Post-build steps completed');
console.log(`📁 Output directory: ${outputDir}`);
console.log('🚀 Users can now run: ./start-remoa.sh');
