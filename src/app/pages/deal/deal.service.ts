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
  

}
