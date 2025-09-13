# Chat Setup Instructions

## Prerequisites

1. **Ollama installed**: Make sure you have Ollama installed on your system
2. **GPT OSS 20B model**: The model should be downloaded and available

## Starting the Application

### Option 1: Start with Ollama automatically

```bash
npm run start-with-ollama
```

This will:

- Start the Ollama server
- Check if the gpt-oss-20b model is available
- Pull the model if needed
- Start the Electron app

### Option 2: Start manually

1. First, start Ollama in a separate terminal:

   ```bash
   ollama serve
   ```

2. Make sure the gpt-oss-20b model is available:

   ```bash
   ollama list
   ```

   If not available, pull it:

   ```bash
   ollama pull gpt-oss-20b
   ```

3. Start the Electron app:
   ```bash
   npm start
   ```

## Using the Chat

1. Click the "Get Started" button on the landing page
2. You'll see a chat interface with a welcome message
3. Type your message in the input field and press Enter or click the send button
4. The app will send your message to the GPT OSS 20B model via Ollama
5. The AI response will appear in the chat

## Troubleshooting

- **Connection Error**: Make sure Ollama is running on `http://localhost:11434`
- **Model Not Found**: Ensure the gpt-oss-20b model is downloaded with `ollama pull gpt-oss-20b`
- **CORS Issues**: The app is configured to disable web security for local development

## Features

- Clean, modern chat interface
- Real-time conversation with GPT OSS 20B
- Keyboard shortcuts (Enter to send)
- Responsive design
- Error handling for connection issues
