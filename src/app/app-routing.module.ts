import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './containers/default-layout/default-layout.component';
import { AuthGuard } from '@core/_guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'app', pathMatch: 'full' },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'app',
        loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
      },
      {
        path: 'auth/signup',
        loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule)
      },
      {
        path: 'forms-and-validations',
        loadChildren: () => import('./pages/validations/forms-validations.module').then(m => m.FormsValidationsPageModule)
      },
      {
        path: 'forms-and-validations',
        loadChildren: () => import('./pages/validations/forms-validations.module').then(m => m.FormsValidationsPageModule)
      },
      // {
      //   path: 'transact',
      //   loadChildren: () => import('./page/listing/real-estate-listing.module').then(m => m.RealEstateListingPageModule)
      // },
      {
        path: 'transact/:instanceId',
        loadChildren: () => import('./pages/transact/details/transact-details.module').then(m => m.TransactDetailsPageModule)
      },
      {
        path: 'complemented/:instanceId',
        loadChildren: () => import('./pages/complemented/complemented.module').then(m => m.ComplementedModule)
      },
      {
        path: 'allocation/:instanceId',
        loadChildren: () => import('./pages/allocation/allocation.module').then(m => m.AllocationModule)
      },
      {
        path: 'deal/:referralId',
        loadChildren: () => import('./pages/deal/deal.module').then(m => m.DealModule)
      }
    ]
  },
  {
    path: 'page-not-found',
    loadChildren: () => import('./pages/page-not-found/page-not-found.module').then(m => m.PageNotFoundModule)
  },
  { path: '**', redirectTo: 'app' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
