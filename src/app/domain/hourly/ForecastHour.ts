import {ValueUnitPair} from "../ValueUnitPair";
import {Attributes} from '../Segments';
import {lookupWeatherCodeIcon, weatherCodeLookupMap} from '../WeatherCodeLookup';

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
  private sunrise: { value: string };
  sunrise_date: Date;
  private sunset: { value: string };
  sunset_date: Date;
  weather_code: { value: string };
  private observation_time: { value: string };
  observation_date: Date;
  icon: string;

  segmentAttributes: Attributes;

  constructor(obj?: any) {
    if (!obj) {
      return;
    }

    Object.assign(this, obj);

    // Parse Dates
    this.sunrise_date = new Date(this.sunrise.value);
    this.sunset_date = new Date(this.sunset.value);
    this.observation_date = new Date(this.observation_time.value);

    this.segmentAttributes = weatherCodeLookupMap.get(this.weather_code.value);
    this.icon = lookupWeatherCodeIcon.get(this.weather_code.value);
  }
}
