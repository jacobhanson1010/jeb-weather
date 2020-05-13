import {Component, OnDestroy, OnInit} from '@angular/core';
import {PlaceService} from '../../service/place.service';
import {Place} from '../../domain/Place';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(private placeService: PlaceService) {
  }

  placeName: string;

  headerSubscription: Subscription;
  ngOnInit(): void {
    this.headerSubscription = this.placeService.getPlace().subscribe((place: Place) => {
      this.placeName = place.name;
    });
  }

  locate() {
    this.placeService.retrieveGPSPlace();
  }

  ngOnDestroy() {
    if (this.headerSubscription) {
      this.headerSubscription.unsubscribe();
    }
  }
}
