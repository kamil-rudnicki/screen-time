import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron';
import AutoLaunch from 'auto-launch';
import Store from 'electron-store';

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

ipcMain.on('splash-screen-loaded', (event, arg) => {
  const autoLaunch = new AutoLaunch({
    name: app.getName(),
    path: app.getPath('exe'),
  });
  autoLaunch.enable();
});

const createMainWindow = (): BrowserWindow => {
  const store = new Store({ encryptionKey: 'jf2n3Kr3h' });

  let opts = {
    height: 60,
    width: 490,
    minHeight: 60,
    minWidth: 200,
    frame: false,
    // minimizable: false,
    // maximizable: false,
    // titleBarStyle: 'hidden',
    title: `${app.getName()}`,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  };
  Object.assign(opts, store.get('winBounds'));

  const mainWindow = new BrowserWindow(opts);

  mainWindow.loadURL(`${MAIN_WINDOW_WEBPACK_ENTRY}`);
  // mainWindow.webContents.openDevTools();
  mainWindow.setMenuBarVisibility(false);

  mainWindow.on('close', () => {
    store.set('winBounds', mainWindow.getBounds());
  });

  return mainWindow;
};

app.whenReady().then(() => {
  globalShortcut.register('Alt+CommandOrControl+I', () => {
    createMainWindow();
  });
});

export default createMainWindow;
