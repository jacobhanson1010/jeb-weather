import {ForecastHour} from "./ForecastHour";

export class ForecastDay {

  hours: ForecastHour[];

  high: number;
  low: number;

  constructor(oneDayOfForecastHours: ForecastHour[]) {

    this.hours = oneDayOfForecastHours;

    this.low = Math.min(...this.hours.map(fh => fh.temp.value));
    this.high = Math.max(...this.hours.map(fh => fh.temp.value));
  }
}
