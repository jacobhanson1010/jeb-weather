import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClimacellService} from '../../service/climacell.service';
import {WeeklyForecast} from '../../domain/climacell/daily/WeeklyForecast';
import {WeekDay} from '@angular/common';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss'],
  animations: [
    trigger('smoothCollapse', [
      state('initial', style({
        height:'0',
        overflow:'hidden',
        opacity:'0'
      })),
      state('final', style({
        overflow:'hidden',
        opacity:'1'
      })),
      transition('initial=>final', animate('250ms')),
      transition('final=>initial', animate('250ms'))
    ]),
  ]
})
export class ForecastComponent implements OnInit, OnDestroy {

  constructor(private climacell: ClimacellService) {
  }

  forecast: WeeklyForecast = new WeeklyForecast();

  forecastSubscription: Subscription;
  ngOnInit(): void {
    this.forecastSubscription = this.climacell.dailyForecast.subscribe(f => {
      // Need to create a copy of the days array, since we're going to be modifying it
      this.forecast = new WeeklyForecast(f.days.slice());
      this.forecast.days.splice(0, 1);
      console.info('forecast component got the forecast', this.forecast);
    });
  }

  getDayOfWeek(i: number): string {
    return WeekDay[i].substr(0, 3);
  }

  ngOnDestroy() {
    if (this.forecastSubscription) {
      this.forecastSubscription.unsubscribe();
    }
  }
}
