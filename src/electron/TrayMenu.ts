import { app, Tray, Menu, nativeImage } from 'electron';
import config from 'config';
import {TimeCampService} from '../app/TimeCamp';
import {toTimeString} from '../app/services/DateTimeHelpers';

export class TrayMenu {
  // Create a variable to store our tray
  // Public: Make it accessible outside of the class;
  // Readonly: Value can't be changed
  public readonly tray: Tray;

  // Path where should we fetch our icon;
  private iconPath = '/src/assets/tray.png';

  private secondsToday = 0;
  private lastTodayTotalTimeFromAPI = 0;

  constructor() {
    this.tray = new Tray(this.createNativeImage());
    this.tray.setContextMenu(this.createMenu());
    this.tray.setToolTip("Total time in front of the computer.");
    this.init();
  }

  private tick(): void {
    this.secondsToday++;
    this.tray.setTitle(toTimeString(this.secondsToday), {'fontType': 'monospacedDigit'});
  }

  private async refreshTotalTimeFromAPI() {
    const todayDate = new Date().toISOString().slice(0, 10);
    const timecamp = new TimeCampService(config.get('timecampApiKey'));
    const time = await timecamp.getTotalComputerTime(todayDate);
    if(time > this.lastTodayTotalTimeFromAPI) {
      this.lastTodayTotalTimeFromAPI = time;
      this.secondsToday = time;
      console.log(`Refreshed total time from API ${time}`);
    } else {
      console.log(`Refreshed total time from API is the same as before ${time}`);
    }
  }

  private async init() {
    this.refreshTotalTimeFromAPI();
    setInterval( this.tick.bind(this), 1000*1);
    setInterval( this.refreshTotalTimeFromAPI.bind(this), 1000*60*3);
  }

  private createNativeImage() {
    const path = `${app.getAppPath()}${this.iconPath}`;
    const image = nativeImage.createFromPath(path);
    image.setTemplateImage(true);
    return image;
  }

  private createMenu(): Menu {
    const contextMenu = Menu.buildFromTemplate([
      // {
      //   label: 'Tokei',
      //   type: 'normal',
      //   click: () => { 
      //     /* Later this will open the Main Window */ 
      //   }
      // },
      {
        label: 'Quit',
        type: 'normal',
        click: () => app.quit()
      }
    ]);
    return contextMenu;
  }
}