import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../_service/authentication.service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService,
    private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    // let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser && currentUser.sessionKey) {
      request = request.clone({
        setHeaders: {
          // Authorization: `Bearer ${currentUser.token}`,
          'third-session': `${currentUser.sessionKey}` || '',
          //             'Content-Type': 'application/json',
          // 'Access-Control-Allow-Origin': '*'
        }
      });
      if (request.url === '/mkt/api/mp/userinfo/reg') {
        return next.handle(request);
      }
      // if (!JSON.parse(localStorage.getItem('isReg'))) {
      //   this.router.navigate(['auth/signup']);
      // } else {
        const isReg = JSON.parse(localStorage.getItem('isReg'))
        if (isReg === '0') {
          this.router.navigate(['auth/signup']);
        }
      // }
    }

    return next.handle(request);
  }
}
