import { Injectable } from '@angular/core';
import {
  HttpClient,
} from "@angular/common/http";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  constructor(private http: HttpClient) { }

  getUserInfo(): Observable<any> {
    return this.http.get<any>(`/mkt/api/mp/userinfo/own`)
    .pipe();
  }

  checkIsReg(): Observable<any> {
    return this.http.get<any>(`/mkt/api/mp/userinfo/isreg`)
    .pipe();
  }
  
}
