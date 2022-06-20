import {Attributes} from '../../Segments';
import {lookupWeatherCodeIcon, weatherCodeLookupMap} from '../WeatherCodeLookup';

export class Value {
  precipitation: number;
  precipitationType: number;
  precipitationProbability: number;
  temperature: number;
  temperatureApparent: number;
  windSpeed: number;
  windGust: number;
  windDirection: number;
  cloudCover: number;
  sunriseTime: Date;
  sunsetTime: Date;
  // weather_code: { value: string };
  // private observation_time: { value: string };
  // observation_date: Date;


  constructor(obj?: any) {
    if (!obj) {
      return;
    }

    Object.assign(this, obj);

    // Parse Dates
    // this.sunrise_date = new Date(this.sunrise.value);
    // this.sunset_date = new Date(this.sunset.value);
    // this.observation_date = new Date(this.observation_time.value);

    this.windDirection += 180;
    if (this.windDirection > 360) this.windDirection -= 360;
  }
}

export class Interval {
  startTime: string;
  startTimeDate: Date;
  values: Value;

  icon: string;
  segmentAttributes: Attributes;

  constructor(obj?: any) {
    if (!obj) {
      return;
    }

    Object.assign(this, obj);

    this.startTimeDate = new Date(this.startTime);

    // this.icon = lookupWeatherCodeIcon.get(this.weather_code.value);
    // this.segmentAttributes = weatherCodeLookupMap.get(this.weather_code.value);
  }
}
