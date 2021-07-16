import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfoService } from '@app/core/_service/userInfo.service';

declare var wx: any;


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: [
    './styles/tabs.page.scss'
  ]
})
export class TabsPage implements OnInit {

  // isReg = '0';

  constructor(private router: Router,
    private userInfoService: UserInfoService) { }

  ngOnInit(): void {
    // if (!JSON.parse(localStorage.getItem('isReg'))) {
    //   // this.userInfoService.checkIsReg().subscribe(res => {
    //   //   if (res.ok) {
    //   //     this.isReg = res.data;
    //   //     localStorage.setItem('isReg', JSON.stringify({isReg: this.isReg}));

    //   //   }
    //   // });
    //   this.userInfoService.checkIsReg().subscribe(res => {
    //     if (res.ok) {
    //       this.isReg = res.data;
    //       localStorage.setItem('isReg', JSON.stringify({ isReg: this.isReg }));

    //       if (this.isReg != true) {
    //         this.router.navigate(['auth/signup']);
    //       }

    //     }
    //   });

    // } else {
    //   this.isReg = JSON.parse(localStorage.getItem('isReg'))
    //   if (this.isReg != true) {
    //     this.router.navigate(['auth/signup']);
    //   }
    // }

    const isReg = JSON.parse(localStorage.getItem('isReg'))
    if (isReg === '0') {
      this.router.navigate(['auth/signup']);
    }
  }


  ionViewWillEnter() {
    // this.menu.enable(true);
  }
}
