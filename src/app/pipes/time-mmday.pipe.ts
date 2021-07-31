import { Pipe, PipeTransform } from '@angular/core';

import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat'

@Pipe({ name: 'appTimeMMDay' })
export class TimeMMDayPipe implements PipeTransform {
  transform(value: any): string {
    // var startTime = "2018-05-18T16:00:00.000+0000";
    // let v = value.replace(/(+\d{2})(\d{2})$/, "$1:$2");

    // https://github.com/iamkun/dayjs/issues/73 ??????????????
    dayjs.extend(customParseFormat);
    return dayjs(value, 'YYYY-MM-DDTHH:mm:ss.000ZZ').locale('zh-cn').format('MM-DD hh:mm');

  }
}
