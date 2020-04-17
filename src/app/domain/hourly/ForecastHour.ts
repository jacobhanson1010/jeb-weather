import {ValueUnitPair} from "../ValueUnitPair";

export class ForecastHour {
  lat: number;
  lon: number;
  precipitation: ValueUnitPair;
  precipitation_type: { value: string };
  precipitation_probability: ValueUnitPair;
  temp: ValueUnitPair;
  feels_like: ValueUnitPair;
  wind_speed: ValueUnitPair;
  wind_gust: ValueUnitPair;
  wind_direction: ValueUnitPair;
  cloud_cover: ValueUnitPair;
  sunrise: Date;
  sunset: Date;
  weather_code: { value: string };
  observation_time: Date;

  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}
