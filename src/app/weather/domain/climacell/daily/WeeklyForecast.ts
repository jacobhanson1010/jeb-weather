import {ForecastDaily} from "./ForecastDaily";

export class WeeklyForecast {

  days: ForecastDaily[] = [];

  high: number = 0;
  low: number = 0;

  constructor(days?: ForecastDaily[]) {
    if (!days) {
      return;
    }

    this.days = days;

    this.low = Math.min(...this.days.map(fd => fd.temp_min.vup.value));
    this.high = Math.max(...this.days.map(fd => fd.temp_max.vup.value));
  }
}
