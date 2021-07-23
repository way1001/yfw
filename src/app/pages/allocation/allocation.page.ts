import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '@app/core/_service/toast.service';
import { AlertController, IonRouterOutlet, ModalController } from '@ionic/angular';
import { IntentionPage } from '../intention/intention.page';
import { ListingPage } from '../transact/listing/listing.page';
import { TransactService } from '../transact/transact.service';
import { AllocationService } from './allocation.service';

declare var WeixinJSBridge: any;

@Component({
  selector: 'app-contact-card',
  templateUrl: './allocation.page.html',
  styleUrls: [
    './styles/allocation.page.scss',
    './styles/allocation.shell.scss'
  ]
})
export class AllocationPage implements OnInit {
  salesmanForm: FormGroup;
  salesmans: [];
  instanceId;
  currentUser;
  currentTaskId;
  currentReferral;
  consultingIntention;

  onHold: 0;
  
  constructor(route: ActivatedRoute,
    public router: Router, 
    private transactService: TransactService,
    private allocationService: AllocationService,
    public alertController: AlertController,
    private routerOutlet: IonRouterOutlet,
    public modalController: ModalController,
    private toastService: ToastService) { 

    this.instanceId = route.snapshot.params['instanceId'];

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.salesmanForm = new FormGroup({
      salesman: new FormControl(null, Validators.required)
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
                const phone = data.data?.phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");
                this.currentReferral = data.data;
                this.currentReferral.phone = phone;
                this.consultingIntention = this.currentReferral?.consultingIntention;
              }
            }
          )
          this.allocationService.getSalesmansList().subscribe(
            resp => {
              if (resp.ok) {
                this.salesmans = resp.data;
                
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

  async presentModal() {
    const modal = await this.modalController.create({
      component: IntentionPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        'referralsId': this.currentReferral?.id,
      }
    });
    // return await modal.present();
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      // this.f.location.setValue(`${data.point[0]}, ${data.point[1]}`)
      // this.initPoint = [data.point[0], data.point[1]];
      this.consultingIntention = data?.intention;
    }
  }

  ngOnInit(): void {
    
    this.salesmans
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

  del(index) {

    if (index && index > this.consultingIntention?.length) {
      return;
    }

    const tmp = [...this.consultingIntention];
    tmp.splice(index, 1); 

    console.log(tmp);

    if(tmp.length <= 0) {
      this.toastService.presentToast('至少保留一个意向！');
      return
    }


    this.allocationService.updateConsultingIntention(this.currentReferral?.id, tmp).subscribe(
      res => {
        if (res.ok) {
          //
          this.consultingIntention = tmp;

        }
      }
    )



  }

  onSubmit() {
    //
    if (this.currentTaskId == null) return;
    const agentId = this.salesmanForm.controls.salesman.value;
    if (agentId == null || agentId == '') return
    const params = {
      withVariablesInReturn: true,
      variables: {
        agentId: { value: agentId }
      },
    };
    this.transactService.completeTask(this.currentTaskId, params).subscribe(
      res => {
        //
        this.presentAlertConfirm('成功办理', '您当前办理流程已经提交完成！')

      }
    )
  }

  async presentTransactModal(ins) {
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
