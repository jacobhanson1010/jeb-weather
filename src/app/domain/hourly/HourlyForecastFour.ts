import {ForecastHour} from "./ForecastHour";
import {ForecastDay} from "./ForecastDay";

export class HourlyForecastFour {

  days: ForecastDay[] = [];

  constructor(forecastHours?: ForecastHour[]) {
    if (!forecastHours) {
      return;
    }

    this.partition(forecastHours, 24).forEach((oneDayOfForecastHours: ForecastHour[]) => {
      this.days.push(new ForecastDay(oneDayOfForecastHours));
    });
  }

  // Really?
  private partition(items, size) {
    let p = [];
    for (let i = Math.floor(items.length / size); i-- > 0; ) {
      p[i] = items.slice(i * size, (i + 1) * size);
    }
    return p;
  }
}


