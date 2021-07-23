import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';
import { CustomersPage } from './customers.page';
import { PipesModule } from '@app/pipes/pipes.module';


const routes: Routes = [
  {
    path: '',
    component: CustomersPage,
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PipesModule,
    TranslateModule,
    PipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CustomersPage],
  providers: [
  ]
})
export class CustomersPageModule {}
