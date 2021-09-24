import { Component, ViewChild, Renderer2, OnInit, Input } from '@angular/core';
import { ModalController, IonInput } from '@ionic/angular';
import { ToastService } from '@app/core/_service/toast.service';
import { AuthenticationService } from '@app/core/_service/authentication.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SingupService } from '@app/pages/signup/singup.service';
// import { Keyboard } from 'ionic-native';


@Component({
  selector: 'app-binding-page',
  templateUrl: 'binding.page.html',
  styleUrls: [
    './styles/binding.page.scss'
  ]
})

export class BindingPage implements OnInit{

  @Input() phone: string;

  bindingForm: FormGroup;
  captcha;

  validation_messages = {
    'phone': [
      { type: 'required', message: '请输入正确手机号。' },
    ],
    'code': [
      { type: 'required', message: '请输入正确验证码。' },
    ]
  };

  constructor(private modalController: ModalController,
    private singupService: SingupService,
    private toastService: ToastService,
    private router: Router) {
    this.bindingForm = new FormGroup({
      'phone': new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(11),
        Validators.minLength(10),
        // Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'code': new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(4),
        Validators.minLength(3),
      ]))
    });
   }

  ngOnInit(): void {
    // throw new Error("Method not implemented.");
    // this.singupService.getRegCode(this.phone).subscribe(
    //   res => {
    //     this.captcha = res.data;
    //   }
    // );
  }

  dismiss(): void {
    this.modalController.dismiss();
  }

  get f() { return this.bindingForm.controls; }

  getSms() {
    this.singupService.getCheckAndRegistrationMessage(this.f.phone.value).subscribe(
      async res => {
        if (res.ok) {
          this.toastService.presentToast("发送成功");
        } else {
          this.toastService.presentErrorToast(res.msg);
        }
      }
    )
  }

  // ionViewDidEnter() {
  //   setTimeout(() => {
  //      this.firstInput.setFocus();//为输入框设置焦点
  //      // Keyboard.show()
  //    },50);
  //   // const element = this.renderer2.selectRootElement('#firstNum');
  //   // setTimeout(() => element.focus(), 150);
  // }

  // inputEvent(e, num) {
  //   switch (num) {
  //     case 1:
  //       this.verifyFirst = e.target.value
  //       if (e.target.value !== '') {
  //         setTimeout(() => {
  //           this.secondInput.setFocus();//为输入框设置焦点
  //           // Keyboard.show()
  //         },20);
  //       }
  //       break;
  //     case 2:
  //       if (e.target.value === '' && this.verifyTwo === '') {
  //         setTimeout(() => {
  //           this.firstInput.setFocus();//为输入框设置焦点
  //           this.verifyFirst = e.target.value
  //           // Keyboard.show()
  //         },20);
  //       } else if (e.target.value !== '') {
  //         setTimeout(() => {
  //           this.thirdInput.setFocus();//为输入框设置焦点
  //           this.verifyTwo = e.target.value
  //           // Keyboard.show()
  //         },20);
  //       }
  //       break;
  //     case 3:
  //       if (e.target.value === '' && this.verifyThree === '') {
  //         setTimeout(() => {
  //           this.secondInput.setFocus();//为输入框设置焦点
  //           this.verifyTwo = e.target.value
  //           // Keyboard.show()
  //         },20);
  //       } else if (e.target.value !== '') {
  //         setTimeout(() => {
  //           this.fourthInput.setFocus();//为输入框设置焦点
  //           this.verifyThree = e.target.value
  //           // Keyboard.show()
  //         },20);
  //       }
  //       break;
  //     case 4:
  //       if (e.target.value === '' && this.verifyFour === '') {
  //         setTimeout(() => {
  //           this.thirdInput.setFocus();//为输入框设置焦点
  //           this.verifyThree = e.target.value
  //           // Keyboard.show()
  //         },20);
  //       } else if (e.target.value !== '') {
  //           this.verifyFour = e.target.value;
  //           const verifyCode = this.verifyFirst + this.verifyTwo + this.verifyThree + this.verifyFour;
  //           if (verifyCode.length === 4) {
  //             // const code = JSON.parse(localStorage.getItem('laze'));
  //             if (verifyCode === this.captcha) {
  //               /* localStorage.setItem('passed', JSON.stringify(true));
  //               this.router.navigate([this.returnUrl]); */
  //               // this.singupService.initUserInfo(this.phone).subscribe(
  //               //   res => {
  //               //       if (res.ok) {
  //               //         // this.authenticationService.currentUserSubject.next(res.data);
  //               //         // localStorage.setItem('isReg', JSON.stringify({ isReg: true }));
  //               //         localStorage.setItem('isReg', '1');
  //               //       } else {
  //               //         this.toastService.presentErrorToast(res.msg);
  //               //       }
  //               //       this.modalController.dismiss();
  //               //       this.router.navigate(['/forms-and-validations']);
  //               //       //TODO  not pass merchant id
  //               //   }
  //               // )
  //             } else {
  //               // this.toastService.warning('验码错误，请重新输入');
  //               this.toastService.presentErrorToast('无效验证码!请重新输入');
  //               this.firstInput.value = '';
  //               this.secondInput.value = '';
  //               this.thirdInput.value = '';
  //               setTimeout(() => {
  //                 this.firstInput.setFocus();//为输入框设置焦点
  //                 // Keyboard.show()
  //                 this.fourthInput.value = '';
  //               },50);
  //             }
  //           }
  //       }
  //       break;
  //     default:
  //       return null;
  //   }
  // }

  // onKeyUpEvent(e, num) {
  //   // if (e.key === )
  //   if (e.key === 'Backspace' && e.keyCode === 8) {
  //     switch (num) {
  //       case 2:
  //           setTimeout(() => {
  //             this.firstInput.setFocus();//为输入框设置焦点
  //             // Keyboard.show()
  //           },20);
  //         break;
  //       case 3:
  //           setTimeout(() => {
  //             this.secondInput.setFocus();//为输入框设置焦点
  //           },20);
  //         break;
  //       case 4:
  //         setTimeout(() => {
  //           this.thirdInput.setFocus();//为输入框设置焦点
  //         },20);
  //         break;
  //       case 1:
  //       default:
  //         break;
  //     }
  //   }
  // }

  doBinding() {
    this.singupService.getRegCode(this.phone).subscribe(
      res => {
        this.captcha = res.data;
        if (this.captcha !== this.f.code.value){
          this.toastService.presentErrorToast("输入验证码不匹配，请重新输入。");
        } else{
          this.singupService.initUserInfo(this.phone).subscribe(
            res => {
                if (res.ok) {
                  // this.authenticationService.currentUserSubject.next(res.data);
                  // localStorage.setItem('isReg', JSON.stringify({ isReg: true }));
                  // localStorage.setItem('isReg', '1');
                } else {
                  this.toastService.presentErrorToast(res.msg);
                }
                this.modalController.dismiss();
                this.router.navigate(['/app/home']);
            }
          )
        }
      }
    );
  }

}
