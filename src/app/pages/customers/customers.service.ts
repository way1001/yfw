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
  

}
