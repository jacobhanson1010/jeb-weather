import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {ForecastHour} from '../domain/hourly/ForecastHour';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {map, skip, take} from 'rxjs/operators';
import {ForecastFour} from '../domain/hourly/ForecastFour';
import {ForecastDaily} from '../domain/daily/ForecastDaily';
import {WeeklyForecast} from '../domain/daily/WeeklyForecast';
import {Attributes} from '../domain/Segments';

@Injectable({
  providedIn: 'root'
})
export class ClimacellService {

  private coords: Coordinates;

  constructor(private http: HttpClient) {
    this.getPosition().then((coords: Coordinates) => {
        this.coords = coords;
        console.debug('got coords', coords);

        if (!this.getKeyFromStorage()) {
          this.setKeyIntoStorage(prompt('Please enter your Climacell API key:'));
          window.location.reload();
        } else {
          this.retrieveHourly();
          this.retrieveDaily();
        }
      },
      (error: PositionError) => {
        if (error.code == error.PERMISSION_DENIED) {
          alert('You must allow location access.');
        } else {
          alert('Could not retrieve your location.');
        }
      });
  }

  private getPosition(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition((resp: Position) => {
          resolve(resp.coords);
        },
        err => {
          reject(err);
        });
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

  private setKeyIntoStorage(key: string) {
    window.localStorage.setItem('apiKey', key.trim());
  }

  private getKeyFromStorage() {
    return window.localStorage.getItem('apiKey');
  }

  private removeBadKeyFromStorageAndPromptForNew() {
    if (this.getKeyFromStorage()) {
      window.localStorage.removeItem('apiKey');
      this.setKeyIntoStorage(prompt('Your Climacell API key was incorrect. Please try again:'));
      window.location.reload();
    }
  }

  private retrieveHourly() {
    this.http.get('https://api.climacell.co/v3/weather/forecast/hourly?' +
      'lat=33.063190&' +
      'lon=-96.725220&' +
      'unit_system=us&' +
      'fields=temp,feels_like,wind_speed,wind_gust,wind_direction,sunrise,sunset,cloud_cover,weather_code&' +
      'start_time=now', this.headers())
      .pipe(
        take(96)
      ).subscribe((fc: any[]) => {
        const forecast = fc.map(f => new ForecastHour(f));
        this.hourlyForecast.next(new ForecastFour(forecast));
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
      'lat=33.063190&' +
      'lon=-96.725220&' +
      'unit_system=us&' +
      'fields=sunrise,sunset,temp,feels_like,wind_speed,wind_direction,' +
      'precipitation,precipitation_accumulation,precipitation_probability,weather_code&' +
      'start_time=now', this.headers())
      .subscribe((fc: any[]) => {
          const forecast = fc.map(f => new ForecastDaily(f));
          let extraDays = 0;
          forecast.forEach(f => {
            if (f.date < new Date()) {
              extraDays++;
            }
          });
          for (let n = 0; n < extraDays - 1; n++) {
            forecast.shift();
          }
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
