// Preload script for Electron app
// Exposes safe APIs to the renderer process

const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  checkDependencies: () => ipcRenderer.invoke("check-dependencies"),
  installDependencies: () => ipcRenderer.invoke("install-dependencies"),
  getInstallProgress: () => ipcRenderer.invoke("get-install-progress"),
  isInstalling: () => ipcRenderer.invoke("is-installing"),
});
