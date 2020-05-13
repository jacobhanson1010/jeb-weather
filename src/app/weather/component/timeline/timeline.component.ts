import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClimacellService} from '../../service/climacell.service';
import {ForecastFour} from '../../domain/hourly/ForecastFour';
import {Segments} from '../../domain/Segments';
import {ForecastHour} from '../../domain/hourly/ForecastHour';
import {uuidv4} from '../../weather.component';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnDestroy {

  hours: ForecastHour[] = []; // first 24 hours
  segments: Segments = new Segments();

  id: string;

  constructor(private climacell: ClimacellService) {
  }

  timelineSubscription: Subscription;
  ngOnInit(): void {

    this.timelineSubscription = this.climacell.hourlyForecast.subscribe(hf => {
      this.hours = hf.hours.slice(0, 24);
      console.debug("timeline component got timeline", this.hours);
      this.segments = new Segments(this.hours);
      console.debug("segments", this.segments);
    });
  }

  ngOnDestroy() {
    if (this.timelineSubscription) {
      this.timelineSubscription.unsubscribe();
    }
  }
}
