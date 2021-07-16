import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../components/components.module';
import { FormsValidationsPage } from './forms-validations.page';
import { ImagePickerModule } from 'ng-zorro-antd-mobile';

const routes: Routes = [
  {
    path: '',
    component: FormsValidationsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    ImagePickerModule,
  ],
  declarations: [FormsValidationsPage]
})
export class FormsValidationsPageModule {}
