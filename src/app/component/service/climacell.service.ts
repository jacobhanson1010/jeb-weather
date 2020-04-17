import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ForecastHour} from "../../domain/hourly/ForecastHour";
import {BehaviorSubject, Observable, ReplaySubject} from "rxjs";
import {map, skip, take} from "rxjs/operators";
import {HourlyForecastFour} from "../../domain/hourly/HourlyForecastFour";
import {ForecastDaily} from "../../domain/daily/ForecastDaily";
import {WeeklyForecast} from "../../domain/daily/WeeklyForecast";

@Injectable({
  providedIn: 'root'
})
export class ClimacellService {

  constructor(private http: HttpClient) {
    this.retrieveHourly();
    this.retrieveDaily();
  }

  public hourlyForecast = new ReplaySubject<HourlyForecastFour>(1);
  public dailyForecast = new ReplaySubject<WeeklyForecast>(1);

  private headers() {
    return {
      headers: new HttpHeaders(
        { 'accept': 'application/json',
          'apikey': ''})
    };
  }

  retrieveHourly() {
    this.http.get("https://api.climacell.co/v3/weather/forecast/hourly?" +
      "lat=33.063190&" +
      "lon=-96.725220&" +
      "unit_system=us&" +
      "fields=temp,feels_like,wind_speed,wind_gust,wind_direction,sunrise,sunset,cloud_cover,weather_code&" +
      "start_time=now", this.headers())
      .pipe(
        take(96)
      ).subscribe((fc: any[]) => {
        let forecast = fc.map(f => new ForecastHour(f));
        this.hourlyForecast.next(new HourlyForecastFour(forecast));
      });
  }

  retrieveDaily() {
    this.http.get("https://api.climacell.co/v3/weather/forecast/daily?" +
      "lat=33.063190&" +
      "lon=-96.725220&" +
      "unit_system=us&" +
      "fields=sunrise,sunset,temp,feels_like,wind_speed,wind_direction,precipitation,precipitation_accumulation,precipitation_probability,weather_code&" +
      "start_time=now", this.headers())
      .subscribe((fc: any[]) => {
        fc.shift(); // remove "today"
        let forecast  = fc.map(f => new ForecastDaily(f));
        this.dailyForecast.next(new WeeklyForecast(forecast));
      });
  }
}
