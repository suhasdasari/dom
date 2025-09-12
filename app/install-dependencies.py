#!/usr/bin/env python3
"""
REMOAI Desktop - Dependency Installer
This script installs required dependencies for Whisper and OpenAI OSS models
after the user has installed the main application.
"""

import os
import sys
import subprocess
import platform
import json
import time
from pathlib import Path

class DependencyInstaller:
    def __init__(self):
        self.system = platform.system().lower()
        self.arch = platform.machine().lower()
        self.install_dir = self.get_install_directory()
        self.dependencies = {
            'whisper': {
                'package': 'openai-whisper',
                'description': 'OpenAI Whisper for speech recognition',
                'size': '~1.5GB'
            },
            'torch': {
                'package': 'torch',
                'description': 'PyTorch for AI model execution',
                'size': '~2GB'
            },
            'transformers': {
                'package': 'transformers',
                'description': 'Hugging Face Transformers for language models',
                'size': '~500MB'
            },
            'numpy': {
                'package': 'numpy',
                'description': 'NumPy for numerical computations',
                'size': '~50MB'
            },
            'scipy': {
                'package': 'scipy',
                'description': 'SciPy for scientific computing',
                'size': '~100MB'
            }
        }
        
    def get_install_directory(self):
        """Get the appropriate installation directory based on OS"""
        if self.system == 'darwin':  # macOS
            return Path.home() / 'Library' / 'Application Support' / 'REMOAI Desktop'
        elif self.system == 'windows':
            return Path.home() / 'AppData' / 'Local' / 'REMOAI Desktop'
        else:  # Linux
            return Path.home() / '.local' / 'share' / 'REMOAI Desktop'
    
    def create_install_directory(self):
        """Create the installation directory if it doesn't exist"""
        self.install_dir.mkdir(parents=True, exist_ok=True)
        print(f"Installation directory: {self.install_dir}")
    
    def check_python_version(self):
        """Check if Python version is compatible"""
        version = sys.version_info
        if version.major < 3 or (version.major == 3 and version.minor < 8):
            print("❌ Python 3.8 or higher is required")
            print(f"Current version: {version.major}.{version.minor}.{version.micro}")
            return False
        print(f"✅ Python version: {version.major}.{version.minor}.{version.micro}")
        return True
    
    def check_pip(self):
        """Check if pip is available"""
        try:
            subprocess.run([sys.executable, '-m', 'pip', '--version'], 
                         check=True, capture_output=True)
            print("✅ pip is available")
            return True
        except subprocess.CalledProcessError:
            print("❌ pip is not available")
            return False
    
    def install_package(self, package_name, description, size):
        """Install a Python package"""
        print(f"\n📦 Installing {description} ({size})...")
        try:
            # Use --user flag to install in user directory
            cmd = [sys.executable, '-m', 'pip', 'install', '--user', package_name]
            
            # Add specific flags for Whisper
            if package_name == 'openai-whisper':
                cmd.extend(['--upgrade'])
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                print(f"✅ {description} installed successfully")
                return True
            else:
                print(f"❌ Failed to install {description}")
                print(f"Error: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Error installing {description}: {str(e)}")
            return False
    
    def download_whisper_models(self):
        """Download Whisper models"""
        print("\n🎤 Downloading Whisper models...")
        try:
            # Use subprocess to run Python with proper environment
            import subprocess
            python_script = f"""
import sys
import site
user_site = site.getusersitepackages()
if user_site not in sys.path:
    sys.path.insert(0, user_site)

try:
    import whisper
    model = whisper.load_model("base")
    print("SUCCESS: Whisper base model downloaded")
except Exception as e:
    print(f"ERROR: {{e}}")
    sys.exit(1)
"""
            
            result = subprocess.run([sys.executable, '-c', python_script], 
                                  capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✅ Whisper base model downloaded successfully")
                return True
            else:
                print(f"❌ Error downloading Whisper models: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Error downloading Whisper models: {str(e)}")
            return False
    
    def create_config_file(self):
        """Create configuration file for the app"""
        config = {
            'dependencies_installed': True,
            'install_date': time.strftime('%Y-%m-%d %H:%M:%S'),
            'python_version': f"{sys.version_info.major}.{sys.version_info.minor}",
            'system': self.system,
            'architecture': self.arch,
            'install_directory': str(self.install_dir),
            'whisper_model': 'base'
        }
        
        config_file = self.install_dir / 'config.json'
        with open(config_file, 'w') as f:
            json.dump(config, f, indent=2)
        
        print(f"✅ Configuration saved to {config_file}")
    
    def install_all_dependencies(self):
        """Install all required dependencies"""
        print("🚀 Starting REMOAI Desktop dependency installation...")
        print("=" * 60)
        
        # Pre-installation checks
        if not self.check_python_version():
            return False
        
        if not self.check_pip():
            return False
        
        # Create installation directory
        self.create_install_directory()
        
        # Install dependencies
        success_count = 0
        total_count = len(self.dependencies)
        
        for dep_name, dep_info in self.dependencies.items():
            if self.install_package(dep_info['package'], dep_info['description'], dep_info['size']):
                success_count += 1
        
        # Download Whisper models
        if success_count == total_count:
            if self.download_whisper_models():
                self.create_config_file()
                print("\n🎉 All dependencies installed successfully!")
                print("You can now use REMOAI Desktop with full voice recognition capabilities.")
                return True
        
        print(f"\n⚠️  {success_count}/{total_count} dependencies installed successfully")
        return False

def main():
    """Main installation function"""
    installer = DependencyInstaller()
    
    try:
        success = installer.install_all_dependencies()
        if success:
            print("\n✅ Installation completed successfully!")
            input("\nPress Enter to continue...")
            sys.exit(0)
        else:
            print("\n❌ Installation failed. Please check the errors above.")
            input("\nPress Enter to continue...")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n\n⚠️  Installation cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")
        input("\nPress Enter to continue...")
        sys.exit(1)

if __name__ == "__main__":
    main()
