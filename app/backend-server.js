const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Multer configuration for file uploads
const upload = multer({
    dest: 'temp/',
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Global state for tracking installation progress
let installationProgress = {
    oss: { progress: 0, status: 'pending' },
    whisper: { progress: 0, status: 'pending' }
};

let installationProcess = null;

// Routes

// Check if dependencies are installed
app.get('/api/dependencies/check', async (req, res) => {
    try {
        const configPath = getConfigPath();
        
        if (fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            const allInstalled = config.dependencies_installed === true;
            
            res.json({
                success: true,
                allInstalled,
                config: config
            });
        } else {
            res.json({
                success: true,
                allInstalled: false,
                message: 'No configuration found'
            });
        }
    } catch (error) {
        console.error('Error checking dependencies:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to check dependencies'
        });
    }
});

// Start dependency installation
app.post('/api/dependencies/download', async (req, res) => {
    try {
        if (installationProcess) {
            return res.json({
                success: false,
                error: 'Installation already in progress'
            });
        }

        // Reset progress
        installationProgress = {
            oss: { progress: 0, status: 'downloading' },
            whisper: { progress: 0, status: 'downloading' }
        };

        // Start installation process
        const pythonScript = path.join(__dirname, 'install-dependencies.py');
        installationProcess = spawn('python3', [pythonScript], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        // Handle installation output
        installationProcess.stdout.on('data', (data) => {
            const output = data.toString();
            console.log('Installation output:', output);
            
            // Parse progress from output
            if (output.includes('Installing')) {
                updateProgress('oss', 25);
            }
            if (output.includes('Downloading Whisper')) {
                updateProgress('whisper', 50);
            }
            if (output.includes('Model downloaded')) {
                updateProgress('whisper', 100);
                installationProgress.whisper.status = 'completed';
            }
            if (output.includes('installed successfully')) {
                updateProgress('oss', 100);
                installationProgress.oss.status = 'completed';
            }
        });

        installationProcess.stderr.on('data', (data) => {
            console.error('Installation error:', data.toString());
        });

        installationProcess.on('close', (code) => {
            console.log(`Installation process exited with code ${code}`);
            installationProcess = null;
            
            if (code === 0) {
                // Installation successful
                installationProgress.oss.status = 'completed';
                installationProgress.whisper.status = 'completed';
            } else {
                // Installation failed
                installationProgress.oss.status = 'error';
                installationProgress.whisper.status = 'error';
            }
        });

        res.json({
            success: true,
            message: 'Installation started'
        });

    } catch (error) {
        console.error('Error starting installation:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to start installation'
        });
    }
});

// Get installation progress
app.get('/api/dependencies/progress', (req, res) => {
    res.json({
        success: true,
        progress: installationProgress
    });
});

// Transcribe audio
app.post('/api/transcribe', async (req, res) => {
    try {
        const { audioData, audioFormat } = req.body;
        
        if (!audioData) {
            return res.status(400).json({
                success: false,
                error: 'No audio data provided'
            });
        }

        // Create temp directory if it doesn't exist
        const tempDir = path.join(__dirname, 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Save base64 audio data to temporary file
        const audioFileName = `audio_${Date.now()}.${audioFormat || 'webm'}`;
        const audioFilePath = path.join(tempDir, audioFileName);
        
        // Convert base64 to buffer and save
        const audioBuffer = Buffer.from(audioData, 'base64');
        fs.writeFileSync(audioFilePath, audioBuffer);

        console.log('Audio file saved:', audioFilePath);

        // Use direct Python subprocess for transcription
        const pythonScript = `
import sys
import site
import json
import os

# Add user site-packages to Python path
user_site = site.getusersitepackages()
if user_site not in sys.path:
    sys.path.insert(0, user_site)

try:
    import whisper
    
    # Load the model
    model = whisper.load_model('base')
    
    # Transcribe the audio file
    result = model.transcribe('${audioFilePath}')
    
    # Output as JSON
    print(json.dumps({
        'status': 'success',
        'transcription': result['text'].strip()
    }))
    
except Exception as e:
    print(json.dumps({
        'status': 'error',
        'message': str(e)
    }))
    sys.exit(1)
`;

        const pythonProcess = spawn('python3', ['-c', pythonScript], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let responseData = '';
        pythonProcess.stdout.on('data', (data) => {
            responseData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error('Python error:', data.toString());
        });

        pythonProcess.on('close', (code) => {
            try {
                // Clean up temp file
                fs.unlinkSync(audioFilePath);
                
                if (responseData.trim()) {
                    const response = JSON.parse(responseData.trim());
                    
                    if (response.status === 'success') {
                        res.json({
                            success: true,
                            transcription: response.transcription
                        });
                    } else {
                        res.status(500).json({
                            success: false,
                            error: response.message || 'Transcription failed'
                        });
                    }
                } else {
                    res.status(500).json({
                        success: false,
                        error: 'No response from transcription service'
                    });
                }
            } catch (error) {
                console.error('Error parsing transcription response:', error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to process transcription'
                });
            }
        });

    } catch (error) {
        console.error('Error transcribing audio:', error);
        res.status(500).json({
            success: false,
            error: 'Transcription service error'
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'REMOAI Backend is running',
        timestamp: new Date().toISOString()
    });
});

// Helper functions
function getConfigPath() {
    const os = require('os');
    const homeDir = os.homedir();
    const platform = process.platform;
    
    let configDir;
    if (platform === 'darwin') {
        configDir = path.join(homeDir, 'Library', 'Application Support', 'REMOAI Desktop');
    } else if (platform === 'win32') {
        configDir = path.join(homeDir, 'AppData', 'Local', 'REMOAI Desktop');
    } else {
        configDir = path.join(homeDir, '.local', 'share', 'REMOAI Desktop');
    }
    
    return path.join(configDir, 'config.json');
}

function updateProgress(type, progress) {
    if (installationProgress[type]) {
        installationProgress[type].progress = Math.min(progress, 100);
    }
}

// Create temp directory if it doesn't exist
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Start server
app.listen(PORT, () => {
    console.log(`🚀 REMOAI Backend server running on port ${PORT}`);
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down REMOAI Backend server...');
    if (installationProcess) {
        installationProcess.kill();
    }
    process.exit(0);
});
