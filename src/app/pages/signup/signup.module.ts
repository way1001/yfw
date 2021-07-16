import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '@app/components/components.module';

import { SignupPage } from './signup.page';
import { TermsOfServicePage } from '../terms-of-service/terms-of-service.page';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy.page';
import { SmsOfServicePage } from '../sms-of-service/sms-of-service.page';
import { ToastService } from '@app/core/_service/toast.service';

const routes: Routes = [
  {
    path: '',
    component: SignupPage
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
  entryComponents: [TermsOfServicePage, PrivacyPolicyPage, SmsOfServicePage],
  declarations: [SignupPage, TermsOfServicePage, PrivacyPolicyPage, SmsOfServicePage]
})
export class SignupPageModule {}
