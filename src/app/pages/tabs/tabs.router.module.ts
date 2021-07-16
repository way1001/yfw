import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/app/home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
          }
       ]
      },
      {
        path: 'referrals',
        loadChildren: () => import('../customers/customers.module').then(m => m.CustomersPageModule)
      },
      {
        path: 'referrals/:referralId',
        loadChildren: () => import('../customers/details/customers-details.module').then(m => m.CustomersDetailsModule)
      },
      {
        path: 'mine',
        loadChildren: () => import('../profile/user-profile.module').then(m => m.UserProfilePageModule)
      }
    ]
  }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes), HttpClientModule],
  exports: [RouterModule],
  providers: [ ]
})
export class TabsPageRoutingModule {}
