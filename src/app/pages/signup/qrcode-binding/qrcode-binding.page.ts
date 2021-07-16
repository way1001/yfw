import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SingupService } from '../singup.service';
import { AuthenticationService } from '@app/core/_service/authentication.service';

@Component({
  selector: 'app-qrcode-binding',
  templateUrl: './qrcode-binding.page.html',
  styleUrls: [
    './qrcode-binding.page.scss',
    './qrcode-binding.shell.scss',
    './qrcode-binding.responsive.scss'
  ]
})
export class QrcodeBindingPage implements OnInit {

  dindingState = false;

  state: any;
  inviteMerchant: String;
  invitePhone: String;

  constructor(private activatedRoute: ActivatedRoute,
    private singupService: SingupService,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.state = this.activatedRoute.snapshot.queryParams['state'];

    if (this.state) {
      const arr = this.state.toString().split('|');
      if (arr.length >= 2) {
        this.invitePhone = arr[0];
        this.inviteMerchant = arr[1];
      }
    }

    if (this.inviteMerchant) {
      this.singupService.bindingReg(this.inviteMerchant, this.invitePhone).subscribe(
        res => {
          if (res.ok) {
            this.authenticationService.currentUserSubject.next(res.data);
            localStorage.setItem('currentUser', JSON.stringify(res.data));
            this.dindingState = true;

          } else {
            this.dindingState = false;
          }
          // this.router.navigate(['/app/home']);
          //TODO  not pass merchant id
        }
      );
    }

  }

}
