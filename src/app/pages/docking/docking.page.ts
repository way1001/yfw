import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ClipboardService } from 'ngx-clipboard';
import { DealService } from '../deal/deal.service';

declare var WeixinJSBridge: any;

@Component({
  selector: 'app-docking',
  templateUrl: './docking.page.html',
  styleUrls: [
    './styles/docking.page.scss',
    './styles/docking.shell.scss'
  ]
})
export class DockingPage implements OnInit {
  referralId;
  userRole;
  currentReferral;
  dockingName;
  dockingPhone;

  constructor(route: ActivatedRoute,
    public router: Router,
    private dealService: DealService,
    public alertController: AlertController,
    private _clipboardService: ClipboardService) {
    this.referralId = route.snapshot.params['referralId'];

    this.userRole = localStorage.getItem('userRole');

    this.dealService.getReferrals(this.referralId).subscribe(
      data => {
        if (data.data != null) {
          this.currentReferral = data.data;
          this.dockingName = this.currentReferral?.dockingName;
          this.dockingPhone = this.currentReferral?.dockingPhone;
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
      message: '您添加跟办信息录入成功！',
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
        }, {
          text: '返回首页',
          handler: () => {
            // console.log('Confirm Okay');
            this.router.navigate(['/app/referrals']);
          }
        }
      ]
    });

    await alert.present();
  }

  onSubmit() {
    //
    if (this.referralId == null) return;
    if (this.userRole !== 'access') return;

    this.dealService.updateReferralsDock(this.referralId,  this.dockingName,
      this.dockingPhone).subscribe(
        res => {
          this.presentAlertConfirm();
        }
      )
    
  }

  nameChange(ev): void {
    this.dockingName = ev.detail.value;
  }

  phoneChange(ev): void {
    this.dockingPhone = ev.detail.value;
  }

//   【项目名称】世纪城
// 【客户】胡女士
// 【电话 】186 xxx9711
// 【报备人】  刘小姐
// 【电话】17707283180
// 【公司】0728房网
// 【客户情况】贷款
// 【报备时间】2021.7.20
// 【到访时间 】 今天
  copy() {
    this._clipboardService.copy(
      "【项目名称】" + this.currentReferral?.basicInfo?.projectName + "\n" +
      "【客户】" + this.currentReferral?.customerName + "\n" +
      "【电话 】" + this.currentReferral?.phone + "\n" +
      "【公司】" + "湖北昭鸿地产" + "\n" +
      "【客户情况】" + this.currentReferral?.description + "\n" +
      "【报备时间】" + this.currentReferral?.createTime
    );
  }

}
