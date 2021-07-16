import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { DataStore } from '@app/shell/data-store';
import { Observable } from 'rxjs';

import { TransactService } from '../transact.service';

@Injectable()
export class FoodDetailsResolver implements Resolve<DataStore<any>> {

  constructor(private transactService: TransactService) {}

  resolve(route: ActivatedRouteSnapshot): DataStore<any> {
    // const instanceSlug = route.paramMap.get('instanceId');

    // const dataSource: Observable<any> = this.transactService.getDetailsDataSource(instanceSlug);
    // const dataStore: DataStore<any> = this.transactService.getDetailsStore(dataSource);

    // return dataStore;
    return
  }
}
