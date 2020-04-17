import { Component, OnInit } from '@angular/core';
import {ClimacellService} from "../service/climacell.service";
import {HourlyForecastFour} from "../../domain/hourly/HourlyForecastFour";
import {WeeklyForecast} from "../../domain/daily/WeeklyForecast";
import {WeekDay} from "@angular/common";

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss']
})
export class ForecastComponent implements OnInit {

  constructor(private climacell: ClimacellService) {
  }

  forecast: WeeklyForecast = new WeeklyForecast();

  ngOnInit(): void {
    this.climacell.dailyForecast.subscribe(f => {
      this.forecast = f;
      console.info("forecast component got the forecast", this.forecast);
    });
  }

  getDayOfWeek(i: number): string {
    return WeekDay[i].substr(0, 3);
  }
}
