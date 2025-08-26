const { contextBridge, ipcRenderer } = require('electron');

console.log('🔧 Preload script loaded - Setting up Electron API bridge');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Native confirmation dialog
  showConfirmDialog: (options) => ipcRenderer.invoke('show-confirm-dialog', options),
  
  // Native alert dialog  
  showAlertDialog: (options) => ipcRenderer.invoke('show-alert-dialog', options),
  
  // Native error dialog
  showErrorDialog: (options) => ipcRenderer.invoke('show-error-dialog', options),
  
  // Check if running in Electron
  isElectron: true
});

console.log('✅ Electron API exposed to renderer process');

// Also expose a global flag for checking if we're in Electron
window.isElectron = true;

// Test the API immediately
setTimeout(() => {
  console.log('🔍 Testing Electron API availability:', {
    electronAPI: typeof window.electronAPI,
    isElectron: window.isElectron,
    showConfirmDialog: typeof window.electronAPI?.showConfirmDialog
  });
}, 100);
