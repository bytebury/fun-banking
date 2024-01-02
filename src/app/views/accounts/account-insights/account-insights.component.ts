import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { AccountsService } from '../../../services/accounts.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { ChartConfiguration, ChartType } from 'chart.js';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-account-insights',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './account-insights.component.html',
  styleUrl: './account-insights.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountInsightsComponent {
  isLoading = signal(true);

  lineChartData!: ChartConfiguration['data'];
  lineChartType: ChartType = 'line';
  lineChartOptions!: ChartConfiguration['options'];

  private readonly DATE_PIPE = new DatePipe('en-US');

  constructor(
    private readonly customerService: CustomerService,
    private readonly accountService: AccountsService
  ) {
    this.customerService.customer$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.isLoading.set(true);
    });
    this.accountService.thirtyDaysRollingTransfers$
      .pipe(
        takeUntilDestroyed(),
        tap(() => this.isLoading.set(true))
      )
      .subscribe({
        next: (summary) => {
          this.lineChartData = {
            datasets: [
              {
                data: summary.map((day) => day.total_balance),
                pointRadius: 7,
                pointHoverRadius: 10,
                label: 'Account Value',
                backgroundColor: '#84d19830',
                borderColor: '#63b87a',
                pointBackgroundColor: '#63b87a',
                fill: true,
              },
            ],
            labels: summary.map(
              (day) => `${this.DATE_PIPE.transform(day.date, 'mediumDate')}`
            ),
          };
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error(error);
          this.isLoading.set(false);
        },
      });
  }
}
