import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {ForecastHour} from '../domain/hourly/ForecastHour';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {map, skip, take} from 'rxjs/operators';
import {ForecastFour} from '../domain/hourly/ForecastFour';
import {ForecastDaily} from '../domain/daily/ForecastDaily';
import {WeeklyForecast} from '../domain/daily/WeeklyForecast';
import {Attributes} from '../domain/Segments';
import {PlaceService} from './place.service';
import {Place} from '../domain/Place';

@Injectable({
  providedIn: 'root'
})
export class ClimacellService {

  private place: Place;

  constructor(private http: HttpClient, private placeService: PlaceService) {
    placeService.getPlace().subscribe((place: Place) => {
        this.place = place;

        if (!this.getKeyFromStorage()) {
          if (!this.promptForKeyAndSave('Please enter your Climacell API key:')) {
            return;
          }
        }

        this.retrieveHourly();
        this.retrieveDaily();
      },
      (errorMessage: string) => {
        alert(errorMessage);
      });
  }

  public hourlyForecast = new ReplaySubject<ForecastFour>(1);
  public dailyForecast = new ReplaySubject<WeeklyForecast>(1);

  private headers() {
    return {
      headers: new HttpHeaders(
        {
          accept: 'application/json',
          apikey: this.getKeyFromStorage()
        })
    };
  }

  private promptForKeyAndSave(message: string): boolean {

    let apiKey = prompt(message);
    if (!apiKey) {
      alert('You must provide a Climacell API key.');
      return false;
    }
    window.localStorage.setItem('apiKey', apiKey.trim());
    return true;
  }

  private getKeyFromStorage() {
    return window.localStorage.getItem('apiKey');
  }

  private alreadyRePromptedForKey = false;

  private removeBadKeyFromStorageAndPromptForNew() {

    if (this.getKeyFromStorage() && !this.alreadyRePromptedForKey) {
      this.alreadyRePromptedForKey = true;
      window.localStorage.removeItem('apiKey');
      if (this.promptForKeyAndSave('Your Climacell API key was incorrect. Please try again:')) {
        window.location.reload();
      }
    }
  }

  private retrieveHourly() {
    this.http.get('https://api.climacell.co/v3/weather/forecast/hourly?' +
      'lat=' + this.place.latitude +
      '&lon=' + this.place.longitude +
      '&unit_system=us' +
      '&fields=temp,feels_like,precipitation_type,precipitation,precipitation_probability,wind_speed,wind_gust,wind_direction,sunrise,sunset,cloud_cover,weather_code' +
      '&start_time=now', this.headers())
      .subscribe((fc: any[]) => {
          this.hourlyForecast.next(new ForecastFour(fc.map(f => new ForecastHour(f))));
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          if (!error.ok) {
            this.removeBadKeyFromStorageAndPromptForNew();
          }
        }
      );
  }

  private retrieveDaily() {
    this.http.get('https://api.climacell.co/v3/weather/forecast/daily?' +
      'lat=' + this.place.latitude +
      '&lon=' + this.place.longitude +
      '&unit_system=us' +
      '&fields=sunrise,sunset,temp,feels_like,wind_speed,wind_direction,' +
      'precipitation,precipitation_accumulation,precipitation_probability,weather_code' +
      '&start_time=now', this.headers())
      .subscribe((fc: any[]) => {
          let forecast = fc.map(f => new ForecastDaily(f));
          let extraDays = 0;
          for (let f of forecast) {
            if (f.date.getUTCDate() != (new Date()).getDate()) {
              extraDays++;
            } else {
              break;
            }
          }
          forecast = forecast.slice(extraDays);
          this.dailyForecast.next(new WeeklyForecast(forecast));
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          if (!error.ok) {
            this.removeBadKeyFromStorageAndPromptForNew();
          }
        }
      );
  }
}
