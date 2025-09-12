document.addEventListener('DOMContentLoaded', function() {
    const landingPage = document.getElementById('landing-page');
    const mainInterface = document.getElementById('main-interface');
    const getStartedBtn = document.getElementById('get-started-btn');
    const micBtn = document.getElementById('mic-btn');
    const closeBtn = document.getElementById('close-btn');
    
    // Dependency checking elements
    const dependencyStatus = document.getElementById('dependency-status');
    const statusText = document.getElementById('status-text');
    const dependencyProgress = document.getElementById('dependency-progress');
    const successMessage = document.getElementById('success-message');
    const ossProgress = document.getElementById('oss-progress');
    const ossPercentage = document.getElementById('oss-percentage');
    const whisperProgress = document.getElementById('whisper-progress');
    const whisperPercentage = document.getElementById('whisper-percentage');

    // App state
    let dependenciesReady = false;

    // Initialize app on startup
    function initializeApp() {
        console.log('Initializing app...');
        // Enable the recording button immediately - let user try to use the app
        enableRecordingButton();
        
        // Start dependency checking in background (non-blocking)
        checkDependenciesInBackground();
    }

    // Check dependencies in background (non-blocking)
    function checkDependenciesInBackground() {
        // Show initial status briefly
        statusText.textContent = 'Checking dependencies...';
        
        // Start background check without blocking UI
        setTimeout(async () => {
            try {
                const response = await fetch('http://localhost:3001/api/dependencies/check');
                const data = await response.json();
                
                if (data.success && data.allInstalled) {
                    // All dependencies are already installed - hide everything silently
                    dependenciesReady = true;
                    console.log('Dependencies ready!');
                    setTimeout(() => {
                        dependencyStatus.classList.add('hidden');
                        successMessage.classList.add('hidden');
                    }, 500);
                } else {
                    // Some dependencies are missing, show progress
                    statusText.textContent = 'Installing missing dependencies...';
                    dependencyProgress.classList.remove('hidden');
                    downloadMissingDependencies();
                }
            } catch (error) {
                console.error('Error checking dependencies:', error);
                // Hide status silently if there's an error
                setTimeout(() => {
                    dependencyStatus.classList.add('hidden');
                }, 1000);
            }
        }, 1000);
    }

    // Check dependencies with real backend (legacy function for compatibility)
    async function checkDependencies() {
        return checkDependenciesInBackground();
    }

    // Download missing dependencies with real backend
    async function downloadMissingDependencies() {
        try {
            // Start download process
            const response = await fetch('http://localhost:3001/api/dependencies/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to start download');
            }
            
            // Poll for progress updates
            const progressInterval = setInterval(async () => {
                try {
                    const progressResponse = await fetch('http://localhost:3001/api/dependencies/progress');
                    const progressData = await progressResponse.json();
                    
                    if (progressData.success) {
                        const { oss, whisper } = progressData.progress;
                        
                        updateProgress('oss', oss.progress);
                        updateProgress('whisper', whisper.progress);
                        
                        // Check if both downloads are complete
                        if (oss.status === 'completed' && whisper.status === 'completed') {
                            clearInterval(progressInterval);
                            dependenciesReady = true;
                            console.log('All dependencies installed successfully!');
                            setTimeout(() => {
                                dependencyProgress.classList.add('hidden');
                                dependencyStatus.classList.add('hidden');
                                successMessage.classList.add('hidden');
                            }, 1000);
                        }
                        
                        // Check for errors
                        if (oss.status === 'error' || whisper.status === 'error') {
                            clearInterval(progressInterval);
                            statusText.textContent = 'Download failed. Please try again.';
                        }
                    }
                } catch (error) {
                    console.error('Error fetching progress:', error);
                }
            }, 500);
            
        } catch (error) {
            console.error('Error downloading dependencies:', error);
            statusText.textContent = 'Download failed. Please check backend connection.';
            // Show retry option
            setTimeout(() => {
                statusText.textContent = 'Click the recording button to retry.';
            }, 2000);
        }
    }

    // Update progress bar
    function updateProgress(type, value) {
        const progress = type === 'oss' ? ossProgress : whisperProgress;
        const percentage = type === 'oss' ? ossPercentage : whisperPercentage;
        
        progress.style.width = `${value}%`;
        percentage.textContent = `${Math.round(value)}%`;
    }

    // Enable recording button when dependencies are ready
    function enableRecordingButton() {
        getStartedBtn.disabled = false;
        getStartedBtn.style.opacity = '1';
        getStartedBtn.style.cursor = 'pointer';
        console.log('Recording button enabled - user can try to use the app');
    }

    // Show main interface when Get Started is clicked
    getStartedBtn.addEventListener('click', function() {
        // Always allow user to proceed - dependencies will be checked in background
        console.log('User clicked Get Started - proceeding to main interface');
        
        // Dependencies are ready, proceed to main interface
        landingPage.classList.remove('active');
        mainInterface.classList.add('active');
        
        // If dependencies aren't ready yet, show a helpful message
        if (!dependenciesReady) {
            transcriptionText.textContent = 'Dependencies are still installing in the background. You can try recording, but it may not work until installation is complete.';
        }
    });

    // Audio recording variables
    let mediaRecorder = null;
    let audioChunks = [];
    let isRecording = false;

    // Get transcription elements
    const transcriptionText = document.getElementById('transcription-text');
    const recordingStatus = document.getElementById('recording-status');
    const processingStatus = document.getElementById('processing-status');

    // Handle microphone button click
    micBtn.addEventListener('click', async function() {
        if (!isRecording) {
            await startRecording();
        } else {
            stopRecording();
        }
    });

    // Start audio recording
    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 16000
                } 
            });
            
            mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });
            
            audioChunks = [];
            
            mediaRecorder.ondataavailable = function(event) {
                audioChunks.push(event.data);
            };
            
            mediaRecorder.onstop = function() {
                processRecording();
            };
            
            mediaRecorder.start();
            isRecording = true;
            
            // Update UI
            transcriptionText.textContent = 'Recording... Speak now!';
            recordingStatus.classList.remove('hidden');
            micBtn.style.background = '#dc3545';
            
            console.log('Recording started');
            
        } catch (error) {
            console.error('Error starting recording:', error);
            transcriptionText.textContent = 'Error: Could not access microphone. Please check permissions.';
        }
    }

    // Stop audio recording
    function stopRecording() {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            isRecording = false;
            
            // Update UI
            recordingStatus.classList.add('hidden');
            processingStatus.classList.remove('hidden');
            transcriptionText.textContent = 'Processing your speech...';
            micBtn.style.background = '#f5f5f5';
            
            // Stop all audio tracks
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            
            console.log('Recording stopped');
        }
    }

    // Process the recorded audio
    async function processRecording() {
        try {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            
            // Convert blob to base64
            const reader = new FileReader();
            reader.onload = async function() {
                const base64Audio = reader.result.split(',')[1];
                await transcribeAudio(base64Audio);
            };
            reader.readAsDataURL(audioBlob);
            
        } catch (error) {
            console.error('Error processing recording:', error);
            transcriptionText.textContent = 'Error processing audio. Please try again.';
            processingStatus.classList.add('hidden');
            micBtn.style.background = '#f5f5f5';
        }
    }

    // Send audio to backend for transcription
    async function transcribeAudio(base64Audio) {
        try {
            const response = await fetch('http://localhost:3001/api/transcribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    audioData: base64Audio,
                    audioFormat: 'webm'
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                transcriptionText.textContent = data.transcription || 'No speech detected.';
                console.log('Transcription:', data.transcription);
            } else {
                // Check if it's a dependency issue
                if (data.error && data.error.includes('dependencies')) {
                    transcriptionText.textContent = 'Dependencies are still installing. Please wait a moment and try again.';
                } else {
                    transcriptionText.textContent = 'Error: ' + data.error;
                }
                console.error('Transcription error:', data.error);
            }
            
        } catch (error) {
            console.error('Error sending audio for transcription:', error);
            // Check if it's a connection issue
            if (error.message.includes('fetch')) {
                transcriptionText.textContent = 'Cannot connect to backend service. Please check if dependencies are installed.';
            } else {
                transcriptionText.textContent = 'Error connecting to transcription service.';
            }
        } finally {
            processingStatus.classList.add('hidden');
            micBtn.style.background = '#f5f5f5';
        }
    }

    // Handle close button click
    closeBtn.addEventListener('click', function() {
        console.log('Close button clicked');
        // Return to landing page and reset state
        mainInterface.classList.remove('active');
        landingPage.classList.add('active');
        
        // Don't restart dependency checking - just show current status
        if (dependenciesReady) {
            dependencyStatus.classList.add('hidden');
            successMessage.classList.add('hidden');
        } else {
            // Show a simple status message
            statusText.textContent = 'Dependencies are being checked in the background...';
            dependencyProgress.classList.add('hidden');
            successMessage.classList.add('hidden');
        }
    });

    // Add some interactive feedback
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // Initialize the app when DOM is loaded
    initializeApp();
});
