import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactDetailsPage } from './transact-details.page';
import { ComponentsModule } from '../../../components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListingPage } from '../listing/listing.page';
import { PipesModule } from '@app/pipes/pipes.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ComponentsModule,
    FormsModule,
    PipesModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: TransactDetailsPage }])
  ],
  declarations: [TransactDetailsPage, ListingPage],
  entryComponents: [ListingPage]
})
export class TransactDetailsPageModule {}
