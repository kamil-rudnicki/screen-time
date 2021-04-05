import { app, BrowserWindow, ipcMain } from 'electron';
import AutoLaunch from 'auto-launch';

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

ipcMain.on('splash-screen-loaded', (event, arg) => {
  const autoLaunch = new AutoLaunch({
    name: app.getName(),
    path: app.getPath('exe'),
  });
  autoLaunch.enable();
});

const createMainWindow = (): BrowserWindow => {
  const mainWindow = new BrowserWindow({
    height: 540,
    width: 490,
    minHeight: 200,
    minWidth: 200,
    minimizable: false,
    maximizable: false,
    titleBarStyle: 'hiddenInset',
    title: `${app.getName()}`,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  mainWindow.loadURL(`${MAIN_WINDOW_WEBPACK_ENTRY}`);
  // mainWindow.webContents.openDevTools();

  return mainWindow;
};

export default createMainWindow;
