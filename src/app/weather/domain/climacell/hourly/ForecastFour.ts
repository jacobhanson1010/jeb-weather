import {Interval} from './Interval';

export class ForecastFour {

  hours: Interval[] = [];

  constructor(forecastHours?: Interval[]) {
    if (!forecastHours) {
      return;
    }

    this.hours = forecastHours;
  }
}


