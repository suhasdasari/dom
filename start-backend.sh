#!/bin/bash

echo "Starting RDA Backend Service..."
echo "================================"

# Navigate to backend directory
cd backend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

# Start the backend server
echo "Starting backend server on http://localhost:3001"
npm start
