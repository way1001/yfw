import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DealService {

  constructor(
    private http: HttpClient
  ) { }

  getReferrals(id): Observable<any> {
    return this.http.get<any>(`/mkt/api/mp/referrals/ref/${id}`)
    .pipe();
  }
  
  updateReferralsDock(id, dockingName, dockingPhone): Observable<any> {
    return this.http.put<any>(`/mkt/api/mp/referrals/ref`, {id, dockingName, dockingPhone})
    .pipe();
  }

  updateReferralsDis(id, description, salesmanId): Observable<any> {
    return this.http.put<any>(`/mkt/api/mp/referrals/ref`, {id, description, salesmanId})
    .pipe();
  }

}
