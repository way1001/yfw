import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChambermaidModel } from '../chambermaid/chambermaid.model';

@Injectable({
  providedIn: 'root'
})
export class ApprovalService {

  constructor(
    private http: HttpClient
  ) { }


  getListBySalesman(): Observable<any> {
    return this.http.get<any>(`/mkt/api/mp/salesman/list/salesman`)
    .pipe();
  }

  delSalesman(id): Observable<any> {
    return this.http.delete<any>(`/mkt/api/mp/salesman/${id}`)
    .pipe();
  }

  updateInfo(id, status): Observable<any> {
    return this.http.put<any>(`/mkt/api/mp/userinfo/salesman`, {id, 'auditStatus':status})
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
