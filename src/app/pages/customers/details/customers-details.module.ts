import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from '../../../components/components.module';
import { CustomersDetailsPage } from './customers-details.page';
import { InstancePage } from '../instance/instance.page';
import { ImagePickerModule, StepComponent, StepsModule } from 'ng-zorro-antd-mobile';
import { PipesModule } from '@app/pipes/pipes.module';
import { TrackRecordPage } from '../track-record/track-record.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    RouterModule.forChild([{ path: '', component: CustomersDetailsPage }])
  ],
  declarations: [CustomersDetailsPage, InstancePage, TrackRecordPage],
  entryComponents: [InstancePage, TrackRecordPage],
})
export class CustomersDetailsModule {}
