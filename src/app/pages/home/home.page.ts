import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HomeService } from './home.service';
import { ToastService } from '@core/_service/toast.service';
import { empty, Observable } from 'rxjs';
import { expand, reduce } from 'rxjs/operators';
import { AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';

declare var WeixinJSBridge: any;

@Component({
  templateUrl: './home.page.html',
  styleUrls: [
    './styles/home.page.scss',
  ]
})
export class HomePage implements OnInit {

  validationsForm: FormGroup;
  checkboxAffsForm: FormGroup;
  genders: Array<string>;
  allNos: Array<string>;
  takeWays: Array<string>;
  currentAffids: [];
  alertsDocs;

  affList: [];

  validations = {
    'customer_name': [
      { type: 'required', message: '需输入客户姓名。' },
      { type: 'minlength', message: '客户姓名长度不能少于2位。' },
      { type: 'maxlength', message: '客户姓名长度不能大于10位。' },
    ],
    'all_no': [
      { type: 'required', message: '需选择一项.' }
    ],
    'take_way': [
      { type: 'required', message: '需选择带看方式.' }
    ],
    'phone': [
      { type: 'required', message: '必须输入手机号码！' },
    ],

  }

  currentUser;

  constructor(private homeService: HomeService,
    private toastService: ToastService,
    public alertController: AlertController,
    public router: Router) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // this.platform.keyboardDidShow.subscribe(ev => {
    //   const { keyboardHeight } = ev;

    //   // Do something with the keyboard height such as translating an input above the keyboard.
    //   this.commentInput.nativeElement.style.setProperty(
    //     'transform',
    //     `translate3d(0, ${keyboardHeight}px, 0)`
    //   );

    // });

    // this.platform.keyboardDidHide.subscribe(() => {
    //   // Move input back to original location
    //   this.commentInput.nativeElement.style.removeProperty('transform');
    // });
  }

  ngOnInit() {
    this.genders = [
      '女士',
      '先生',
      '其他'
    ];
    this.allNos = [
      '全号推荐',
      '隐号推荐',
    ];
    this.takeWays = [
      '需带看',
      '自行带看',
      '陪同前往'
    ];

    this.validationsForm = new FormGroup({
      'all_no': new FormControl('', Validators.required),
      'take_way': new FormControl('', Validators.required),
      'customer_name': new FormControl('', Validators.compose([
        Validators.maxLength(10),
        Validators.minLength(2),
        Validators.required
      ])),
      'gender': new FormControl(this.genders[0], Validators.required),
      'phone': new FormControl('', Validators.compose([
        Validators.required,
        // Validators.pattern('^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(17[013678])|(18[0,5-9]))\d{4}$')
      ])),
    });

    this.checkboxAffsForm = new FormGroup({});

    if (this.affList) {
      for (let s = 0; s < this.affList.length; s++) {
        this.checkboxAffsForm.removeControl('aff_' + s);
      }
    }

    this.affList = [];

    this.homeService.getAll().subscribe(res => {
      if (res.ok) {
        this.affList = res.data || [];
        for (let i = 0; i < this.affList.length; i++) {
          this.checkboxAffsForm.addControl('aff_' + i, new FormControl());
        }

      }

    })
  }

  get f() { return this.validationsForm.controls; }

  onSubmit(values) {

    this.currentAffids = [];

    for (let i = 0; i < this.affList.length; i++) {
      const t = 'aff_' + i
      if (this.checkboxAffsForm.controls[t].value) {
        this.currentAffids.push(this.affList[i]['id']);
      }
    }

    // console.log(tmp);
    if (this.currentAffids.length <= 0) {
      this.toastService.presentToast('至少选择一个楼盘！');
      return
    }

    this.recommendRequest().subscribe(
      res => {
        // let aff = [];
        // if (this.currentAffids.length > 0) {
        //   aff = (this.currentAffids.filter((p) => {
        //     return p.id === true;
        //   }));
        // }
        // let feedback = false;
        // let txt = '';
        this.alertsDocs = [];
        for (let i = 0; i < res.length; i++) {
          const tina = this.affList.filter((p) => {
            return p['id'] === this.currentAffids[i];
          });
          const index = this.affList.indexOf(tina[0]);
          if (index > -1) {
            let aff = this.affList[index];
            if (res[i].ended == false && res[i].suspended == false) {
              // feedback = true;
              if (this.currentAffids.length <= 0) {
                // txt = '推荐客户成功' + '\n';
                this.alertsDocs.push({ 'status': 'success', 'txt': '推荐客户成功' });
              } else { 
                // txt = txt + (ml[i].merchant_name ? ml[i].merchant_name : '') + '推荐客户成功' + '\n';
                this.alertsDocs.push({ 'status': 'success', 'txt': '「' + (aff['projectName']?aff['projectName']:'') + '」推荐客户成功'});
              }

            } else {
              // feedback = false;
              if (this.currentAffids.length <= 0) {
                // txt = res[i].errmsg + '\n';
                this.alertsDocs.push({ status: 'warning', txt: res[i].errmsg });
              } else {
                // txt = txt + (ml[i].merchant_name ? ml[i].merchant_name : '') + res[i].errmsg + '\n';
                this.alertsDocs.push({ status: 'warning', txt: '【' + aff['projectName'] ? aff['projectName'] : '' + '】   ' + res[i].errmsg });
              }
            }
          }

        }
        // feedback ? this.toastService.success(txt) : this.toastService.warning(txt);
        // this.feedbackModal.show();
        let str = '';
        this.alertsDocs.forEach(p => {
          let s = (p.status == 'success' ? '<strong>' : '')  + p.txt + (p.status == 'success' ? '<strong>' : '')
          str = str + s;
        });

        this.presentAlertConfirm('推荐反馈', str);
      }
    );


  }

  inputEvent(e) {
    console.log(e.target.value);
    let num = e.target.value;
    if (this.f.all_no.value == '隐号推荐') {
      if (num.length >= 3) {
        let prefix = num.substr(0, 3)
        let suffix = num.substr(7, 11)

        this.f.phone.setValue(prefix + '****' + suffix);
      }
    }
    if (num.length >= 11) {

      this.homeService.verification(num, this.currentUser?.mktUserId).subscribe(
        res => {
          if (res.ok) {

            if (!res.data || res.data.length <= 0) {
              //
              for (var i = 0; i < this.affList.length; ++i) {
                (this.affList[i] as any).delFlag = '0'
              }

            } else {
              const ids = Array<string>();
              Object.assign(ids, res.data);
              const tina = this.affList.filter((p) => {
                // return ids.contains(p['id']);
                return ids.indexOf(p['id']) != -1;
              });
              if (tina.length > 0) {
                for (var i = 0; i < tina.length; ++i) {
                  const index = this.affList.indexOf(tina[i])
                  if (index > -1) {
                    (this.affList[index] as any).delFlag = '1'
                  }

                  console.log(this.affList[index]);
                }

              }

            }

          } else {
            //

          }

        }
      )

    }

  }

  changeEvent(e) {
    console.log(e);
  }

  recommendRequest(): Observable<any> {
    let counter = 0;
    let size = this.currentAffids.length;
    // if (this.aggregation.info.merchant && this.efficacious === 1) {
    //   const merchantList = (this.aggregation.info.merchant.filter((p) => {
    //     return p.checked === true;
    //   }));
    //   size = merchantList.length;
    // }

    // scan and reduce are the same in the principle of merging, the only different time to emit.
    //
    // After each reduction merge, the subscription is not triggered immediately, but the message
    // is sent after the final merge
    //
    // Trigger the subscription immediately after each scan merge
    return this.getPostsChunk(counter++, size).pipe(
      expand(
        () => (counter < size) ? this.getPostsChunk(counter++, size) : empty()
      ),
      reduce((acc, x) => acc.concat(x), [])
    );
  }

  getPostsChunk(counter, size) {
    const tina = this.affList.filter((p) => {
      return p['id'] === this.currentAffids[counter];
    });
    const index = this.affList.indexOf(tina[0]);
    if (index > -1) {
      let aff = this.affList[index];
      var params = {
        'processDefinitionId': aff['marktingDefineId'],
        'businessKey': 'marketing',
        'returnVariables': true,
        'variables': {
          'phone': {
            'value': this.f.phone.value,
            'type': 'String'
          },
          'customerName': {
            'value': this.f.customer_name.value,
            'type': 'String'
          },
          'gender': {
            'value': this.genders.indexOf(this.f.gender.value) || 0,
            'type': 'String'
          },
          'description': {
            'value': '',
            'type': 'String'
          },
          'affiliationId': {
            'value': aff['id'],
            'type': 'String'
          },
          'tenantId': {
            'value': aff['tenantId'],
            'type': 'String'
          },
          'brokerId': {
            'value': this.currentUser.mktUserId,
            'type': 'String'
          },
          'suppression': {
            'value': this.allNos.indexOf(this.f.all_no.value) || 0,
            'type': 'String'
          },
          'helpShow': {
            'value': this.takeWays.indexOf(this.f.take_way.value) || 0,
            'type': 'String'
          }
        }
      }

      return this.homeService.start(params);

    }

    // const validId = (size === 0) ? this.aggregation.info.id : this.currentAffids[counter]['id'];
    // if (!validId) {
    //   return;
    // }
    // return this.portalService.recommendCustom(this.f.customName.value, this.f.customMobile.value,
    //   this.f.customIntent.value, validId, this.efficacious, this.userId);
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
          text: '继续推荐',
          handler: () => {
            // console.log('Confirm Okay');
            // this.router.navigate(['/app/referrals']);
            this.f.all_no.setValue('');
            this.f.take_way.setValue('');
            this.f.customer_name.setValue('');
            this.f.phone.setValue('');

            for (var i = 0; i < this.affList.length; ++i) {
              (this.affList[i] as any).delFlag = '0'
            }
          }
        }
      ]
    });

    await alert.present();
  }


}
