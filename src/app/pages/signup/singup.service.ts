import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SingupService {
  constructor(private http: HttpClient) { }

  getRegistrationMessage(phone): Observable<any> {
    return this.http.put<any>(`/mkt/api/mp/yuntongxun/regsms`, '', {params: {phone}})
    .pipe();
  }

  getCheckAndRegistrationMessage(phone): Observable<any> {
    return this.http.put<any>(`/mkt/api/mp/yuntongxun/checkreg`, '', {params: {phone}})
    .pipe();
  }

  getRegCode(phone): Observable<any> {
    return this.http.get<any>(`/mkt/api/mp/userinfo/code/${phone}`)
    .pipe();
  }

  initUserInfo(phone): Observable<any> {
    return this.http.put<any>(`/mkt/api/mp/userinfo/reg`, '', {params: {phone}})
    .pipe();
  }

  initSUserInfo(affId, phone, name, gender): Observable<any> {
    return this.http.put<any>(`/mkt/api/mp/userinfo/regs`, '', {params: {affId, phone, name, gender}})
    .pipe();
  }

  getPlatformInfo(): Observable<any> {
    return this.http.get<any>(`/mkt/api/mp/basicinfo/platform`)
    .pipe();
  }

  getBasicinfo(): Observable<any> {
    return this.http.get<any>(`/mkt/api/mp/basicinfo/list`)
    .pipe();
  }

  associatedAuditInfo(): Observable<any> {
    return this.http.get<any>(`/mkt/api/mp/trackrecord/list`)
    .pipe();
  }


  updateTrackRecord(id, status): Observable<any> {
    return this.http.put<any>(`/mkt/api/mp/trackrecord`, {id, 'auditStatus':status})
    .pipe();
  }

  // getInvtCode(merchantId): Observable<any> {
  //   return this.http.get<any>(`/yp/api/yp/wxuser/invtcode/${merchantId}`)
  //   .pipe();
  // }

  // initMerchant(): Observable<any> {
  //   return this.http.get<any>(`/yp/api/yp/wxuser/initMerchant`)
  //   .pipe();
  // }


  // bindingReg(merchantId, bindphone): Observable<any> {
  //   return this.http.post<any>(`/yp/api/yp/wxuser/bindingReg`, {merchantId, bindphone})
  //   .pipe();
  // }

}
