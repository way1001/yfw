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
        path: 'auth/ssignup',
        loadChildren: () => import('./pages/ssignup/ssignup.module').then(m => m.SSignupPageModule)
      },
      {
        path: 'forms-and-validations',
        loadChildren: () => import('./pages/validations/forms-validations.module').then(m => m.FormsValidationsPageModule)
      },
      {
        path: 'forms-and-validations',
        loadChildren: () => import('./pages/validations/forms-validations.module').then(m => m.FormsValidationsPageModule)
      },
      {
        path: 'chambermaid',
        loadChildren: () => import('./pages/chambermaid/chambermaid.module').then(m => m.ChambermaidPageModule)
      },
      {
        path: 'approval',
        loadChildren: () => import('./pages/approval/approval.module').then(m => m.ApprovalModule)
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
      },
      {
        path: 'docking/:referralId',
        loadChildren: () => import('./pages/docking/docking.module').then(m => m.DockingModule)
      },
      {
        path: 'accompany/:referralId',
        loadChildren: () => import('./pages/accompany/accompany.module').then(m => m.AccompanyModule)
      },
      {
        path: 'visit/:instanceId',
        loadChildren: () => import('./pages/visit-confirm/visit-confirm.module').then(m => m.VisitConfirmModule)
      },
      {
        path: 'visit-audit/:instanceId',
        loadChildren: () => import('./pages/visit-audit/visit-audit.module').then(m => m.VisitAuditModule)
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
