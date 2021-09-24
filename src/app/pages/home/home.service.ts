import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(`/mkt/api/mp/basicinfo/all`)
    .pipe();
  }

  multiProcess(): Observable<any> {
    return this.http.get<any>(`/mkt/api/mp/workflow/all`)
    .pipe();
  }

  start(params): Observable<any> {
    return this.http.post<any>('/mkt/engine-rest/process-definition/' + params.processDefinitionId + '/submit-form', params)
  }

  verification(phone, senderId): Observable<any> {
    return this.http.get<any>('/mkt/api/mp/referrals/verification' , {params: {phone, senderId}})
    .pipe();
  }

  salesmanList(id): Observable<any> {
    return this.http.get<any>(`/mkt/api/mp/salesman/list/${id}`)
    .pipe();
  }


}
