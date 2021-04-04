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

  // eslint-disable-next-line @typescript-eslint/ban-types
  async getComputerActivities(date: string): Promise<any[]> {
    try {
      const response = await this.instance.get(`/activity?dates[]=${date}`);
      return response.data;
    } catch (error) {
      return undefined;
    }
  }
}
