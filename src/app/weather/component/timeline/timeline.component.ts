import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClimacellService} from '../../service/climacell.service';
import {Segments} from '../../domain/Segments';
import {Interval} from '../../domain/climacell/hourly/Interval';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnDestroy {

  hours: Interval[] = []; // first 24 hours
  segments: Segments = new Segments();

  id: string;

  constructor(private climacell: ClimacellService) {
  }

  timelineSubscription: Subscription;
  ngOnInit(): void {

    this.timelineSubscription = this.climacell.hourlyForecast.subscribe(hf => {
      this.hours = hf.hours.slice(0, 24);
      this.segments = new Segments(this.hours);
    });
  }

  ngOnDestroy() {
    if (this.timelineSubscription) {
      this.timelineSubscription.unsubscribe();
    }
  }
}
