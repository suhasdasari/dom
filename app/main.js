const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const AutoInstaller = require("./installer");

let mainWindow;
let installer = new AutoInstaller();

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
      preload: path.join(__dirname, 'preload.js')
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

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
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
  ipcMain.handle('check-dependencies', async () => {
    return await installer.checkDependencies();
  });

  // Install dependencies
  ipcMain.handle('install-dependencies', async () => {
    return await installer.installAll();
  });

  // Get installation progress
  ipcMain.handle('get-install-progress', () => {
    return installer.getProgress();
  });

  // Check if installing
  ipcMain.handle('is-installing', () => {
    return installer.isInstallingInProgress();
  });
}
