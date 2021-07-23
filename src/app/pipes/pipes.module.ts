import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgFloorPipeModule } from 'angular-pipes';

import { TimeDifferencePipe } from './time-difference.pipe';
import { TimeAgoPipe } from './time-ago.pipe';
import { JweixinHtmlPipe } from './jweixin-html.pipe';
import { TimeHourDifferencePipe } from './time-difference-hour.pipe ';
import { TimeMMDayPipe } from './time-mmday.pipe';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    NgFloorPipeModule
  ],
  declarations: [
    TimeDifferencePipe,
    TimeHourDifferencePipe,
    TimeAgoPipe,
    JweixinHtmlPipe,
    TimeMMDayPipe
  ],
  exports: [
    NgFloorPipeModule,
    TimeDifferencePipe,
    TimeHourDifferencePipe,
    TimeAgoPipe,
    JweixinHtmlPipe,
    TimeMMDayPipe
  ]
})
export class PipesModule {}
