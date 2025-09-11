# Simple Desktop App (Monorepo)

# Remo: Your Privacy-First Personal AI Assistant

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/Platform-Windows%20Copilot%2B%20PC-blue)](https://www.microsoft.com/en-us/windows/copilot-plus-pc)
[![Snapdragon](https://img.shields.io/badge/Powered%20by-Snapdragon%20X%20Elite-orange)](https://www.qualcomm.com/products/mobile/snapdragon/smartphones/snapdragon-x-elite)

## Overview

Remo is a cutting-edge, multilingual personal AI assistant designed to run primarily on-device using the Qualcomm Snapdragon X Elite platform. It enables hands-free productivity with voice-activated tasks like reminders, alarms, task management, and more—powered by efficient neural processing unit (NPU) acceleration for rapid, private, and low-latency interactions.

## Team Information

- **Team Name**: Team REMO AI
- **Team Lead**: Suhas Dasari
- **Email**: [Your Email]
- **Team Members**:
  - [Member 1 Name] - [Email]
  - [Member 2 Name] - [Email]
  - [Member 3 Name] - [Email]
  - [Member 4 Name] - [Email]

## Features

### Core Capabilities

- 🎤 **Voice-Activated Commands**: Multilingual speech recognition using Whisper
- 📝 **Smart Task Management**: Create, update, and manage tasks and reminders
- ⏰ **Intelligent Alarms**: Set and manage alarms with contextual awareness
- 🍕 **Food Ordering**: Integration with food delivery services
- 📅 **Calendar Sync**: Smart scheduling and event management
- 📊 **Expense Tracking**: Personal finance management
- 🏥 **Health Reminders**: Hydration, medication, and fitness tracking
- 📧 **Email Management**: Smart sorting and actionable alerts

### Edge AI Advantages

- **Privacy-First**: All processing happens on-device
- **Low Latency**: Near real-time responses using NPU acceleration
- **Offline Capable**: Works without internet connection for core features
- **Energy Efficient**: Optimized for battery life on Snapdragon X Elite
- **Multilingual**: Supports multiple languages for global accessibility

## Technical Architecture

### Core Components

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Voice Input   │───▶│   Whisper STT    │───▶│   NLU Engine    │
│   (Microphone)  │    │   (NPU Optimized)│    │ (OpenAI OSS)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Task Output   │◀───│  Task Executor   │◀───│  Intent Parser  │
│   (Actions)     │    │   (Local Engine) │    │   (Local LLM)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Technology Stack

- **AI Models**: Whisper (Speech-to-Text), OpenAI OSS (Language Understanding)
- **Platform**: Windows Copilot+ PC with Snapdragon X Elite
- **AI Runtime**: ONNX Runtime with QNN Execution Provider
- **Development**: Python 3.11+, PyTorch, Transformers
- **UI Framework**: Tkinter/PyQt for desktop interface
- **Database**: SQLite for local data storage
- **Packaging**: PyInstaller for EXE generation

## Installation Instructions

### Prerequisites

1. **Hardware**: Windows Copilot+ PC with Snapdragon X Elite processor
2. **Software**:
   - Windows 11 (latest version)
   - Python 3.11 or higher
   - Visual Studio Code (recommended)

### Setup from Scratch

1. **Clone the Repository**

   ```bash
   git clone https://github.com/[your-username]/remo-ai-assistant.git
   cd remo-ai-assistant
   ```

2. **Install Dependencies**

   ```bash
   # Create virtual environment
   python -m venv venv
   venv\Scripts\activate  # Windows

   # Install requirements
   pip install -r requirements.txt
   ```

3. **Install Qualcomm AI Stack**

   ```bash
   # Install ONNX Runtime with QNN support
   pip install onnxruntime-qnn

   # Install Qualcomm AI Hub models
   pip install qualcomm-ai-hub
   ```

4. **Download AI Models**

   ```bash
   python scripts/download_models.py
   ```

5. **Configure Environment**

   ```bash
   # Copy and edit configuration
   copy config\config.example.json config\config.json
   # Edit config.json with your preferences
   ```

6. **Run the Application**
   ```bash
   python main.py
   ```

## Usage Instructions

### Voice Commands

- **"Remo, set a reminder for 3 PM to call mom"**
- **"Remo, what's my schedule for today?"**
- **"Remo, order pizza from Domino's"**
- **"Remo, track my expense of $25 for lunch"**
- **"Remo, remind me to drink water in 2 hours"**

### Text Commands

You can also type commands directly in the interface for silent operation.

### Settings

Access settings through the system tray icon or main interface to:

- Configure voice recognition language
- Set up food delivery preferences
- Manage calendar integrations
- Customize reminder types

## Development Setup

### Project Structure

```
remo-ai-assistant/
├── src/
│   ├── core/
│   │   ├── voice_processor.py      # Whisper integration
│   │   ├── nlu_engine.py          # Language understanding
│   │   ├── task_executor.py       # Task management
│   │   └── memory_manager.py      # Context and memory
│   ├── features/
│   │   ├── reminders.py           # Reminder system
│   │   ├── calendar_sync.py       # Calendar integration
│   │   ├── food_ordering.py       # Food delivery
│   │   ├── expense_tracker.py     # Finance tracking
│   │   └── health_monitor.py      # Health reminders
│   ├── ui/
│   │   ├── main_window.py         # Main interface
│   │   ├── settings_dialog.py     # Settings UI
│   │   └── system_tray.py         # System tray integration
│   └── utils/
│       ├── config_manager.py      # Configuration
│       ├── logger.py              # Logging system
│       └── privacy_manager.py     # Privacy controls
├── models/
│   ├── whisper/                   # Speech-to-text models
│   └── language/                  # Language models
├── config/
│   ├── config.example.json        # Example configuration
│   └── config.json               # User configuration
├── tests/
│   ├── test_voice_processor.py
│   ├── test_nlu_engine.py
│   └── test_task_executor.py
├── scripts/
│   ├── download_models.py         # Model download script
│   ├── build_exe.py              # EXE build script
│   └── optimize_models.py        # Model optimization
├── docs/
│   ├── api_reference.md
│   ├── development_guide.md
│   └── privacy_policy.md
├── requirements.txt
├── setup.py
├── main.py
└── README.md
```

### Running Tests

```bash
# Run all tests
python -m pytest tests/

# Run specific test
python -m pytest tests/test_voice_processor.py

# Run with coverage
python -m pytest tests/ --cov=src
```

## Building Executable

### Prerequisites for Building

1. Install PyInstaller: `pip install pyinstaller`
2. Install additional build tools: `pip install auto-py-to-exe`

### Build Process

```bash
# Method 1: Using PyInstaller directly
python scripts/build_exe.py

# Method 2: Using auto-py-to-exe (GUI)
auto-py-to-exe

# Method 3: Manual PyInstaller
pyinstaller --onefile --windowed --name="Remo" main.py
```

### Output

The build process creates:

- `dist/Remo.exe` - Standalone executable
- `build/` - Temporary build files
- `Remo.spec` - PyInstaller specification file

## Privacy and Security

### Data Handling

- **Voice Data**: Processed locally, never stored or transmitted
- **Personal Information**: Encrypted and stored locally only
- **Cloud Services**: Minimal usage, only for essential features with user consent
- **Privacy Controls**: Granular settings for data sharing preferences

### Security Features

- Local encryption for sensitive data
- No telemetry or usage tracking
- Open source for transparency
- Regular security audits

## Performance Optimization

### NPU Utilization

- Whisper model optimized for Snapdragon NPU
- Language models quantized for edge deployment
- Efficient memory management for continuous operation

### Energy Efficiency

- Smart wake word detection
- Background processing optimization
- Battery-aware task scheduling

## Troubleshooting

### Common Issues

1. **Voice Recognition Not Working**

   - Check microphone permissions
   - Verify Whisper model installation
   - Test with different audio input devices

2. **Slow Response Times**

   - Ensure NPU drivers are installed
   - Check model optimization status
   - Monitor system resources

3. **Installation Issues**
   - Verify Python version compatibility
   - Check Windows version requirements
   - Ensure all dependencies are installed

### Getting Help

- Check the [Issues](https://github.com/[your-username]/remo-ai-assistant/issues) page
- Join our [Discord community](https://discord.gg/remo-ai)
- Contact team at [team-email@example.com]

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Qualcomm Technologies for the Snapdragon X Elite platform
- OpenAI for open-source language models
- Whisper team for speech recognition capabilities
- The open-source community for various libraries and tools

## References

### Technical References

- [Qualcomm AI Hub Documentation](https://aihub.qualcomm.com)
- [ONNX Runtime QNN Provider](https://onnxruntime.ai/docs/execution-providers/QNN-ExecutionProvider.html)
- [Whisper Model Documentation](https://github.com/openai/whisper)
- [Snapdragon AI Stack Guide](https://docs.qualcomm.com/bundle/publicresource/topics/80-62010-1/ai-app-development.html)

### Sample Applications

- [NPU Chatbot with AnythingLLM](https://github.com/thatrandomfrenchdude/simple_npu_chatbot)
- [Live Transcription with Whisper](https://github.com/thatrandomfrenchdude/simple-whisper-transcription)
- [Edge Agent with LM Studio](https://github.com/thatrandomfrenchdude/local-agent)

## Changelog

### Version 1.0.0 (Hackathon Release)

- Initial release for Qualcomm Edge AI Hackathon
- Core voice recognition and task management
- Basic reminder and alarm functionality
- Food ordering integration
- Privacy-first architecture

---

**Built with ❤️ for the Qualcomm Edge AI Developer Hackathon 2025**

