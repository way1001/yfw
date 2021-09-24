import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '@app/core/_service/toast.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ClipboardService } from 'ngx-clipboard';
import { DealService } from '../deal/deal.service';
import { TransactService } from '../transact/transact.service';

declare var WeixinJSBridge: any;

@Component({
  selector: 'app-visit-confirm',
  templateUrl: './visit-confirm.page.html',
  styleUrls: ['./styles/visit-confirm.page.scss']
})
export class VisitConfirmComponent implements AfterViewInit {
  @ViewChild('firstNum') firstInput;
  @ViewChild('secondNum') secondInput;
  @ViewChild('thirdNum') thirdInput;
  @ViewChild('fourthNum') fourthInput;

  verifyFirst = '';
  verifyTwo = '';
  verifyThree = '';
  verifyFour = '';

  instanceId;
  currentUser;
  currentTaskId;
  currentReferral;
  onHold: 0;
  placeholder: 0;

  verifyCode;

  inputVerify = false;

  constructor(route: ActivatedRoute,
    public router: Router,
    private transactService: TransactService,
    public alertController: AlertController) {
    this.instanceId = route.snapshot.params['instanceId'];

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.transactService.getCurrentTransact(this.instanceId, this.currentUser.mktUserId).subscribe(
      res => {
        if (res.length >= 0 && res[0] != null) {
          this.currentTaskId = res[0].id;
          this.transactService.getCurrentReferrals(this.instanceId).subscribe(
            data => {
              //
              // this.currentReferral = data.data;
              if (data.data != null) {
                const phone = data.data?.placeholder === '1' ? data.data?.phone.replace(/(\d{5})(\d{2})(\d{4})/, "$1**$3")
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


  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.firstInput.setFocus();//为输入框设置焦点
      // Keyboard.show()
    }, 50);
  }

  // ngOnInit(): void {
  //   // const instanceId = this.route.paramMap.get('instanceId');
  //   setTimeout(() => {
  //     this.firstInput.setFocus();//为输入框设置焦点
  //     // Keyboard.show()
  //   },50);

  // }

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


    const params = {
      withVariablesInReturn: true,
      variables: {
        completion: { value: this.verifyFirst }
      },
    };
    this.transactService.completeTask(this.currentTaskId, params).subscribe(
      res => {
        this.presentAlertConfirm('成功办理', '您当前办理流程已经提交完成！')

      }
    )
  }

  // onKeyUpEvent(e, num) {
  //   if (e.key === 'Backspace' && e.keyCode === 8) {
  //     switch (num) {
  //       case 2:
  //         setTimeout(() => {
  //           this.firstInput.setFocus();//为输入框设置焦点
  //           // Keyboard.show()
  //         }, 20);
  //         break;
  //       case 3:
  //         setTimeout(() => {
  //           this.secondInput.setFocus();//为输入框设置焦点
  //         }, 20);
  //         break;
  //       case 4:
  //         setTimeout(() => {
  //           this.thirdInput.setFocus();//为输入框设置焦点
  //         }, 20);
  //         break;
  //       case 1:
  //       default:
  //         break;
  //     }
  //   }
  // }

  inputEvent(e) {
    if (e.target.value === '' && this.verifyFirst === '') {
      setTimeout(() => {
        this.firstInput.setFocus();//为输入框设置焦点
        this.verifyFirst = e.target.value
        // Keyboard.show()
      }, 20);
    } else if (e.target.value !== '') {
      this.verifyFirst = e.target.value;
      if (this.verifyFirst.length === 4) {
        this.inputVerify = true;
      } else{
        this.inputVerify = false;
      }

    }

  }


}
