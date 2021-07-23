import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { CustomersService } from '../customers.service';
import { InstancePage } from '../instance/instance.page';
import { TrackRecordPage } from '../track-record/track-record.page';

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

  constructor(route: ActivatedRoute,
    private customersService: CustomersService,
    private routerOutlet: IonRouterOutlet,
    public modalController: ModalController,) {
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

  }

  async presentModal(ins) {
    const modal = await this.modalController.create({
      component: InstancePage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        'instanceId': ins,
      }
    });
    // return await modal.present();
    await modal.present();
    // const { data } = await modal.onWillDismiss();
    // if (data) {
    //   this.consultingIntention = data?.intention;
    // }
  }

  async presentTrackModal() {
    const modal = await this.modalController.create({
      component: TrackRecordPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        'referralsId': this.referralId,
        'userId': this.currentUser?.mktUserId
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

   
}
