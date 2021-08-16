import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ClipboardService } from 'ngx-clipboard';
import { AllocationService } from '../allocation/allocation.service';
import { DealService } from '../deal/deal.service';

declare var WeixinJSBridge: any;

@Component({
  selector: 'app-accompany',
  templateUrl: './accompany.page.html',
  styleUrls: [
    './styles/accompany.page.scss',
    './styles/accompany.shell.scss'
  ]
})
export class AccompanyPage implements OnInit {
  referralId;
  userRole;
  currentReferral;
  description;
  salesmanId;
  salesmans = [];
  currentUser;

  constructor(route: ActivatedRoute,
    public router: Router,
    private dealService: DealService,
    public alertController: AlertController,
    private allocationService: AllocationService,
    private _clipboardService: ClipboardService) {
    this.referralId = route.snapshot.params['referralId'];

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.userRole = localStorage.getItem('userRole');

    this.dealService.getReferrals(this.referralId).subscribe(
      data => {
        if (data.data != null) {
            const phone = data.data?.phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");
            this.currentReferral = data.data;
            this.currentReferral.phone = phone;
            this.description = this.currentReferral?.description;
            this.salesmanId = this.currentReferral?.salesmanId;
        }
      }
    )

    this.allocationService.getSalesmansList().subscribe(
      resp => {
        if (resp.ok) {
          this.salesmans = resp.data;
          this.salesmans.push({id: this.currentUser?.mktUserId, realName: '我'});
        }
      }
    )
  }

  ngOnInit(): void {

  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '录入成功',
      message: '您添加陪同信息录入成功，请线下确认相关事宜！',
      backdropDismiss: false,
      buttons: [
        {
          text: '关闭页面',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // console.log('Confirm Cancel: blah');
            WeixinJSBridge.call('closeWindow')
          }
        }
        // , {
        //   text: '返回首页',
        //   handler: () => {
        //     // console.log('Confirm Okay');
        //     this.router.navigate(['/app/referrals']);
        //   }
        // }
      ]
    });

    await alert.present();
  }

  onSubmit() {
    //
    if (this.referralId == null) return;
    if (this.userRole !== 'secretary') return;
    if (this.currentReferral?.substitute !== '2') return

    this.dealService.updateReferralsDis(this.referralId,  this.description,
      this.salesmanId).subscribe(
        res => {
          this.presentAlertConfirm();
        }
      )
    
  }

  descriptionChange(ev): void {
    this.description = ev.detail.value;
  }

  salesmanIdChange(ev): void {
    this.salesmanId = ev.detail.value;
  }

}
