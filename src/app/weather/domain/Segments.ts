import {Interval} from './climacell/hourly/Interval';

export class Attributes {
  label: string;
  color: string;
  text: string;

  constructor(label: string, color: string, text: string) {
    this.label = label;
    this.color = color;
    this.text = text;
  }
}

export class Segment {
  attributes: Attributes;
  duration: number;
}

export class Segments {

  segments: Segment[] = [];

  constructor(hours?: Interval[]) {
    if (!hours) {
      return;
    }

    // group contiguous weather_codes
    const result: Interval[][] = hours.reduce((acc, forecastHour: Interval) => {
      // compare the current value with the last item in the collected array
      if (acc.length && acc[acc.length - 1][0].segmentAttributes.label == forecastHour.segmentAttributes.label) {
        // append the current value to it if it is matching
        acc[acc.length - 1].push(forecastHour);
      } else {
        // append a new array with only the current value at the end of the collected array
        acc.push([forecastHour]);
      }

      return acc;
    }, []);

    result.forEach((forecastHoursGroup: Interval[]) => {

      this.segments.push({
        attributes: forecastHoursGroup[0].segmentAttributes,
        duration: forecastHoursGroup.length
      });
    });
  }
}
