import {Interval} from './hourly/Interval';

interface Thing {
  thing1: Date;
  thing2: string;
  data: Record<string, unknown>;
  { ...obj, startTime: new Date(obj.startTime) }
}

export class Timeline {
  timestep: string;
  startTime: Date;
  endTime: Date;
  intervals: Interval[];

  setStartTimeDate(arg: string | Date) {
    const obj = {};
    return ;
  }

  getStartTimeDate() {
    return new Date(this.startTime);
  }

  constructor(obj?: any) {
    if (!obj) {
      return;
    }

    Object.assign(this, obj);
  }
}

export class Data {
  timelines: Timeline[];

  constructor(obj?: any) {
    if (!obj) {
      return;
    }

    Object.assign(this, obj);
  }
}

export class ClimacellResponse {
  data: Data;
  anotherField: string = 'asdasd';

  constructor(obj?: any) {
    if (!obj) {
      return;
    }

    Object.assign(this, obj);
  }
}
