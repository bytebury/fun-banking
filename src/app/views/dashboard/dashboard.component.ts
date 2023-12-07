import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { BankListComponent } from '../../components/bank-list/bank-list.component';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout/dashboard-layout.component';
import { RouterModule } from '@angular/router';
import { BannerComponent } from '../../components/banner/banner.component';
import { AlertService } from '../../services/alert.service';
import { Observable } from 'rxjs';
import { Alert } from '../../models/alert.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    CardComponent,
    RouterModule,
    BankListComponent,
    BannerComponent,
    DashboardLayoutComponent,
  ],
})
export class DashboardComponent {
  alert$: Observable<Alert> = this.alertService.getAlert();

  constructor(private readonly alertService: AlertService) {}
}
