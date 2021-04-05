/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs, { Dayjs } from 'dayjs';
import TimeCampAPI from './TimeCampAPI';

export default class TimeCampDayStats {
  private apiKey: string;

  private api: TimeCampAPI;

  public totalTime: number;

  public startTime: Dayjs;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.api = new TimeCampAPI(apiKey);
  }

  public updateApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    this.api.updateApiKey(apiKey);
  }

  public async getTotalComputerTime(date: string): Promise<number> {
    const computerActivities = await this.api.getComputerActivities(date);
    let totalTime = 0;

    if (computerActivities && computerActivities.length) {
      computerActivities.forEach((element: any) => {
        totalTime += element.time_span;
      });

      this.totalTime = totalTime;

      this.startTime = dayjs(computerActivities[0].end_time);
      this.startTime.subtract(computerActivities[0].time_span, 'second');
    }

    return totalTime;
  }
}
