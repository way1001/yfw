import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChambermaidModel } from '../chambermaid/chambermaid.model';

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

  addTrackRecord(userId, referralsId, urls , content, handleType): Observable<any> {
    return this.http.post<any>(`/mkt/api/mp/trackrecord`, {createId: userId, referralsId: referralsId , urls , content, handleType})
    .pipe();
  }
  
  delTrackRecord(id): Observable<any> {
    return this.http.delete<any>(`/mkt/api/mp/trackrecord/${id}`)
    .pipe();
  }

  getListByChambermaid(): Observable<any> {
    return this.http.get<any>(`/mkt/api/mp/referrals/list/chambermaid`)
    .pipe(
      map(
        (res: any) => {
          const {data, ...otherData} = res;

          const updatedListingData = data.map((item, index, arr) => {
            // Relative date (better to showcase UI micro-interactions)
            item.phone = item.phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");
            return {...item};
          });

          return updatedListingData;
        }
      )
    );
  }
}
