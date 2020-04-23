import {ForecastHour} from './ForecastHour';

export class ForecastFour {

  hours: ForecastHour[] = [];

  constructor(forecastHours?: ForecastHour[]) {
    if (!forecastHours) {
      return;
    }

    this.hours = forecastHours;
  }
}


