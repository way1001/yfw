import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '@app/components/components.module';

import { SSignupPage } from './ssignup.page';
import { TermsOfServicePage } from '../terms-of-service/terms-of-service.page';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy.page';
import { ToastService } from '@app/core/_service/toast.service';
import { SSmsOfServicePage } from '../ssms-of-service/ssms-of-service.page';

const routes: Routes = [
  {
    path: '',
    component: SSignupPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  providers: [ToastService],
  entryComponents: [TermsOfServicePage, PrivacyPolicyPage, SSmsOfServicePage],
  declarations: [SSignupPage, TermsOfServicePage, PrivacyPolicyPage, SSmsOfServicePage]
})
export class SSignupPageModule {}
