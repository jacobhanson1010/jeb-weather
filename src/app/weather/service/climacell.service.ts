import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Interval} from '../domain/climacell/hourly/Interval';
import {ReplaySubject} from 'rxjs';
import {ForecastFour} from '../domain/climacell/hourly/ForecastFour';
import {ForecastDaily} from '../domain/climacell/daily/ForecastDaily';
import {WeeklyForecast} from '../domain/climacell/daily/WeeklyForecast';
import {PlaceService} from './place.service';
import {Place} from '../domain/Place';
import {ClimacellResponse} from '../domain/climacell/ClimacellResponse';

@Injectable({
  providedIn: 'root'
})
export class ClimacellService {

  private place: Place;
  private baseAPIURL = 'https://api.tomorrow.io/v4/timelines?units=imperial';

  constructor(private http: HttpClient, private placeService: PlaceService) {
    placeService.getPlace().subscribe((place: Place) => {
        this.place = place;

        if (!this.getKeyFromStorage()) {
          if (!this.promptForKeyAndSave('Please enter your Climacell API key:')) {
            return;
          }
        }

        this.retrieveHourly();
        // this.retrieveDaily();
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

  private removeBadKeyFromStorageAndPromptForNew() {

    if (this.getKeyFromStorage()) {
      window.localStorage.removeItem('apiKey');
      if (this.promptForKeyAndSave('Your Climacell API key was incorrect. Please try again:')) {
        window.location.reload();
      }
    }
  }

  private alreadyAlertedOnError = false;

  private handleError(error: HttpErrorResponse) {

    if (this.alreadyAlertedOnError) {
      return;
    }
    console.error(error);
    this.alreadyAlertedOnError = true;

    if (error.status == 429) {
      alert('Out of requests.');
      return;
    }

    if (!error.ok) {
      this.removeBadKeyFromStorageAndPromptForNew();
    }
  }

  // ?location=33.057361,-96.75046&fields=sunriseTime,sunsetTime,temperature,temperatureApparent,windSpeed,windDirection,precipitationIntensity,rainAccumulation,precipitationProbability&timesteps=1h
  private retrieveHourly() {
    // this.http.get(this.baseAPIURL +
    //   '&location=' + this.place.latitude + ',' + this.place.longitude +
    //   '&fields=temperature,temperatureApparent,precipitationType,precipitationIntensity,precipitationProbability,windSpeed,windGust,windDirection,sunriseTime,sunsetTime,cloudCover',
    //   this.headers())
    //   .subscribe((climacellResponse: ClimacellResponse) => {
    //       console.debug(climacellResponse.data.timelines[0]);
    //     },
    //     (error: HttpErrorResponse) => {
    //       this.handleError(error);
    //     }
    //   );
    const mockTimeline = 'assets/climacell-dummy/timeline.json';
    return this.http.get<ClimacellResponse>(mockTimeline)
      .subscribe((climacellResponse) => {
          // const response: ClimacellResponse = climacellResponse as ClimacellResponse;
          console.debug(<ClimacellResponse>climacellResponse);
          this.hourlyForecast.next(new ForecastFour(climacellResponse.data.timelines[0].intervals));
        },
        (error: HttpErrorResponse) => {
          this.handleError(error);
        }
      );
  }

  private retrieveDaily() {
    this.http.get(this.baseAPIURL +
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
          this.handleError(error);
        }
      );
  }
}
