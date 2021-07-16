import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllocationPage } from './allocation.page';
import { ComponentsModule } from '../../components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IntentionPage } from '../intention/intention.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: AllocationPage }])
  ],
  declarations: [AllocationPage, IntentionPage],
  entryComponents: [IntentionPage],
})
export class AllocationModule {}
