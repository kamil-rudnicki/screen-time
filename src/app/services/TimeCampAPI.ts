import axios, { AxiosInstance } from 'axios';

export default class TimeCampAPI {
  apiKey: string;

  protected readonly instance: AxiosInstance;

  constructor(apiKey: string) {
    this.apiKey = apiKey;

    this.instance = axios.create({
      baseURL: 'https://app.timecamp.com/third_party/api/',
      timeout: 5000,
      headers: {
        Authorization: this.apiKey,
        Accept: 'application/json',
      },
    });
  }

  public updateApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    this.instance.defaults.headers.common.Authorization = apiKey;
    this.instance.defaults.headers.Authorization = apiKey;
  }

  async checkAPIToken(): Promise<boolean> {
    try {
      const response = await this.instance.get('/me');
      if (response.data.email) {
        return true;
      }
    } catch (error) {
      return false;
    }
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async getComputerActivities(date: string): Promise<any[]> {
    try {
      const response = await this.instance.get(`/activity?dates[]=${date}`);
      return response.data;
    } catch (error) {
      return undefined;
    }
  }

  async createTimeEntry(date: string, from: string, to: string, note: string, taskId: number, tagId: number): Promise<any[]> {
    try {
      const response = await this.instance.post('/entries', {
        date,
        start: from,
        end: to,
        note,
        task_id: taskId,
        tags: [{
          tagId,
        }],
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }
}
