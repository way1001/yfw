import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TransactService {

  constructor(
    private http: HttpClient
  ) { }

  // public getDetailsDataSource(slug: string): Observable<any> {
  //   const rawDataSource = this.http.get<any>('./assets/sample-data/food/details.json')
  //   .pipe(
  //     mergeMap(details => details.items.filter(item => item.slug === slug)),
  //     map(
  //       (data: FoodDetailsModel) => {
  //         // Note: HttpClient cannot know how to instantiate a class for the returned data
  //         // We need to properly cast types from json data
  //         const details = new FoodDetailsModel();

  //         // The Object.assign() method copies all enumerable own properties from one or more source objects to a target object.
  //         // Note: If you have non-enummerable properties, you can try a spread operator instead. details = {...data};
  //         // (see: https://scotch.io/bar-talk/copying-objects-in-javascript#toc-using-spread-elements-)
  //         Object.assign(details, data);

  //         return details;
  //       }
  //     )
  //   );

  //   // This method tapps into the raw data source and stores the resolved data in the TransferState, then when
  //   // transitioning from the server rendered view to the browser, checks if we already loaded the data in the server to prevent
  //   // duplicate http requests.
  //   const cachedDataSource = this.transferStateHelper.checkDataSourceState('food-details-state', rawDataSource);

  //   return cachedDataSource;
  // }

  // public getDetailsStore(dataSource: Observable<FoodDetailsModel>): DataStore<FoodDetailsModel> {
  //   // Initialize the model specifying that it is a shell model
  //   const shellModel: FoodDetailsModel = new FoodDetailsModel();
  //   this.detailsDataStore = new DataStore(shellModel);

  //   // If running in the server, then don't add shell to the Data Store
  //   // If we already loaded the Data Source in the server, then don't show a shell when transitioning back to the broswer from the server
  //   if (isPlatformServer(this.platformId) || dataSource['ssr_state']) {
  //     // Trigger loading mechanism with 0 delay (this will prevent the shell to be shown)
  //     this.detailsDataStore.load(dataSource, 0);
  //   } else { // On browser transitions
  //     // Trigger the loading mechanism (with shell)
  //     this.detailsDataStore.load(dataSource);
  //   }

  //   return this.detailsDataStore;
  // }

  getCurrentTransact(slug, userId): Observable<any> {
    return this.http.post<any>('/mkt/engine-rest/task', {processInstanceId: slug, assignee: userId})
    .pipe();
  }

  getTransactList(userId): Observable<any> {
    return this.http.post<any>('/mkt/engine-rest/task', {"assignee": userId, "sorting":
    [{"sortBy": "dueDate",
    "sortOrder": "asc"
    }]})
    .pipe();
  }

  getCurrentReferrals(slug): Observable<any> {
    return this.http.get<any>(`/mkt/api/mp/referrals/instance/${slug}`)
    .pipe();
  }

  getTaskCount(userId): Observable<any> {
    return this.http.get<any>('/mkt/engine-rest/task/count', {params: {assignee: userId}})
    .pipe();
  }

  completeTask(taskId, params): Observable<any> {
    return this.http.post<any>(`/mkt/engine-rest/task/${taskId}/complete`, params)
    .pipe();
  }

}
