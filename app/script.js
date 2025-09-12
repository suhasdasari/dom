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
    async function initializeApp() {
        console.log('Initializing app...');
        // Disable the recording button initially
        getStartedBtn.disabled = true;
        getStartedBtn.style.opacity = '0.5';
        getStartedBtn.style.cursor = 'not-allowed';
        
        // Start dependency checking immediately
        await checkDependencies();
    }

    // Check dependencies with real backend
    async function checkDependencies() {
        try {
            // Check current dependency status
            const response = await fetch('http://localhost:3001/api/dependencies/check');
            const data = await response.json();
            
            if (data.success && data.allInstalled) {
                // All dependencies are already installed
                setTimeout(() => {
                    statusText.textContent = 'All dependencies ready!';
                    setTimeout(() => {
                        dependencyStatus.classList.add('hidden');
                        successMessage.classList.remove('hidden');
                        // Enable the recording button
                        enableRecordingButton();
                    }, 1000);
                }, 1500);
            } else {
                // Some dependencies are missing, start download
                setTimeout(() => {
                    dependencyProgress.classList.remove('hidden');
                    downloadMissingDependencies();
                }, 1500);
            }
        } catch (error) {
            console.error('Error checking dependencies:', error);
            // Fallback to showing download progress
            setTimeout(() => {
                statusText.textContent = 'Connecting to backend...';
                dependencyProgress.classList.remove('hidden');
                downloadMissingDependencies();
            }, 1500);
        }
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
                            setTimeout(() => {
                                dependencyProgress.classList.add('hidden');
                                successMessage.classList.remove('hidden');
                                // Enable the recording button
                                enableRecordingButton();
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
        dependenciesReady = true;
        console.log('Dependencies ready! Recording button enabled.');
    }

    // Show main interface when Get Started is clicked
    getStartedBtn.addEventListener('click', function() {
        if (!dependenciesReady) {
            console.log('Dependencies not ready yet. Please wait...');
            return;
        }
        
        // Dependencies are ready, proceed to main interface
        landingPage.classList.remove('active');
        mainInterface.classList.add('active');
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
                transcriptionText.textContent = 'Error: ' + data.error;
                console.error('Transcription error:', data.error);
            }
            
        } catch (error) {
            console.error('Error sending audio for transcription:', error);
            transcriptionText.textContent = 'Error connecting to transcription service.';
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
        
        // Reset dependency checking state
        dependencyStatus.classList.remove('hidden');
        dependencyProgress.classList.add('hidden');
        successMessage.classList.add('hidden');
        statusText.textContent = 'Checking for dependencies...';
        ossProgress.style.width = '0%';
        whisperProgress.style.width = '0%';
        ossPercentage.textContent = '0%';
        whisperPercentage.textContent = '0%';
        dependenciesReady = false;
        
        // Restart dependency checking
        initializeApp();
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
