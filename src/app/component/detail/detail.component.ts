import {AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ForecastHour} from '../../domain/hourly/ForecastHour';
import {Segments} from '../../domain/Segments';
import {ClimacellService} from '../../service/climacell.service';
import {ValueUnitPair} from '../../domain/ValueUnitPair';
import {KeyValue} from '@angular/common';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  fields = new Map();
  spacerWidths = new Map();

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

  uniqueId = this.uuidv4();

  constructor(private climacell: ClimacellService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.climacell.hourlyForecast.subscribe(hf => {
      if (this.date) {

        let startOfDateIndex = hf.hours.findIndex(hour => {
          return hour.observation_date.getDate() == this.date;
        });

        this.hours = hf.hours.slice(startOfDateIndex, startOfDateIndex + 24);
      } else {
        this.hours = hf.hours.slice(0, 24);
      }

      this.selectedField = 'TEMP';

      this.selectableFields.forEach((value, key) => {
        this.fields.set(key,
          this.hours.map(hour => {
            let fieldsForHour: ValueUnitPair[] = [];
            value.forEach(field => {
              fieldsForHour.push(hour[field]);
            });
            return fieldsForHour;
          }));

        this.spacerWidths.set(key, this.fields.get(key).map((hour: ValueUnitPair[]) => {
          let value = hour[0];

          if (value.units == '%') {
            return value.value / 100;
          }

          let maxForField = Math.max(...this.fields.get(key).map((vup: ValueUnitPair[]) => {
            return vup[0].value;
          }));
          let minForField = Math.min(...this.fields.get(key).map((vup: ValueUnitPair[]) => {
            return vup[0].value;
          }));

          console.debug('calculated spacer width');

          if (maxForField == 0) {
            return 0;
          }

          return (value.value - minForField) / (maxForField - minForField);
        }));
      });

      this.scrollIntoView(document.getElementById('TEMP'+this.uniqueId).parentElement);
      this.cdr.detectChanges();
    });
  }

  getSpacerWidth(i: number): number {
    if (!this.selectedField) {
      return 0;
    }

    return this.spacerWidths.get(this.selectedField)[i];
  }

  getSelectedFields(): ValueUnitPair[][] {
    return this.fields.get(this.selectedField);
  }

  private weatherCodeWidth;
  getWeatherCodeWidth(): number {
    if (!this.weatherCodeWidth) {
      this.weatherCodeWidth = Math.max(...this.hours.map(h => this.getTextWidth(h.segmentAttributes.label))) + 12;
    }
    return this.weatherCodeWidth;
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

  private getTextWidth(text: string): number {
    let body = document.getElementsByClassName('hour-rows')[0];

    // re-use canvas object for better performance
    let canvas = this.textWidthCanvas || (this.textWidthCanvas = document.createElement('canvas'));
    let context = canvas.getContext('2d');
    context.font = window.getComputedStyle(body).font;
    let metrics = context.measureText(text);
    return metrics.width;
  }

  scrollIntoView(e) {

    let element = e as HTMLElement;
    if (!element.classList.contains('btn')) {
      return;
    }

    let scrollContainer = element.parentElement.parentElement;

    scrollContainer.scrollTo({
      behavior: 'smooth',
      left: (element.offsetLeft) - (scrollContainer.clientWidth / 2) + (element.clientWidth / 2)
    });
  }

  private uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

}
