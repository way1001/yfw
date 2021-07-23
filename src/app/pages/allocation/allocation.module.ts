import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule, Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllocationPage } from './allocation.page';
import { ComponentsModule } from '../../components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IntentionPage } from '../intention/intention.page';
import { ListingPage } from '../transact/listing/listing.page';
import { PipesModule } from '@app/pipes/pipes.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ComponentsModule,
    FormsModule,
    PipesModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: AllocationPage }])
  ],
  declarations: [AllocationPage, IntentionPage, ListingPage],
  entryComponents: [IntentionPage, ListingPage],
})
export class AllocationModule {}
