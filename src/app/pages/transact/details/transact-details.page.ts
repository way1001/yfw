import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AlertController, IonRouterOutlet, ModalController } from '@ionic/angular';
import { ListingPage } from '../listing/listing.page';
import { TransactService } from '../transact.service';

declare var WeixinJSBridge: any;

@Component({
  selector: 'app-contact-card',
  templateUrl: './transact-details.page.html',
  styleUrls: [
    './styles/transact-details.page.scss',
    './styles/transact-details.shell.scss'
  ]
})
export class TransactDetailsPage implements OnInit {
  radioTagsForm: FormGroup;
  checkTagsForm: FormGroup;
  instanceId;
  currentUser;
  currentTaskId;
  currentReferral;
  onHold: 0;
  placeholder: 0;

  constructor(route: ActivatedRoute,
    public router: Router,
    private transactService: TransactService,
    public alertController: AlertController,
    private routerOutlet: IonRouterOutlet,
    private modalController: ModalController) {
    this.instanceId = route.snapshot.params['instanceId'];

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.radioTagsForm = new FormGroup({
      selected_option: new FormControl('', Validators.required),
    });

    this.checkTagsForm = new FormGroup({
      confirm_option: new FormControl('', Validators.required)
    });

    this.transactService.getCurrentTransact(this.instanceId, this.currentUser.mktUserId).subscribe(
      res => {
        if (res.length >= 0 && res[0] != null) {
          this.currentTaskId = res[0].id;
          this.transactService.getCurrentReferrals(this.instanceId).subscribe(
            data => {
              //
              // this.currentReferral = data.data;
              if (data.data != null) {
                const phone = data.data?.placeholder === '1'? data.data?.phone.replace(/(\d{5})(\d{2})(\d{4})/, "$1**$3")
                 : data.data?.phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");
                this.currentReferral = data.data;
                if (this.currentReferral?.placeholder === "1") {
                  this.placeholder = this.currentReferral?.placeholder;
                }
                if (this.currentReferral?.currentHandler === '楼盘判客') {
                  this.currentReferral.phone = phone;
                }
              }
            }
          )

        } else {
          this.presentAlertConfirm('无效办理!', '您当前办理的流程已经办理或已完结!!!')
        }
      }
    );

    this.transactService.getTaskCount(this.currentUser.mktUserId).subscribe(
      resp => {
        //
        if (resp?.count > 0) {
          //
          this.onHold = resp?.count;
        }

      }
    )


  }

  ngOnInit(): void {
    // const instanceId = this.route.paramMap.get('instanceId');


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
            this.router.navigate(['/app/home']);
          }
        }
      ]
    });

    await alert.present();
  }

  onSubmit() {
    //
    if (this.currentTaskId == null) return;
    // switch (this.currentReferral?.currentHandler) {
    //   case "楼盘判客":

    //     break;
    //   case "业务员确认接收":

    //     return event;
    // }

    const isValid = this.radioTagsForm.controls.selected_option.value == '0';
    const doubtfula = this.radioTagsForm.controls.selected_option.value == '2';

    const isReception = this.checkTagsForm.controls.confirm_option.value == '0';
    const params = this.currentReferral?.currentHandler === '楼盘判客' ? {
      withVariablesInReturn: true,
      variables: {
        isValid: { value: isValid },
        doubtfula: { value: doubtfula }
      },
    } : {
      withVariablesInReturn: true,
      variables: {
        isReception: { value: isReception }
      },
    };
    this.transactService.completeTask(this.currentTaskId, params).subscribe(
      res => {
        //
        this.presentAlertConfirm('成功办理', '您当前办理流程已经提交完成！')

      }
    )
  }


  async presentModal(ins) {
    const modal = await this.modalController.create({
      component: ListingPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        'assignee': this.currentUser.mktUserId,
      }
    });
    await modal.present();
  }

}
