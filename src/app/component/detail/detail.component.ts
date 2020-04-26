import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
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
    ['CLOUD COVER', ['cloud_cover']]
  ]);
  fieldsDecimalPipe = new Map([
    ['GUST', '1.0-0'],
    ['WIND', '1.0-0'],
    ['FEELS LIKE', '1.0-0'],
    ['TEMP', '1.0-0'],
    ['PRECIP PROB', '1.0-0'],
    ['PRECIP RATE', '1.0-2'],
    ['CLOUD COVER', '1.0-0']
  ]);
  fieldsDisplayUnit = new Map([
    ['GUST', ''],
    ['WIND', ''],
    ['FEELS LIKE', '°'],
    ['TEMP', '°'],
    ['PRECIP PROB', '%'],
    ['PRECIP RATE', ''],
    ['CLOUD COVER', '%']
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

  getFieldsDecimalPipe(): string {
    return this.fieldsDecimalPipe.get(this.selectedField);
  }

  getFieldsUnit(): string {
    return this.fieldsDisplayUnit.get(this.selectedField);
  }

  getSpacerWidth(displayedVup: ValueUnitPair): number {
    if (!this.selectedField) {
      return 0;
    }

    if (displayedVup.units == '%') {
      return displayedVup.value / 100;
    }

    let maxForField = Math.max(...this.getSelectedFields().map((vup: ValueUnitPair[]) => {
      return vup[0].value;
    }));
    let minForField = Math.min(...this.getSelectedFields().map((vup: ValueUnitPair[]) => {
      return vup[0].value;
    }));

    if (maxForField == 0) {
      return 0;
    }

    return (displayedVup.value - minForField) / (maxForField - minForField);
  }

  getWeatherCodeWidth(): number {
    return Math.max(...this.hours.map(h => this.getTextWidth(h.segmentAttributes.label, null)));
  }

  /**
   * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
   *
   * @param {String} text The text to be rendered.
   * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
   *
   * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
   */
  private textWidthCanvas;
  private getTextWidth(text, font): number {
    // re-use canvas object for better performance
    let canvas = this.textWidthCanvas || (this.textWidthCanvas = document.createElement("canvas"));
    let context = canvas.getContext("2d");
    // context.font = font;
    let metrics = context.measureText(text);
    return metrics.width;
  }
}
