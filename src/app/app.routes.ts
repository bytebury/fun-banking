import { Routes } from '@angular/router';
import { HomepageComponent } from './views/homepage/homepage.component';
import { signedInGuard } from './guards/signed-in.guard';
import { notSignedInGuard } from './guards/not-signed-in.guard';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ProfileSettingsComponent } from './views/settings/profile-settings/profile-settings.component';
import { SettingsComponent } from './views/settings/settings.component';
import { ControlPanelComponent } from './views/control-panel/control-panel.component';
import { adminGuard } from './guards/admin.guard';
import { ControlPanelOverviewComponent } from './views/control-panel/control-panel-overview/control-panel-overview.component';
import { ControlPanelAnnouncementsComponent } from './views/control-panel/control-panel-announcements/control-panel-announcements.component';
import { ControlPanelAlertsComponent } from './views/control-panel/control-panel-alerts/control-panel-alerts.component';
import { AnnouncementsComponent } from './views/announcements/index/announcements.component';
import { AnnouncementComponent } from './views/announcements/show/announcement.component';
import { AnnouncementLayoutComponent } from './views/announcements/layout/layout.component';

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
  {
    path: 'customers',
    children: [
      {
        path: ':id/transfer',
        loadComponent: () =>
          import(
            './views/customers/money-transfer/money-transfer.component'
          ).then((m) => m.MoneyTransferComponent),
      },
    ],
    canActivateChild: [signedInGuard],
  },
  {
    path: 'profile',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./views/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
        canActivate: [signedInGuard],
      },
      {
        path: ':username',
        loadComponent: () =>
          import('./views/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
    ],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        component: ProfileSettingsComponent,
      },
    ],
    canActivateChild: [signedInGuard],
  },
  {
    path: 'control-panel',
    component: ControlPanelComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        component: ControlPanelOverviewComponent,
      },
      {
        path: 'alerts',
        component: ControlPanelAlertsComponent,
      },
      {
        path: 'announcements',
        component: ControlPanelAnnouncementsComponent,
      },
    ],
    canActivate: [signedInGuard, adminGuard],
    canActivateChild: [signedInGuard, adminGuard],
  },
  {
    path: 'announcements',
    component: AnnouncementLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: AnnouncementsComponent,
      },
      {
        path: ':id',
        component: AnnouncementComponent,
      },
    ],
  },
];
