import { Component, ViewChild, Renderer2, OnInit, Input } from '@angular/core';
import { ModalController, IonInput } from '@ionic/angular';
import { ToastService } from '@app/core/_service/toast.service';
import { SingupService } from '../signup/singup.service';
import { AuthenticationService } from '@app/core/_service/authentication.service';
import { Router } from '@angular/router';
// import { Keyboard } from 'ionic-native';


@Component({
  selector: 'app-ssms-of-service-page',
  templateUrl: 'ssms-of-service.page.html',
  styleUrls: [
    './styles/ssms-of-service.page.scss'
  ]
})

export class SSmsOfServicePage implements OnInit{

  @Input() affId: string;
  @Input() phone: string;
  @Input() name: string;
  @Input() gender: string; 

  @ViewChild('firstNum') firstInput;
  @ViewChild('secondNum') secondInput;
  @ViewChild('thirdNum') thirdInput;
  @ViewChild('fourthNum') fourthInput;

  verifyFirst = '';
  verifyTwo = '';
  verifyThree = '';
  verifyFour = '';

  captcha = '';

  constructor(private modalController: ModalController,
    private toastService: ToastService,
    private singupService: SingupService,
    private router: Router) { }

  ngOnInit(): void {
    // throw new Error("Method not implemented.");
    this.singupService.getRegCode(this.phone).subscribe(
      res => {
        this.captcha = res.data;
      }
    );
  }

  dismiss(): void {
    this.modalController.dismiss();
  }

  ionViewDidEnter() {
    setTimeout(() => {
       this.firstInput.setFocus();//为输入框设置焦点
       // Keyboard.show()
     },50);
    // const element = this.renderer2.selectRootElement('#firstNum');
    // setTimeout(() => element.focus(), 150);
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
          setTimeout(() => {
            this.thirdInput.setFocus();//为输入框设置焦点
            this.verifyTwo = e.target.value
            // Keyboard.show()
          },20);
        }
        break;
      case 3:
        if (e.target.value === '' && this.verifyThree === '') {
          setTimeout(() => {
            this.secondInput.setFocus();//为输入框设置焦点
            this.verifyTwo = e.target.value
            // Keyboard.show()
          },20);
        } else if (e.target.value !== '') {
          setTimeout(() => {
            this.fourthInput.setFocus();//为输入框设置焦点
            this.verifyThree = e.target.value
            // Keyboard.show()
          },20);
        }
        break;
      case 4:
        if (e.target.value === '' && this.verifyFour === '') {
          setTimeout(() => {
            this.thirdInput.setFocus();//为输入框设置焦点
            this.verifyThree = e.target.value
            // Keyboard.show()
          },20);
        } else if (e.target.value !== '') {
            this.verifyFour = e.target.value;
            const verifyCode = this.verifyFirst + this.verifyTwo + this.verifyThree + this.verifyFour;
            if (verifyCode.length === 4) {
              // const code = JSON.parse(localStorage.getItem('laze'));
              if (verifyCode === this.captcha) {

                this.singupService.initSUserInfo(this.affId, this.phone, this.name, this.gender).subscribe(
                  res => {
                      if (res.ok) {
                        // this.authenticationService.currentUserSubject.next(res.data);
                        // localStorage.setItem('isReg', JSON.stringify({ isReg: true }));
                        localStorage.setItem('isReg', '1');
                      } else {
                        this.toastService.presentErrorToast(res.msg);
                      }
                      this.modalController.dismiss({
                        'close': 'close'
                    });
                  }
                )

              } else {
                // this.toastService.warning('验码错误，请重新输入');
                this.toastService.presentErrorToast('无效验证码!请重新输入');
                this.firstInput.value = '';
                this.secondInput.value = '';
                this.thirdInput.value = '';
                setTimeout(() => {
                  this.firstInput.setFocus();//为输入框设置焦点
                  // Keyboard.show()
                  this.fourthInput.value = '';
                },50);
              }
            }
        }
        break;
      default:
        return null;
    }
  }

  onKeyUpEvent(e, num) {
    // if (e.key === )
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
        case 4:
          setTimeout(() => {
            this.thirdInput.setFocus();//为输入框设置焦点
          },20);
          break;
        case 1:
        default:
          break;
      }
    }
  }

}
