import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, MenuController, IonRouterOutlet } from '@ionic/angular';

import { TermsOfServicePage } from '../terms-of-service/terms-of-service.page';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy.page';
import { SmsOfServicePage } from '../sms-of-service/sms-of-service.page';
import { SingupService } from './singup.service';
import { ToastService } from '@app/core/_service/toast.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: [
    './styles/signup.page.scss'
  ]
})
export class SignupPage {
  signupForm: FormGroup;
  matching_passwords_group: FormGroup;

  validation_messages = {
    /* 'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ], */
    'phone': [
      { type: 'required', message: '需输入完整号码.' },
      // { type: 'invalidCountryPhone', message: 'Phone is incorrect for the selected country.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required' }
    ],
    'matching_passwords': [
      { type: 'areNotEqual', message: 'Password mismatch' }
    ]
  };

  constructor(
    public router: Router,
    public modalController: ModalController,
    public menu: MenuController,
    private routerOutlet: IonRouterOutlet,
    private singupService: SingupService,
    private toastService: ToastService,
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

    this.signupForm = new FormGroup({
      /* 'email': new FormControl('test@test.com', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])), */
      'phone': new FormControl('', Validators.compose([
        Validators.required,
        // Validators.pattern('^(13[0-9]|14[5|7|9]|15[0|1|2|3|5|6|7|8|9]|16[6]|17[0|1|2|3|5|6|7|8]|18[0-9]|19[8|9])\d{8}$')
        Validators.pattern("^(13[0-9]|14[5|7|9]|15[012356789]|16[6]|17[03678]|18[0-9]|19[8|9])[0-9]{8}$")
      ])),
      // 'matching_passwords': this.matching_passwords_group
    });
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
      presentingElement: this.routerOutlet.nativeEl
    });
    return await modal.present();
  }

  async showPrivacyModal() {
    const modal = await this.modalController.create({
      component: PrivacyPolicyPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    return await modal.present();
  }

  async showSmsModal() {
    
    this.singupService.getRegistrationMessage(this.f.phone.value).subscribe(
      async res => {
        if (res.ok) {
          const modal =  await this.modalController.create({
            component: SmsOfServicePage,
            swipeToClose: true,
            presentingElement: this.routerOutlet.nativeEl,
            componentProps: {
              'phone': this.f.phone.value
            }
          });
          return await modal.present(); 
        } else {
          this.toastService.presentErrorToast(res.msg);
        }
      }
    )
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
