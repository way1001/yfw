import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CustomersService } from '../customers/customers.service';
import { SingupService } from '../signup/singup.service';
import { ApprovalService } from './approval.service';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.page.html',
  styleUrls: [
    './styles/approval.page.scss',
    './styles/approval.shell.scss'
  ]
})
export class ApprovalPage implements OnInit {
  // Gather all component subscription in one place. Can be one Subscription or multiple (chained using the Subscription.add() method)
  // subscriptions: Subscription;

  // @HostBinding('class.is-shell') get isShell() {
  //   return (this.details && this.details.isShell) ? true : false;
  // }
  salesmanList;
  basicInfos = [];

  constructor(private route: ActivatedRoute,
    private approvalService: ApprovalService,
    public alertController: AlertController,
    public singupService: SingupService) { }

  ngOnInit(): void {

    this.get();
    // this.subscriptions = this.route.data
    // .pipe(
    //   // Extract data for this page
    //   switchMap((resolvedRouteData: IResolvedRouteData<FoodDetailsModel>) => {
    //     return ResolverHelper.extractData<FoodDetailsModel>(resolvedRouteData.data, FoodDetailsModel);
    //   })
    // )
    // .subscribe((state) => {
    //   this.details = state;
    // }, (error) => console.log(error));
    this.singupService.getBasicinfo().subscribe(
      res => {
        this.basicInfos = res;
      }
    )

  }

  get() {
    this.approvalService.getListBySalesman().subscribe(
      res =>  {
         if (res.ok) {
          this.salesmanList = res.data
         }
      });
  }

  projectName(id): String {
    if (id && this.basicInfos.length <= 0) {
      return;
    }
    const tina = this.basicInfos.filter((p) => {
      return p['id'] === id;
    });
    const index = this.basicInfos.indexOf(tina[0]);

    return this.basicInfos[index]?.projectName
  }

  // NOTE: Ionic only calls ngOnDestroy if the page was popped (ex: when navigating back)
  // Since ngOnDestroy might not fire when you navigate from the current page, use ionViewWillLeave to cleanup Subscriptions
  ionViewWillLeave(): void {
    // this.subscriptions.unsubscribe();
  }

  async presentAlertConfirm(header, message, id) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      backdropDismiss: false,
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: '确认',
          handler: () => {
            // console.log('Confirm Okay');
            // this.router.navigate(['/app/mine']);
            this.approvalService.delSalesman(id).subscribe(
              res=>{
                this.get();
              }
            )
          }
        }
      ]
    });

    await alert.present();
  }

  del(id) {
    this.presentAlertConfirm('删除操作', '您当前的操作将会删除当前用户置业顾问角色，请确认操作！', id)
  }

  update(id, status) {
    this.approvalService.updateInfo(id, status).subscribe(
      res=>{
        this.get();
      }
    )
  }
}
