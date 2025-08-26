const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const net = require('net');

let mainWindow;

// Function to check if port is in use
function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => resolve(false)); // Port is free
      server.close();
    });
    server.on('error', () => resolve(true)); // Port is in use
  });
}

// Function to find active Vite dev server
async function findVitePort() {
  const ports = [3000, 3001, 3002, 3003, 3004, 3005];
  
  for (const port of ports) {
    const inUse = await checkPort(port);
    if (inUse) {
      // Check if it's actually serving content (simple check)
      try {
        const http = require('http');
        const options = {
          hostname: 'localhost',
          port: port,
          path: '/',
          method: 'GET',
          timeout: 1000
        };
        
        await new Promise((resolve, reject) => {
          const req = http.request(options, (res) => {
            if (res.statusCode === 200) {
              resolve(port);
            } else {
              reject();
            }
          });
          req.on('error', reject);
          req.on('timeout', reject);
          req.setTimeout(1000);
          req.end();
        });
        
        return port; // Found active server
      } catch (error) {
        // Continue to next port
      }
    }
  }
  
  return 3000; // Default fallback
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
    },
    titleBarStyle: 'default',
    show: false
  });

  // Load the app - find active Vite dev server
  let startURL;
  if (isDev) {
    const activePort = await findVitePort();
    startURL = `http://localhost:${activePort}`;
    console.log(`🚀 Connecting to Vite dev server on port ${activePort}`);
  } else {
    startURL = `file://${path.join(__dirname, 'dist/index.html')}`;
  }

  mainWindow.loadURL(startURL);

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App event handlers
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Native dialog handlers for Arabic confirmation dialogs
ipcMain.handle('show-confirm-dialog', async (event, options) => {
  const result = await dialog.showMessageBox(mainWindow, {
    type: 'question',
    buttons: [options.confirmText || 'موافق', options.cancelText || 'إلغاء'],
    defaultId: 0,
    cancelId: 1,
    title: options.title || 'تأكيد',
    message: options.message,
    detail: options.detail || '',
    noLink: true
  });
  
  return result.response === 0; // true if confirmed, false if cancelled
});

// Native alert dialog (for success/error messages)
ipcMain.handle('show-alert-dialog', async (event, options) => {
  await dialog.showMessageBox(mainWindow, {
    type: options.type || 'info', // 'info', 'error', 'warning'
    buttons: [options.buttonText || 'موافق'],
    defaultId: 0,
    title: options.title || 'تنبيه',
    message: options.message,
    detail: options.detail || '',
    noLink: true
  });
});

// Native error dialog
ipcMain.handle('show-error-dialog', async (event, options) => {
  await dialog.showErrorBox(
    options.title || 'خطأ',
    options.message
  );
});
