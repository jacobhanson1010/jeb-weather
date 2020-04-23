import { Component, OnInit } from '@angular/core';
import {ClimacellService} from '../../service/climacell.service';
import {ForecastFour} from '../../domain/hourly/ForecastFour';
import {Segments} from '../../domain/Segments';
import {ForecastHour} from '../../domain/hourly/ForecastHour';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  hours: ForecastHour[] = []; // first 24 hours
  segments: Segments = new Segments();

  constructor(private climacell: ClimacellService) {
  }

  ngOnInit(): void {
    this.climacell.hourlyForecast.subscribe(hf => {
      this.hours = hf.hours.slice(0, 24);
      console.debug("timeline component got timeline", this.hours);
      this.segments = new Segments(this.hours);
      console.debug("segments", this.segments);
    });
  }

}
