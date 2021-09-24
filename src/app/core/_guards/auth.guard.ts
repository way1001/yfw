import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_service/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  code;
  state = '';

  constructor(private router: Router,
    private authenticationService: AuthenticationService) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser && Object.keys(currentUser).length != 0) {

      // return true;
      // logged in so return true
      // if (currentUser.creation) {
      let currentTime = new Date().getTime();
      if (currentTime < (parseInt(currentUser.creation) + 600 * 3600 * 1000)) {
        return true;
      }
      // }
    }

    // console.log(state.root.queryParams);

    this.code = state.root.queryParams.code;
    this.state = state.root.queryParams.state;

    if (!this.code) {
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/' + '' +
        'authorize?appid=wx0bc7ddf3bb227acc&redirect_uri=' + encodeURIComponent(window.location.href) + '&response_type=code' +
        '&scope=snsapi_base&state=shared#wechat_redirect';
      return false;
    }

    try {
      const data = await this.authenticationService.login(this.code).toPromise();
      // alert(JSON.stringify(data));
      // if (data.code === 0 &&  data.ok === true) {
      if (data === 'ok') {
        // alert('正常获取');
        return true;
      }
    } catch (e) {
      // alert('异常获取');
      return false;
    }

    // not logged in so redirect to login page with the return url
    //   this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
