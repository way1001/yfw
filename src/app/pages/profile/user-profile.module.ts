import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserService } from './user.service';
import { UserProfilePage } from './user-profile.page';
import { UserProfileResolver } from './user-profile.resolver';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy.page';


const routes: Routes = [
  {
    path: '',
    component: UserProfilePage,
    resolve: {
      data: UserProfileResolver
    }
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserProfilePage, PrivacyPolicyPage],
  providers: [
    UserProfileResolver,
  ],
  entryComponents: [PrivacyPolicyPage],
})
export class UserProfilePageModule {}
