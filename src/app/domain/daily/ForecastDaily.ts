import {ValueUnitPair} from "../ValueUnitPair";
import {Attributes} from '../Segments';
import {lookupWeatherCodeIcon} from '../WeatherCodeLookup';

class MinMaxObservation {
  observation_time: string;
  min: ValueUnitPair;
  max: ValueUnitPair;
}

export class ValueUnitObservation {
  vup: ValueUnitPair;
  observation_time: Date;
}

export class ForecastDaily {
  private sunrise: { value: string };
  private sunset: { value: string };
  sunrise_date: Date;
  sunset_date: Date;
  private temp: MinMaxObservation[];
  temp_min: ValueUnitObservation;
  temp_max: ValueUnitObservation;
  precipitation_accumulation: ValueUnitPair;
  private precipitation: MinMaxObservation[];
  precipitation_min: ValueUnitObservation;
  precipitation_max: ValueUnitObservation;
  precipitation_probability: ValueUnitPair;
  private feels_like: MinMaxObservation[];
  feels_like_min: ValueUnitObservation;
  feels_like_max: ValueUnitObservation;
  private wind_speed: MinMaxObservation[];
  wind_speed_min: ValueUnitObservation;
  wind_speed_max: ValueUnitObservation;
  private wind_direction: MinMaxObservation[];
  wind_direction_min: ValueUnitObservation;
  wind_direction_max: ValueUnitObservation;
  weather_code: { value: string; };
  private observation_time: { value: string; };
  date: Date;
  lat: number;
  lon: number;
  icon: string;

  constructor(obj?: any) {
    Object.assign(this, obj);

    this.date = new Date(this.observation_time.value);
    this.sunrise_date = new Date(this.sunrise.value);
    this.sunset_date = new Date(this.sunset.value);
    this.temp_min = this.mmoToVuoMin(this.temp);
    this.temp_max = this.mmoToVuoMax(this.temp);
    this.precipitation_min = this.mmoToVuoMin(this.precipitation);
    this.precipitation_max = this.mmoToVuoMax(this.precipitation);
    this.feels_like_min = this.mmoToVuoMin(this.feels_like);
    this.feels_like_max = this.mmoToVuoMax(this.feels_like);
    this.wind_speed_min = this.mmoToVuoMin(this.wind_speed);
    this.wind_speed_max = this.mmoToVuoMax(this.wind_speed);
    this.wind_direction_min = this.mmoToVuoMin(this.wind_direction);
    this.wind_direction_max = this.mmoToVuoMax(this.wind_direction);

    this.icon = lookupWeatherCodeIcon.get(this.weather_code.value);
  }

  private mmoToVuoMin(mmo: MinMaxObservation[]): ValueUnitObservation {
    let vuo = null;
    mmo.forEach(m => {
      if (m.min) {
        vuo = new ValueUnitObservation();
        vuo.vup = m.min;
        vuo.observation_time = new Date(m.observation_time);
      }
    });
    return vuo;
  }

  private mmoToVuoMax(mmo: MinMaxObservation[]): ValueUnitObservation {
    let vuo = null;
    mmo.forEach(m => {
      if (m.max) {
        vuo = new ValueUnitObservation();
        vuo.vup = m.max;
        vuo.observation_time = new Date(m.observation_time);
      }
    });
    return vuo;
  }
}
