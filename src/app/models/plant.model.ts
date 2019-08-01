export class Plant {
    id: number;
    name: string;
    imageUrl: string;
    family: string;
    healthState: string;
    age: string;
    recommendation: number;
    temperature: number;
    humidity: number;
    moisture: number;
    timeMoisture: any;
    timeHumidity: any;
    timeTemperature: any;

    constructor(id, name, temperature, humidity, moisture, family, age, healthState, imageUrl,
                timeMoisture, timeHumidity, timeTemperature, recommendation) {
        this.id = id;
        this.name = name;
        this.family = family;
        this.healthState = healthState;
        this.age = age;
        this.moisture = Number(moisture);
        this.humidity = Number(humidity);
        this.temperature = Number(temperature);
        this.imageUrl = imageUrl;
        this.timeMoisture = timeMoisture;
        this.timeHumidity = timeHumidity;
        this.timeTemperature = timeTemperature;
        this.recommendation = Number(recommendation);
    }
}
