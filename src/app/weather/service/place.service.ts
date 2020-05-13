import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {Place} from '../domain/Place';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  constructor(private router: Router) {
  }

  private place = new ReplaySubject<Place>(1);

  getPlace() {
    return this.place.asObservable();
  }

  retrievePlaceFromURL(coords?: string) {
    if (!coords) {
      this.useDefaultPlace();
      return;
    }

    let latlong = coords.split(',');

    let paramPlace: Place = {
      latitude: Number(latlong[0]),
      longitude: Number(latlong[1])
    };
    paramPlace.name = ''; // TODO: lookup location name

    if (!paramPlace.latitude || !paramPlace.longitude) {
      this.useDefaultPlace();
    } else {
      this.place.next(paramPlace);
    }
  }

  retrieveGPSPlace() {

    navigator.geolocation.getCurrentPosition((resp: Position) => {
        let gpsPlace: Place = {
          latitude: resp.coords.latitude,
          longitude: resp.coords.longitude
        };
        this.usePlace(gpsPlace);
      },
      error => {
        if (error.code == error.PERMISSION_DENIED) {
          this.place.error('You must allow location access.');
        } else {
          this.place.error('Could not retrieve your location.');
        }
      });
  }

  private useDefaultPlace() {

    let defaultPlace: Place = {
      latitude: 33.057361,
      longitude: -96.750465,
      name: 'Plano, TX'
    };

    this.usePlace(defaultPlace);
  }

  usePlace(newPlace: Place) {
    this.router.navigate([`${newPlace.latitude},${newPlace.longitude}`]);
  }
}
