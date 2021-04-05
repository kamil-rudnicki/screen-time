import { app, BrowserWindow, ipcMain } from 'electron';
import AutoLaunch from 'auto-launch';

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

let preferencesWindow: BrowserWindow;

ipcMain.on('change-autostart', (event, arg) => {
  const autoLaunch = new AutoLaunch({
    name: 'Screen Time',
    path: app.getPath('exe'),
  });
  if (arg) autoLaunch.enable();
  else autoLaunch.disable();
});

ipcMain.on('settings-loaded', () => {
  const autoLaunch = new AutoLaunch({
    name: 'Screen Time',
    path: app.getPath('exe'),
  });
  autoLaunch.isEnabled().then((isEnabled) => {
    preferencesWindow.webContents.send('autostart-state', isEnabled);
  });
});

const createPreferencesWindow = (): BrowserWindow => {
  const mainWindow = new BrowserWindow({
    height: 440,
    width: 370,
    maxHeight: 800,
    maxWidth: 600,
    minHeight: 300,
    minWidth: 300,
    minimizable: false,
    maximizable: false,
    title: `Preferences - ${app.getName()}`,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  // mainWindow.webContents.openDevTools();

  preferencesWindow = mainWindow;

  return mainWindow;
};

export default createPreferencesWindow;
