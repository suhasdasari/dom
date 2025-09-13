#!/bin/bash

# Start Ollama server
echo "Starting Ollama server..."
ollama serve &

# Wait a moment for the server to start
sleep 3

# Pull the gpt-oss-20b model if not already available
echo "Checking for gpt-oss-20b model..."
ollama list | grep -q "gpt-oss-20b" || {
    echo "Pulling gpt-oss-20b model..."
    ollama pull gpt-oss-20b
}

echo "Ollama server is running with gpt-oss-20b model available!"
echo "You can now start the Electron app with: npm start"
