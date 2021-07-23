import { Pipe, PipeTransform } from '@angular/core';

import * as dayjs from 'dayjs';

@Pipe({ name: 'appTimeMMDay' })
export class TimeMMDayPipe implements PipeTransform {
  transform(value: any): string {
    return dayjs(value).locale('zh-cn').format('MM-DD hh:mm');
  }
}
