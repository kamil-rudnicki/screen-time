import axios, {AxiosResponse, AxiosInstance} from 'axios';

class TimeCampAPI {
    apiKey: string;
    protected readonly instance: AxiosInstance;

    constructor(apiKey: string) {
        this.apiKey = apiKey;

        this.instance = axios.create({
            baseURL: 'https://app.timecamp.com/third_party/api/',
            timeout: 5000,
            headers: {
                'Authorization': this.apiKey,
                'Accept': 'application/json',
            }
          });
    }

    async getComputerActivities(date: string) {
        try {
            const response = await this.instance.get('/activity?dates[]=' + date);
            //console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
}

export class TimeCampService {
    apiKey: string;
    api: TimeCampAPI;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.api = new TimeCampAPI(apiKey);
    }

    async getTotalComputerTime(date: string): Promise<number> {
        let computerActivities = await this.api.getComputerActivities(date);
        let totalTime = 0;

        computerActivities.forEach( (element: any) => {
            totalTime += element.time_span;
        });

        return totalTime;
    }
}
