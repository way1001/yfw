import { Pipe, PipeTransform } from '@angular/core';

import * as dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // load on demand
import * as relativeTime from 'dayjs/plugin/relativeTime';

@Pipe({ name: 'appTimeAgo' })
export class TimeAgoPipe implements PipeTransform {
  transform(value: any): string {
    dayjs.extend(relativeTime);
    let timeAgo = '';

    if (value) {
      const withoutSuffix = (dayjs(value).diff(dayjs(), 'day') < 0) ? false : true;
      timeAgo = dayjs().locale('zh-cn').to(dayjs(value).locale('zh-cn').format(), withoutSuffix);
    }

    return timeAgo;
  }
}
