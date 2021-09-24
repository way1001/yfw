import { Component, Input, OnInit } from '@angular/core';
import { SingupService } from '@app/pages/signup/singup.service';
import { ModalController } from '@ionic/angular';
import QRCode from 'qrcode';

@Component({
  selector: 'app-qrcode-page',
  templateUrl: 'qrcode.page.html',
  styleUrls: [
    './styles/qrcode.page.scss'
  ]
})

export class QrcodePage {
  @Input() qrcode;

  constructor(private modalController: ModalController) { 
  }

  dismiss(): void {
    this.modalController.dismiss();
  }
}
