import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(code) {
    //TODO appid will set global on last version
    return this.http.post<any>('weixin/api/mp/wxuser/login', {appId: 'wxba8fbb58ebb3b73c',code})
      .pipe(map((res: any) => {
        // login successful if there's a jwt token in the response
        // use thinkjs promise res data return {msg {data}}
        if (res.data && res.data.sessionKey) {
          // store username and jwt token in local storage to keep user logged in between page refreshes
          // give sockjs a usename
          localStorage.setItem('sessionKey', JSON.stringify({sessionKey: res.data.sessionKey}));
          // localStorage.setItem('currentUser', JSON.stringify(res));
          localStorage.setItem('currentUser', JSON.stringify(res.data));

          localStorage.setItem('isReg', JSON.stringify(res.data.isReg));

          this.currentUserSubject.next(res.data);

          return 'ok';
        } else {
          return res;
        }
      }));
  }

}
