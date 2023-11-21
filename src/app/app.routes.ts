import { Routes } from '@angular/router';
import { HomepageComponent } from './views/homepage/homepage.component';
import { SignupComponent } from './views/signup/signup.component';
import { SigninComponent } from './views/signin/signin.component';
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
    component: SignupComponent,
    canActivate: [notSignedInGuard],
  },
  {
    path: 'signin',
    component: SigninComponent,
    canActivate: [notSignedInGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [signedInGuard],
  },
];
