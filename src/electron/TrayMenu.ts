import {
  app,
  Tray,
  Menu,
  nativeImage,
  ipcMain,
  MenuItemConstructorOptions,
} from 'electron';
import log from 'electron-log';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import Store from 'electron-store';
import createPreferencesWindow from './PreferencesWindow';
import toTimeString from '../app/services/DateTimeHelpers';
import TimeCampDayStats from '../app/services/TimeCampDayStats';
import createMainWindow from './MainWindow';

export default class TrayMenu {
  public readonly tray: Tray;

  private iconPath = 'assets/tray.png';

  private secondsToday = 0;

  private lastTodayTotalTimeFromAPI = 0;

  private currentDay: string;

  private store: Store;

  private timecampService: TimeCampDayStats;

  constructor() {
    this.tray = new Tray(this.createNativeImage());
    this.tray.setToolTip('Screen time today.');

    this.currentDay = dayjs().format('YYYY-MM-DD');

    this.store = new Store({ encryptionKey: 'jf2n3Kr3h' });

    this.timecampService = new TimeCampDayStats(this.store.get('apiToken'));

    if (this.store.get('apiToken') === '' || this.store.get('apiToken') === undefined) {
      createMainWindow();
    }

    ipcMain.on('apiToken-changed', (event, arg) => {
      this.store.set('apiToken', arg);
      this.timecampService.updateApiKey(arg);
      this.refreshTotalTimeFromAPI();
    });

    this.init();
  }

  private tick(): void {
    this.secondsToday += 1;
    this.tray.setTitle(toTimeString(this.secondsToday), { fontType: 'monospacedDigit' });
  }

  private async refreshTotalTimeFromAPI() {
    const todayDate = new Date().toISOString().slice(0, 10);
    const time = await this.timecampService.getTotalComputerTime(todayDate);
    if (time > this.lastTodayTotalTimeFromAPI) {
      this.lastTodayTotalTimeFromAPI = time;
      this.secondsToday = time;
      log.info(`Refreshed total time from API ${time}`);
    } else if (this.currentDay !== dayjs().format('YYYY-MM-DD')) {
      this.secondsToday = 0;
      this.lastTodayTotalTimeFromAPI = 0;
      this.currentDay = dayjs().format('YYYY-MM-DD');
      log.info('Resetting current day');
    } else {
      log.info(`Refreshed total time from API is the same as before ${time}`);
    }

    let from: string;
    let dur2: string;
    let screenTime: string;
    if (this.timecampService.startTime) {
      dayjs.extend(duration);
      dayjs.extend(utc);
      from = this.timecampService.startTime.format('HH:mma');
      const dur = dayjs.duration(dayjs().diff(this.timecampService.startTime));
      dur2 = dayjs.utc(dur.asMilliseconds()).format('HH:mm');

      screenTime = dayjs.utc(this.secondsToday * 1000).format('HH:mm');

      if (dur.asMilliseconds() / 1000 < this.lastTodayTotalTimeFromAPI) {
        this.secondsToday = 0;
        this.lastTodayTotalTimeFromAPI = 0;
        this.currentDay = dayjs().format('YYYY-MM-DD');
      }

      //app.getWin.webContents.send('', isEnabled);
    }

    const menu = this.createMenu(from, dur2, screenTime);
    this.tray.setContextMenu(menu);
  }

  private async init() {
    this.refreshTotalTimeFromAPI();
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    setInterval(this.tick.bind(this), 1000 * 1);
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    setInterval(this.refreshTotalTimeFromAPI.bind(this), 1000 * 60 * 3);
  }

  // eslint-disable-next-line class-methods-use-this
  private createNativeImage() {
    const path2 = app.isPackaged ? `${app.getAppPath()}/.webpack/${this.iconPath}` : '/Library/WebServer/Documents/time2/src/assets/tray.png';
    const image = nativeImage.createFromPath(path2);
    image.setTemplateImage(true);
    return image;
  }

  // eslint-disable-next-line class-methods-use-this
  private createMenu(totalTime: string | undefined, clockedIn: string | undefined,
    screenTime: string | undefined): Menu {
    const arr: MenuItemConstructorOptions[] = [];

    if (totalTime !== undefined) {
      arr.push(
        {
          label: `Screen Time: ${screenTime}h`,
          type: 'normal',
          enabled: false,
        },
        {
          label: `From The Start: ${clockedIn}h`,
          type: 'normal',
          enabled: false,
        },
        {
          label: `Clocked In: ${totalTime}`,
          type: 'normal',
          enabled: false,
          toolTip: 'Start time of the computer and duration from clock in until now.',
        },
        /*{
          label: `Last Update: ${dayjs().format('HH:mma')}`,
          type: 'normal',
          enabled: false,
          toolTip: 'Start time of the computer and duration from clock in until now.',
        },*/
        {
          type: 'separator',
        },
      );
    }

    arr.push(
      {
        label: 'Stats...',
        type: 'normal',
        click: () => createMainWindow(),
      },
      {
        label: 'Add Time...',
        type: 'normal',
        accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Ctrl+I',
        click: () => createMainWindow(),
      },
      {
        type: 'separator',
      },
      {
        label: 'Preferences...',
        type: 'normal',
        click: () => createPreferencesWindow(),
      },
      {
        type: 'separator',
      },
      {
        label: 'Quit',
        type: 'normal',
        accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Alt+Shift+Q', // todo: for other platforms
        click: () => app.quit(),
      },
    );

    const contextMenu = Menu.buildFromTemplate(arr);
    return contextMenu;
  }
}
