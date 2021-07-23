import { Pipe, PipeTransform } from '@angular/core';

import * as dayjs from 'dayjs';

@Pipe({ name: 'appTimeHourDifference' })
export class TimeHourDifferencePipe implements PipeTransform {
  transform(value: any): number {
    return dayjs(value).diff(dayjs(), 'hour');
  }
}
