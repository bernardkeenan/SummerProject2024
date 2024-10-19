const { app, BrowserWindow } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater'); // Import autoUpdater
const log = require('electron-log'); // Import logging utility for updates

// Configure logging for updates
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

function createWindow() {
  const win = new BrowserWindow({
    fullscreen: true, // Set window to full screen on launch
    webPreferences: {
      preload: path.join(__dirname, 'src', 'js', 'Menu.js'),
      contextIsolation: true,
    },
  });

  win.loadFile(path.join(__dirname, 'src', 'Menu.html'));

  // Check for updates when the window is created
  autoUpdater.checkForUpdatesAndNotify(); 
}

// Listen for update events
autoUpdater.on('update-available', (info) => {
  log.info('Update available:', info);
});

autoUpdater.on('update-not-available', (info) => {
  log.info('No update available:', info);
});

autoUpdater.on('error', (error) => {
  log.error('Error during update:', error);
});

autoUpdater.on('download-progress', (progress) => {
  log.info(`Download speed: ${progress.bytesPerSecond} - Downloaded ${progress.percent}%`);
});

autoUpdater.on('update-downloaded', () => {
  log.info('Update downloaded. Will install on restart.');
  autoUpdater.quitAndInstall(); // Automatically install the update on restart
});

// App ready event
app.whenReady().then(createWindow);

// Quit app when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Create a new window if the app is activated and there are no other windows
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

