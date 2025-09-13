const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const AutoInstaller = require("./installer");

let mainWindow;
let installer = new AutoInstaller();
let backendProcess = null;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      experimentalFeatures: true,
      preload: path.join(__dirname, "preload.js"),
    },
    resizable: false,
    frame: false,
    transparent: true,
    titleBarStyle: "hiddenInset",
  });

  // Load the index.html file
  mainWindow.loadFile("index.html");

  // Open DevTools in development
  if (process.argv.includes("--dev")) {
    mainWindow.webContents.openDevTools();
  }

  // Set up IPC handlers for installer
  setupInstallerHandlers();
}

// Start backend server
function startBackendServer() {
  if (backendProcess) {
    console.log("Backend server already running");
    return true;
  }

  console.log("🚀 Starting backend server...");
  const backendPath = path.join(__dirname, "backend", "server.js");

  backendProcess = spawn("node", [backendPath], {
    cwd: path.join(__dirname, "backend"),
    stdio: "inherit",
  });

  backendProcess.on("error", (error) => {
    console.error("Failed to start backend server:", error);
  });

  backendProcess.on("exit", (code) => {
    console.log(`Backend server exited with code ${code}`);
    backendProcess = null;
  });

  // Wait a moment for server to start
  setTimeout(() => {
    console.log("✅ Backend server should be running on http://localhost:3001");
  }, 2000);

  return true;
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  startBackendServer();
  createWindow();
});

// Quit when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Clean up backend process when app quits
app.on("before-quit", () => {
  if (backendProcess) {
    console.log("🛑 Stopping backend server...");
    backendProcess.kill();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Set up installer IPC handlers
function setupInstallerHandlers() {
  // Check dependencies
  ipcMain.handle("check-dependencies", async () => {
    return await installer.checkDependencies();
  });

  // Install dependencies
  ipcMain.handle("install-dependencies", async () => {
    return await installer.installAll();
  });

  // Get installation progress
  ipcMain.handle("get-install-progress", () => {
    return installer.getProgress();
  });

  // Check if installing
  ipcMain.handle("is-installing", () => {
    return installer.isInstallingInProgress();
  });

  // Start backend server
  ipcMain.handle("start-backend-server", async () => {
    try {
      startBackendServer();
      return true;
    } catch (error) {
      console.error("Failed to start backend server:", error);
      return false;
    }
  });
}
