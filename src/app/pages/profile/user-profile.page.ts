import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { IResolvedRouteData, ResolverHelper } from '../../utils/resolver-helper';
import { UserProfileModel } from './user-profile.model';
import { AlertController, IonRouterOutlet, ModalController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';
import { switchMap } from 'rxjs/operators';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy.page';
import { SingupService } from '../signup/singup.service';
import { ListingPage } from '../transact/listing/listing.page';
import { TransactService } from '../transact/transact.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: [
    './styles/user-profile.page.scss',
    './styles/user-profile.shell.scss',
    './styles/user-profile.ios.scss',
    './styles/user-profile.md.scss'
  ],
})
export class UserProfilePage implements OnInit {
  // Gather all component subscription in one place. Can be one Subscription or multiple (chained using the Subscription.add() method)
  subscriptions: Subscription;

  profile: UserProfileModel;
  available_languages = [];
  translations;
  userRole;
  platformInfo;
  auditInfo;
  currentUser;
  
  onHold: 0;

  @HostBinding('class.is-shell') get isShell() {
    return (this.profile && this.profile.isShell) ? true : false;
  }

  constructor(
    private route: ActivatedRoute,
    public router: Router,  
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    public alertController: AlertController,
    public singupService: SingupService,
    public transactService: TransactService
  ) { 
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.singupService.getPlatformInfo().subscribe(
      res => {
        this.platformInfo = res.data;
      }
    )
    this.singupService.associatedAuditInfo().subscribe(
      resp => {
        this.auditInfo = resp.data;
      }
    )
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


  ngOnInit(): void {
    this.subscriptions = this.route.data
    .pipe(
      // Extract data for this page
      switchMap((resolvedRouteData: IResolvedRouteData<UserProfileModel>) => {
        return ResolverHelper.extractData<UserProfileModel>(resolvedRouteData.data, UserProfileModel);
      })
    )
    .subscribe((state) => {
      this.profile = state;
   
      if (!this.profile?.userRole || this.profile?.userRole === '') {
        this.userRole = '经纪人';
      } else if (this.profile?.userRole === 'access') {
        this.userRole = '楼盘对接';
      } else if (this.profile?.userRole === 'secretary') {
        this.userRole = '客服';
      }else if (this.profile?.userRole === 'salesman') {
        this.userRole = '置业顾问';
      }else if (this.profile?.userRole === 'manager') {
        this.userRole = '经理';
      }

      // get translations for this page to use in the Language Chooser Alert
      this.getTranslations();
    }, (error) => console.log(error));

    // this.translate.onLangChange.subscribe(() => this.getTranslations());
  }


  // NOTE: Ionic only calls ngOnDestroy if the page was popped (ex: when navigating back)
  // Since ngOnDestroy might not fire when you navigate from the current page, use ionViewWillLeave to cleanup Subscriptions
  ionViewWillLeave(): void {
    this.subscriptions.unsubscribe();
  }

  getTranslations() {
  //   // get translations for this page to use in the Language Chooser Alert
  //   this.translate.getTranslation(this.translate.currentLang)
  //   .subscribe((translations) => this.translations = translations);
  }

  openModifyUserProfile() {
    this.router.navigate(['/forms-and-validations']);
  }

  // async openLanguageChooser() {
  //   this.available_languages = this.languageService.getLanguages()
  //   .map(item =>
  //     ({
  //       name: item.name,
  //       type: 'radio',
  //       label: item.name,
  //       value: item.code,
  //       checked: item.code === this.translate.currentLang
  //     })
  //   );

  //   const alert = await this.alertController.create({
  //     header: this.translations.SELECT_LANGUAGE,
  //     inputs: this.available_languages,
  //     cssClass: 'language-alert',
  //     buttons: [
  //       {
  //         text: this.translations.CANCEL,
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: () => {}
  //       }, {
  //         text: this.translations.OK,
  //         handler: (data) => {
  //           if (data) {
  //             this.translate.use(data);
  //           }
  //         }
  //       }
  //     ]
  //   });
  //   await alert.present();

  // }

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

  update(id, status) {
    this.singupService.updateTrackRecord(id, status).subscribe(
      res=>{
        this.singupService.associatedAuditInfo().subscribe(
          resp => {
            this.auditInfo = resp.data;
          }
        )
      }
    )
  }

  async presentModal(ins) {
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
