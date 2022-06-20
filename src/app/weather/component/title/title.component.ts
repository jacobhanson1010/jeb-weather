import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClimacellService} from '../../service/climacell.service';
import {ForecastFour} from '../../domain/climacell/hourly/ForecastFour';
import {Interval} from '../../domain/climacell/hourly/Interval';
import {ForecastDaily} from '../../domain/climacell/daily/ForecastDaily';
import {WeeklyForecast} from '../../domain/climacell/daily/WeeklyForecast';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit, OnDestroy {

  constructor(private climacell: ClimacellService) { }

  now: Interval;
  today: ForecastDaily;

  titleSubscription: Subscription;
  ngOnInit(): void {
    this.titleSubscription = this.climacell.hourlyForecast.subscribe((forecast: ForecastFour) => {
      this.now = forecast.hours[0];
      this.climacell.dailyForecast.subscribe((forecast: WeeklyForecast) => {
        this.today = forecast.days[0];
        if ((this.now.startTimeDate > this.today.sunset_date || this.now.startTimeDate < this.today.sunrise_date) &&
          ['clear', 'partly_cloudy'].includes(this.now.icon)) {
          this.now.icon += '_night';
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.titleSubscription) {
      this.titleSubscription.unsubscribe();
    }
  }
}
