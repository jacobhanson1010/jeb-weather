import { Component, OnInit } from '@angular/core';
import {ClimacellService} from '../../service/climacell.service';
import {ForecastFour} from '../../domain/hourly/ForecastFour';
import {ForecastHour} from '../../domain/hourly/ForecastHour';
import {ForecastDaily} from '../../domain/daily/ForecastDaily';
import {WeeklyForecast} from '../../domain/daily/WeeklyForecast';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {

  constructor(private climacell: ClimacellService) { }

  now: ForecastHour;
  today: ForecastDaily;

  ngOnInit(): void {
    this.climacell.hourlyForecast.subscribe((forecast: ForecastFour) => {
      this.now = forecast.hours[0];
      this.climacell.dailyForecast.subscribe((forecast: WeeklyForecast) => {
        this.today = forecast.days[0];
        if ((this.now.observation_date > this.today.sunset_date || this.now.observation_date < this.today.sunrise_date) &&
          ['clear', 'partly_cloudy'].includes(this.now.icon)) {
          this.now.icon += '_night';
        }
      });
    });
  }

}
