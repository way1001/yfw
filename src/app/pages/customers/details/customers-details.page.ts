import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { CustomersService } from '../customers.service';
import { InstancePage } from '../instance/instance.page';
import { QrcodePage } from '../qrcode/qrcode.page';
import { TrackRecordPage } from '../track-record/track-record.page';
import QRCode from 'qrcode';
import { SingupService } from '@app/pages/signup/singup.service';

@Component({
  selector: 'app-customers-details',
  templateUrl: './customers-details.page.html',
  styleUrls: [
    './styles/customers-details.page.scss',
    './styles/customers-details.shell.scss'
  ]
})
export class CustomersDetailsPage {
  userRole;
  referralId;
  referralsDetails;
  currentUser;
  platformInfo;
  stauts: Array<string>;

  constructor(route: ActivatedRoute,
    private customersService: CustomersService,
    private routerOutlet: IonRouterOutlet,
    public modalController: ModalController,
    public singupService: SingupService) {

    this.stauts = [
      '待审核',
      '待来访',
      '已通过',
      '已来访',
      '已成交',
      '已结佣',
    ];
    this.referralId = route.snapshot.params['referralId'];

    this.userRole = localStorage.getItem('userRole');

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.customersService.getByRelated(this.referralId).subscribe(
      res => {
        //
        if (res.ok) {
          this.referralsDetails = res.data;
        }
      }
    )

    this.singupService.getPlatformInfo().subscribe(
      res => {
        this.platformInfo = res.data;
      }
    )

  }

  async presentModal(ins) {
    const modal = await this.modalController.create({
      component: InstancePage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        'instanceId': ins,
        'userId': this.currentUser?.mktUserId
      }
    });
    // return await modal.present();
    await modal.present();
    // const { data } = await modal.onWillDismiss();
    // if (data) {
    //   this.consultingIntention = data?.intention;
    // }
  }

  async presentTrackModal(referralId, affiliationId) {
    const modal = await this.modalController.create({
      component: TrackRecordPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        'referralsId': referralId,
        'userId': this.currentUser?.mktUserId,
        'affiliationId': affiliationId
      }
    });
    // return await modal.present();
    await modal.present();
    // const { data } = await modal.onWillDismiss();
    // if (data) {
    //   // this.f.location.setValue(`${data.point[0]}, ${data.point[1]}`)
    //   // this.initPoint = [data.point[0], data.point[1]];
    //   this.consultingIntention = data?.intention;
    // }
  }

  qrcode(instanceId) {

    let _this = this;
    // QRCode.toCanvas(document.getElementById('canvas'), 'xxxx', function (error) {
    //   if (error) {
    //     console.error(error);
    //   }
    //   console.log('success!');
    // });
    QRCode.toDataURL(_this.platformInfo.platformUrl + '/visit/' + instanceId)
      .then(url => {
        _this.presentQrcodeModal(url)
      })
      .catch(err => {
        console.error(err)
      })

  }

  async presentQrcodeModal(url) {
    const modal = await this.modalController.create({
      component: QrcodePage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        'qrcode': url
      }
    });
    // return await modal.present();
    await modal.present();
    // const { data } = await modal.onWillDismiss();
    // if (data) {
    //   // this.f.location.setValue(`${data.point[0]}, ${data.point[1]}`)
    //   // this.initPoint = [data.point[0], data.point[1]];
    //   this.consultingIntention = data?.intention;
    // }
  }

  getStatus(active): String {
    if (active && this.stauts.length <= 0) {
      return;
    }

    return this.stauts[active]
  }

}
