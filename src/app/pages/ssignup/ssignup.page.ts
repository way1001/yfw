import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, MenuController, IonRouterOutlet, AlertController } from '@ionic/angular';

import { TermsOfServicePage } from '../terms-of-service/terms-of-service.page';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy.page';
import { ToastService } from '@app/core/_service/toast.service';
import { SingupService } from '../signup/singup.service';
import { SSmsOfServicePage } from '../ssms-of-service/ssms-of-service.page';

declare var WeixinJSBridge: any;

@Component({
  selector: 'app-ssignup',
  templateUrl: './ssignup.page.html',
  styleUrls: [
    './styles/ssignup.page.scss'
  ]
})
export class SSignupPage {
  signupForm: FormGroup;
  // matching_passwords_group: FormGroup;
  platformInfo;

  genders: Array<string>;
  basicInfos: [];

  validation_messages = {
    /* 'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ], */
    'basic_info': [
      { type: 'required', message: '必须选择楼盘.' },
    ],
    'real_name': [
      { type: 'required', message: '名称不能为空.' },
    ],
    'phone': [
      { type: 'required', message: '需输入完整号码.' },
      // { type: 'invalidCountryPhone', message: 'Phone is incorrect for the selected country.' }
    ],
    'gender': [
      { type: 'required', message: '需选择性别.' },
    ],
    // 'password': [
    //   { type: 'required', message: 'Password is required.' },
    //   { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    // ],
    // 'confirm_password': [
    //   { type: 'required', message: 'Confirm password is required' }
    // ],
    // 'matching_passwords': [
    //   { type: 'areNotEqual', message: 'Password mismatch' }
    // ]
  };

  constructor(
    public router: Router,
    public modalController: ModalController,
    public menu: MenuController,
    private routerOutlet: IonRouterOutlet,
    private singupService: SingupService,
    private toastService: ToastService,
    public alertController: AlertController,

  ) {
    /* this.matching_passwords_group = new FormGroup({
      'password': new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      'confirm_password': new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areNotEqual(formGroup);
    }); */
    this.genders = [
      '先生',
      '女士'
    ];

    this.signupForm = new FormGroup({
      /* 'email': new FormControl('test@test.com', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])), */
      'basic_info': new FormControl('', Validators.required),
      'real_name': new FormControl('', Validators.required),
      // 'nick_name': new FormControl(''),
      'gender': new FormControl('', Validators.required),
      'phone': new FormControl('', Validators.compose([
        Validators.required,
        // Validators.pattern('^(13[0-9]|14[5|7|9]|15[0|1|2|3|5|6|7|8|9]|16[6]|17[0|1|2|3|5|6|7|8]|18[0-9]|19[8|9])\d{8}$')
        Validators.pattern("^(13[0-9]|14[5|7|9]|15[012356789]|16[6]|17[03678]|18[0-9]|19[8|9])[0-9]{8}$")
      ])),
      // 'matching_passwords': this.matching_passwords_group
    });

    this.singupService.getBasicinfo().subscribe(
      res => {
        this.basicInfos = res;
      }
    )

    this.singupService.getPlatformInfo().subscribe(
      res => {
        this.platformInfo = res.data;
      }
    )
  }

  get f() { return this.signupForm.controls; }


  // Disable side menu for this page
  ionViewDidEnter(): void {
    this.menu.enable(false);
  }

  // Restore to default when leaving this page
  ionViewDidLeave(): void {
    this.menu.enable(true);
  }

  async showTermsModal() {
    const modal = await this.modalController.create({
      component: TermsOfServicePage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        'registrationProtocol': this.platformInfo?.registrationProtocol,
      }
    });
    return await modal.present();
  }

  async showPrivacyModal() {
    const modal = await this.modalController.create({
      component: PrivacyPolicyPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        'disclaimer': this.platformInfo?.disclaimer,
      }
    });
    return await modal.present();
  }

  async showSmsModal() {

    this.singupService.getCheckAndRegistrationMessage(this.f.phone.value).subscribe(
      async res => {
        if (res.ok) {
          const modal = await this.modalController.create({
            component: SSmsOfServicePage,
            swipeToClose: true,
            presentingElement: this.routerOutlet.nativeEl,
            componentProps: {
              'affId': this.f.basic_info.value,
              'phone': this.f.phone.value,
              'name': this.f.real_name.value,
              'gender': this.f.gender.value === '先生' ? '1' : '2'

            }
          });
          await modal.present();
          const { data } = await modal.onWillDismiss();
          if (data) {
            if (data?.close == 'close') {
              this.presentAlert2Confirm('提交成功', '您当前注册楼盘置业顾问已提交成功，等待楼盘管理员审核。')
            }
          }
        } else {
          if (res.msg == 'registered') {
            this.toastService.presentErrorToast("该号码已注册，请更换号码注册！");
            return
          }
          if (res.msg == 'confirm') {
            this.presentAlertConfirm('温馨提醒', "该号码已注册成经纪人角色，点击确认将变更角色，同时经纪人角色相关操作将无法使用！")
            return
          }
          this.toastService.presentErrorToast(res.msg);
        }
      }
    )
  }

  async presentAlertConfirm(header, message) {
    let _this = this
    const alert = await _this.alertController.create({
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
          text: '确认变更',
          handler: () => {
            _this.singupService.getRegistrationMessage(_this.f.phone.value).subscribe(
              async res => {
                if (res.ok) {
                  const modal = await _this.modalController.create({
                    component: SSmsOfServicePage,
                    swipeToClose: true,
                    presentingElement: _this.routerOutlet.nativeEl,
                    componentProps: {
                      'affId': this.f.basic_info.value,
                      'phone': this.f.phone.value,
                      'name': this.f.real_name.value,
                      'gender': this.f.gender.value === '先生' ? '1' : '2'
                    }
                  });
                  await modal.present();
                  const { data } = await modal.onWillDismiss();
                  if (data) {
                    if (data?.close == 'close') {
                      this.presentAlert2Confirm('提交成功', '您当前注册楼盘置业顾问已提交成功，等待楼盘管理员审核。')
                    }
                  }
                } else {
                  _this.toastService.presentErrorToast(res.msg);
                }
              }
            )
          }
        }
      ]
    });

    await alert.present();
  }


  async presentAlert2Confirm(header, message) {
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

  doSignup(): void {
    console.log('do sign up');
    // this.router.navigate(['/app/home']);
  }

  /* doFacebookSignup(): void {
    console.log('facebook signup');
    this.router.navigate(['app/categories']);
  }

  doGoogleSignup(): void {
    console.log('google signup');
    this.router.navigate(['app/categories']);
  }

  doTwitterSignup(): void {
    console.log('twitter signup');
    this.router.navigate(['app/categories']);
  } */
}
