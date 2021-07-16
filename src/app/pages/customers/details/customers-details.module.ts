import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from '../../../components/components.module';
import { CustomersDetailsPage } from './customers-details.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ComponentsModule,
    RouterModule.forChild([{ path: '', component: CustomersDetailsPage }])
  ],
  declarations: [CustomersDetailsPage]
})
export class CustomersDetailsModule {}
