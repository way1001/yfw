import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(
    private http: HttpClient
  ) { }

  getPageByOwn(data): Observable<any> {
    return this.http.request<any>('get', `/mkt/api/mp/referrals/page`, {params: data})
    .pipe();
  }

  getByRelated(id): Observable<any> {
    return this.http.get<any>(`/mkt/api/mp/referrals/related/${id}`)
    .pipe();
  }

  getHistoryTaskByInstanceId(processInstanceId, sortBy, sortOrder): Observable<any> {
    return this.http.get<any>(`/mkt/engine-rest/history/task`, {params: {processInstanceId, sortBy, sortOrder}})
    .pipe();
  }

  getListRef(id): Observable<any> {
    return this.http.get<any>(`/mkt/api/mp/trackrecord/${id}`)
    .pipe();
  }

  addTrackRecord(userId, referralsId, url , content): Observable<any> {
    return this.http.post<any>(`/mkt/api/mp/trackrecord`, {createId: userId, referralsId: referralsId , url , content})
    .pipe();
  }
  

}
