import { ThisReceiver } from '@angular/compiler';
import { OnInit, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TransactService } from '../transact/transact.service';

declare var WeixinJSBridge: any;

@Component({
  selector: 'app-contact-card',
  templateUrl: './complemented.page.html',
  styleUrls: [
    './styles/complemented.page.scss',
    './styles/complemented.shell.scss'
  ]
})
export class ComplementedPage implements OnInit {
  @ViewChild('firstNum') firstInput;
  @ViewChild('secondNum') secondInput;

  verifyFirst = '';
  verifyTwo = '';

  instanceId;
  currentUser;
  currentReferral;
  currentTaskId;
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
              if (data.data != null) {
                this.currentReferral = data.data;
              }
            }
          )

        } else {
          this.presentAlertConfirm('无效办理!', '您当前办理的流程已经办理或已完结!!!')
        }
      }
    );
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.firstInput.setFocus();//为输入框设置焦点
      // Keyboard.show()
    },50);
  }

  ionViewDidEnter() {
    setTimeout(() => {
       this.firstInput.setFocus();//为输入框设置焦点
       // Keyboard.show()
     },50);
    // const element = this.renderer2.selectRootElement('#firstNum');
    // setTimeout(() => element.focus(), 150);
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

  onKeyUpEvent(e, num) {
    if (e.key === 'Backspace' && e.keyCode === 8) {
      switch (num) {
        case 2:
            setTimeout(() => {
              this.firstInput.setFocus();//为输入框设置焦点
              // Keyboard.show()
            },20);
          break;
        case 3:
            setTimeout(() => {
              this.secondInput.setFocus();//为输入框设置焦点
            },20);
          break;
        case 1:
        default:
          break;
      }
    }
  }

  inputEvent(e, num) {
    switch (num) {
      case 1:
        this.verifyFirst = e.target.value
        if (e.target.value !== '') {
          setTimeout(() => {
            this.secondInput.setFocus();//为输入框设置焦点
            // Keyboard.show()
          },20);
        }
        break;
      case 2:
        if (e.target.value === '' && this.verifyTwo === '') {
          setTimeout(() => {
            this.firstInput.setFocus();//为输入框设置焦点
            this.verifyFirst = e.target.value
            // Keyboard.show()
          },20);
        } else if (e.target.value !== '') {
          this.verifyTwo = e.target.value;
          const verifyCode = this.verifyFirst + this.verifyTwo
          if (verifyCode.length === 2) {
            this.inputVerify = true;
            this.verifyCode = verifyCode;
          }
        }
        break;
      default:
        return null;
    }
  }

  onSubmit(action) {
    //
    if (this.currentTaskId == null) return;
    const agentId = this.verifyCode;
    if (this.verifyCode.length != 2) return;
    const params = {
      withVariablesInReturn: true,
      variables: {
        isCompletion: { value: action },
        verifyCode: {value: this.verifyCode}
      },
    };
    this.transactService.completeTask(this.currentTaskId, params).subscribe(
      res => {
        //
        this.presentAlertConfirm('成功办理', '您当前办理流程已经提交完成！')

      }
    )
  }
  
 }
