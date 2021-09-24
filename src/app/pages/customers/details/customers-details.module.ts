import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from '../../../components/components.module';
import { CustomersDetailsPage } from './customers-details.page';
import { InstancePage } from '../instance/instance.page';
import { ImagePickerModule, StepsModule } from 'ng-zorro-antd-mobile';
import { PipesModule } from '@app/pipes/pipes.module';
import { TrackRecordPage } from '../track-record/track-record.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { QrcodePage } from '../qrcode/qrcode.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ComponentsModule,
    StepsModule,
    PipesModule,
    ImagePickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIonicImageViewerModule,
    RouterModule.forChild([{ path: '', component: CustomersDetailsPage }])
  ],
  declarations: [CustomersDetailsPage, InstancePage, TrackRecordPage, QrcodePage],
  entryComponents: [InstancePage, TrackRecordPage, QrcodePage],
})
export class CustomersDetailsModule {}
