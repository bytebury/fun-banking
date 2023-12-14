import { Routes } from '@angular/router';
import { HomepageComponent } from './views/homepage/homepage.component';
import { signedInGuard } from './guards/signed-in.guard';
import { notSignedInGuard } from './guards/not-signed-in.guard';
import { DashboardComponent } from './views/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
    canActivate: [notSignedInGuard],
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./views/signup/signup.component').then((m) => m.SignupComponent),
    canActivate: [notSignedInGuard],
  },
  {
    path: 'signin',
    loadComponent: () =>
      import('./views/signin/signin.component').then((m) => m.SigninComponent),
    canActivate: [notSignedInGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [signedInGuard],
  },
  {
    path: 'banks',
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./views/banks/new/new-bank.component').then(
            (m) => m.NewBankComponent
          ),
      },
      {
        path: ':id',
        pathMatch: 'full',
        loadComponent: () =>
          import('./views/banks/show/bank.component').then(
            (m) => m.BankComponent
          ),
      },
      {
        path: ':id/customers/new',
        loadComponent: () =>
          import('./views/customers/new/new-customer.component').then(
            (m) => m.NewCustomerComponent
          ),
      },
    ],
    canActivateChild: [signedInGuard],
  },
];
