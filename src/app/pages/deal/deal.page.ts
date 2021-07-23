import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(route: ActivatedRoute,
    public router: Router,
    private dealService: DealService,
    public alertController: AlertController) {

    this.referralId = route.snapshot.params['referralId'];

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.dealService.getReferrals(this.referralId).subscribe(
      data => {
        //
        // this.currentReferral = data.data;
        if (data.data != null) {
          this.currentReferral = data.data;
        }
      }
    )

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
