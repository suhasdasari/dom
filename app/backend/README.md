# RDA Backend Service

This backend service handles dependency checking and downloading for the RDA desktop application.

## Features

- **Dependency Checking**: Checks if OpenAI OSS 2B and OpenAI Whisper are installed
- **Real Downloads**: Actually downloads and installs missing dependencies
- **Progress Tracking**: Provides real-time progress updates for downloads
- **REST API**: Clean API endpoints for frontend integration

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and timestamp.

### Check Dependencies
```
GET /api/dependencies/check
```
Returns the installation status of all required dependencies.

**Response:**
```json
{
  "success": true,
  "dependencies": {
    "oss": {
      "name": "OpenAI OSS 2B",
      "installed": false
    },
    "whisper": {
      "name": "OpenAI Whisper", 
      "installed": true
    }
  },
  "allInstalled": false
}
```

### Download Dependencies
```
POST /api/dependencies/download
```
Starts downloading missing dependencies. Returns immediately, use progress endpoint to track.

### Get Download Progress
```
GET /api/dependencies/progress
```
Returns current download progress for all dependencies.

**Response:**
```json
{
  "success": true,
  "progress": {
    "oss": {
      "progress": 45,
      "status": "downloading"
    },
    "whisper": {
      "progress": 100,
      "status": "completed"
    }
  }
}
```

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

   Or use the provided script:
   ```bash
   ./start-backend.sh
   ```

The server will start on `http://localhost:3001`.

## Dependencies Managed

### OpenAI OSS 2B
- Checks for model files in `./models/openai-oss-2b/`
- Simulates download progress (placeholder for actual model download)

### OpenAI Whisper
- Checks if `whisper` command is available
- Installs via `pip install openai-whisper`
- Real installation with progress tracking

## Development

For development with auto-restart:
```bash
npm run dev
```

This uses nodemon to automatically restart the server when files change.
