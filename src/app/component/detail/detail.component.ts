import {Component, Input, OnInit} from '@angular/core';
import {ForecastHour} from '../../domain/hourly/ForecastHour';
import {Segments} from '../../domain/Segments';
import {ClimacellService} from '../../service/climacell.service';
import {ValueUnitPair} from "../../domain/ValueUnitPair";
import {KeyValue} from "@angular/common";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  hours: ForecastHour[] = []; // next 24 hours from start

  selectedField: string;
  selectableFields = new Map([
    ['GUST', ['wind_gust', 'wind_direction']],
    ['WIND', ['wind_speed', 'wind_direction']],
    ['FEELS LIKE', ['feels_like']],
    ['TEMP', ['temp']],
    ['PRECIP PROB', ['precipitation_probability']],
    ['PRECIP RATE', ['precipitation']],
    ['CLOUD COVER', ['cloud_cover']],
  ]);

  // Comparator to preserve original property order
  originalOrder = (a: KeyValue<string, string[]>, b: KeyValue<string, string[]>): number => {
    return 0;
  };

  @Input() date: number;

  constructor(private climacell: ClimacellService) {
  }

  ngOnInit(): void {
    this.climacell.hourlyForecast.subscribe(hf => {
      if (this.date) {
        let startOfDateIndex = this.hours.findIndex(hour => {
          if (hour.observation_date.getDate() == this.date) {
            return true;
          }
        });
        this.hours = hf.hours.slice(startOfDateIndex, startOfDateIndex + 24);
      } else {
        this.hours = hf.hours.slice(0, 24);
      }

      this.selectedField = 'TEMP';
      console.debug('detail component got hours', this.hours);
    });
  }

  getSelectedFields(): ValueUnitPair[][] {
    if (!this.selectedField) {
      return [];
    }

    return this.hours.map(hour => {
      let fieldsForHour: ValueUnitPair[] = [];
      this.selectableFields.get(this.selectedField).forEach(field => {
        fieldsForHour.push(hour[field]);
      });
      return fieldsForHour;
    });
  }
}
