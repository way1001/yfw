import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrcodeBindingPage } from './qrcode-binding.page';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '@app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: QrcodeBindingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [QrcodeBindingPage]
})
export class QrcodeBindingModule { }
