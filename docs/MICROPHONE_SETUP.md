# Microphone Setup Guide for REMOAI Desktop

## For DMG/Installed App Users

When you first use the microphone in the DMG version, macOS will ask for permission. Here's how to set it up:

### Step 1: First Launch

1. Open REMOAI Desktop
2. Click "Get Started"
3. Click the microphone button
4. macOS will show a permission dialog - click "Allow"

### Step 2: If Permission Was Denied

If you accidentally clicked "Don't Allow" or the microphone still doesn't work:

1. **Open System Preferences**

   - Click the Apple menu → System Preferences
   - Or go to System Settings (macOS Ventura+)

2. **Go to Security & Privacy**

   - Click "Security & Privacy"
   - Click the "Privacy" tab

3. **Enable Microphone Access**

   - Click "Microphone" in the left sidebar
   - Find "REMOAI Desktop" in the list
   - Check the box next to it

4. **Restart the App**
   - Quit REMOAI Desktop completely
   - Reopen the app
   - Try the microphone again

### Step 3: Test the Microphone

1. Click the microphone button
2. You should see it turn red and pulse (recording state)
3. Speak clearly
4. Click again to stop
5. Your speech should be transcribed and sent as a message

## Troubleshooting

### "Microphone access denied" Error

- Follow Step 2 above to enable microphone access
- Make sure you're using the latest version of the app

### "I didn't catch that" Message

- Speak louder and more clearly
- Make sure you're close to the microphone
- Try in a quieter environment

### Microphone Button Not Responding

- Check if the app has microphone permission (Step 2)
- Restart the app after granting permission
- Make sure no other app is using the microphone

### Still Not Working?

1. Check System Preferences → Security & Privacy → Microphone
2. Make sure "REMOAI Desktop" is checked
3. Try restarting your Mac
4. Reinstall the app if needed

## For Developers (npm start)

The development version works differently and should prompt for permission automatically in the browser.

---

**Need Help?** Check the main README.md or create an issue on GitHub.
