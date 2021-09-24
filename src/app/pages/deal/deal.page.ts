import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInfoService } from '@app/core/_service/userInfo.service';
import { AlertController, IonRouterOutlet, ModalController } from '@ionic/angular';
import { DealService } from './deal.service';

declare var WeixinJSBridge: any;

@Component({
  selector: 'app-deal',
  templateUrl: './deal.page.html',
  styleUrls: [
    './styles/deal.page.scss',
    './styles/deal.shell.scss'
  ]
})
export class DealPage implements OnInit {

  referralId;
  currentUser;
  currentReferral;
  currentDocking;

  constructor(route: ActivatedRoute,
    public router: Router,
    private dealService: DealService,
    public alertController: AlertController,
    public userInfoService: UserInfoService) {

    this.referralId = route.snapshot.params['referralId'];

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.dealService.getReferrals(this.referralId).subscribe(
      data => {
        //
        // this.currentReferral = data.data;
        if (data.data != null) {
          this.currentReferral = data.data;

          if (this.currentReferral?.staffId) {
            this.userInfoService.getUserById(this.currentReferral?.staffId).subscribe(
              resp => {
                if (resp.ok) {
                  this.currentDocking = resp.data;
                }
              }
            )
          }

          this.dealService.updateReferralsReminder(this.currentReferral?.id, this.toMysqlDate(new Date()),
            '1').subscribe(
              res => {
                // this.presentAlertConfirm();
              }
            )

        }
      }
    )

  }


  toMysqlDate(d: Date) {
    let year = d.getFullYear();
    let month = ('0' + (d.getMonth() + 1)).slice(-2);
    let day = ('0' + d.getDate()).slice(-2);
    let hour  = ('0' + d.getHours()).slice(-2);
    let minute = ('0' + d.getMinutes()).slice(-2);
    let seconds = ('0' + d.getSeconds()).slice(-2);
    return [year, month, day].join('-') + ' ' + [hour, minute, seconds].join(':');
  }

  ngOnInit(): void {
    //
  }

  async presentAlertConfirm(header, message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
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
            this.router.navigate(['/app/mine']);
          }
        }
      ]
    });

    await alert.present();
  }

  onSubmit() {
    //
    if (this.referralId == null) return;
    // const agentId = this.salesmanForm.controls.salesman.value;
    // if (agentId == null || agentId == '') return
    // const params = {
    //   withVariablesInReturn: true,
    //   variables: {
    //     agentId: { value: agentId }
    //   },
    // };
    // this.transactService.completeTask(this.currentTaskId, params).subscribe(
    //   res => {
    //     //
    //     this.presentAlertConfirm('成功办理', '您当前办理流程已经提交完成！')

    //   }
    // )
  }

}
