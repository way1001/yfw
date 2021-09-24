import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AllocationService {

  constructor(
    private http: HttpClient
  ) { }

  getSalesmansList(affid): Observable<any> {
    return this.http.get<any>(`/mkt/api/mp/userinfo/salesmans/${affid}`)
    .pipe();
  }

  addIntention(id, intention): Observable<any> {
    return this.http.put<any>(`/mkt/api/mp/referrals/intention/${id}`, '', {params: {intention}})
    .pipe();
  }

  updateConsultingIntention(id, consultingIntention): Observable<any> {
    return this.http.put<any>(`/mkt/api/mp/referrals/updateintention/${id}`, '', {params: {consultingIntention}})
    .pipe();
  }
  

}
