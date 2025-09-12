#!/usr/bin/env python3
"""
REMOAI Desktop - Backend Service
Handles Whisper speech recognition and AI model processing
"""

import os
import sys
import json
import time
import threading
import subprocess
from pathlib import Path
import socket
import whisper
import torch
import numpy as np
from datetime import datetime

class REMOAIBackend:
    def __init__(self):
        self.config_file = self.get_config_path()
        self.config = self.load_config()
        self.whisper_model = None
        self.is_recording = False
        self.server_socket = None
        self.client_socket = None
        
    def get_config_path(self):
        """Get the configuration file path"""
        system = platform.system().lower()
        if system == 'darwin':  # macOS
            config_dir = Path.home() / 'Library' / 'Application Support' / 'REMOAI Desktop'
        elif system == 'windows':
            config_dir = Path.home() / 'AppData' / 'Local' / 'REMOAI Desktop'
        else:  # Linux
            config_dir = Path.home() / '.local' / 'share' / 'REMOAI Desktop'
        
        config_dir.mkdir(parents=True, exist_ok=True)
        return config_dir / 'config.json'
    
    def load_config(self):
        """Load configuration from file"""
        if self.config_file.exists():
            with open(self.config_file, 'r') as f:
                return json.load(f)
        return {}
    
    def check_dependencies(self):
        """Check if all required dependencies are installed"""
        try:
            # Add user site-packages to Python path
            import site
            user_site = site.getusersitepackages()
            if user_site not in sys.path:
                sys.path.insert(0, user_site)
            
            import whisper
            import torch
            import transformers
            return True
        except ImportError as e:
            # Don't print here to avoid JSON parsing issues
            return False
    
    def load_whisper_model(self):
        """Load the Whisper model"""
        try:
            if not self.check_dependencies():
                return False
            
            # Add user site-packages to Python path
            import site
            user_site = site.getusersitepackages()
            if user_site not in sys.path:
                sys.path.insert(0, user_site)
            
            # Don't print here to avoid JSON parsing issues
            import whisper
            self.whisper_model = whisper.load_model("base")
            return True
        except Exception as e:
            # Don't print here to avoid JSON parsing issues
            return False
    
    def transcribe_audio(self, audio_file_path):
        """Transcribe audio file using Whisper"""
        try:
            if not self.whisper_model:
                if not self.load_whisper_model():
                    return None
            
            # Don't print here to avoid JSON parsing issues
            result = self.whisper_model.transcribe(audio_file_path)
            return result["text"]
        except Exception as e:
            # Don't print here to avoid JSON parsing issues
            return None
    
    def start_server(self, port=12345):
        """Start the backend server"""
        try:
            self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            self.server_socket.bind(('localhost', port))
            self.server_socket.listen(1)
            
            # Don't print here to avoid JSON parsing issues
            
            while True:
                self.client_socket, address = self.server_socket.accept()
                
                # Handle client requests
                self.handle_client()
                
        except Exception as e:
            # Don't print here to avoid JSON parsing issues
            pass
        finally:
            if self.server_socket:
                self.server_socket.close()
    
    def handle_client(self):
        """Handle client requests"""
        try:
            while True:
                data = self.client_socket.recv(1024).decode('utf-8')
                if not data:
                    break
                
                try:
                    request = json.loads(data)
                    response = self.process_request(request)
                    self.client_socket.send(json.dumps(response).encode('utf-8'))
                except json.JSONDecodeError:
                    error_response = {"error": "Invalid JSON"}
                    self.client_socket.send(json.dumps(error_response).encode('utf-8'))
                    
        except Exception as e:
            # Don't print here to avoid JSON parsing issues
            pass
        finally:
            if self.client_socket:
                self.client_socket.close()
    
    def process_request(self, request):
        """Process incoming requests"""
        command = request.get('command')
        
        if command == 'check_dependencies':
            return {
                'status': 'success',
                'dependencies_installed': self.check_dependencies(),
                'whisper_loaded': self.whisper_model is not None
            }
        
        elif command == 'load_model':
            success = self.load_whisper_model()
            return {
                'status': 'success' if success else 'error',
                'message': 'Model loaded successfully' if success else 'Failed to load model'
            }
        
        elif command == 'transcribe':
            audio_file = request.get('audio_file')
            if not audio_file:
                return {'status': 'error', 'message': 'No audio file provided'}
            
            text = self.transcribe_audio(audio_file)
            if text:
                return {
                    'status': 'success',
                    'transcription': text,
                    'timestamp': datetime.now().isoformat()
                }
            else:
                return {'status': 'error', 'message': 'Transcription failed'}
        
        elif command == 'ping':
            return {'status': 'success', 'message': 'pong'}
        
        else:
            return {'status': 'error', 'message': f'Unknown command: {command}'}

def main():
    """Main function"""
    # Suppress all print statements to avoid JSON parsing issues
    import sys
    from contextlib import redirect_stdout, redirect_stderr
    import os
    
    # Redirect stdout and stderr to devnull to prevent interference with JSON output
    with open(os.devnull, 'w') as devnull:
        with redirect_stdout(devnull), redirect_stderr(devnull):
            backend = REMOAIBackend()
            
            # Check if dependencies are installed
            if not backend.check_dependencies():
                error_response = {"status": "error", "message": "Dependencies not installed"}
                print(json.dumps(error_response))
                sys.exit(1)
            
            # Load Whisper model
            if not backend.load_whisper_model():
                error_response = {"status": "error", "message": "Failed to load Whisper model"}
                print(json.dumps(error_response))
                sys.exit(1)
    
    # Start server (this will handle individual requests)
    try:
        backend.start_server()
    except KeyboardInterrupt:
        pass
    except Exception as e:
        error_response = {"status": "error", "message": f"Backend error: {e}"}
        print(json.dumps(error_response))
        sys.exit(1)

if __name__ == "__main__":
    import platform
    main()
