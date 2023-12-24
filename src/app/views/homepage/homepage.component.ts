import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HomepageLayoutComponent } from '../../layouts/homepage-layout/homepage-layout.component';
import { RouterModule } from '@angular/router';
import { BannerComponent } from '../../components/banner/banner.component';
import { HealthService } from '../../services/health.service';
import { first } from 'rxjs';
import { FormattedNumberPipe } from '../../pipes/formatted-number.pipe';

@Component({
  selector: 'app-homepage',
  standalone: true,
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    HomepageLayoutComponent,
    BannerComponent,
    FormattedNumberPipe,
  ],
})
export class HomepageComponent {
  numberOfBanks = signal(0);
  numberOfUsers = signal(0);
  numberOfTransactions = signal(0);
  numberOfCustomers = signal(0);

  constructor(private readonly health: HealthService) {
    this.health.health$.pipe(first()).subscribe((health) => {
      this.numberOfBanks.set(health.number_of_banks);
      this.numberOfUsers.set(health.number_of_users);
      this.numberOfCustomers.set(health.number_of_customers);
      this.numberOfTransactions.set(health.number_of_transfers);
    });
  }
}
