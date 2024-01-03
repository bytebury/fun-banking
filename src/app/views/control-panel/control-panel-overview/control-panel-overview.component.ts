import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';
import { HealthService } from '../../../services/health.service';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-control-panel-overview',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './control-panel-overview.component.html',
  styleUrl: './control-panel-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlPanelOverviewComponent {
  siteStats$ = this.healthService.health$;
  isLoading = signal(true);

  public lineChartData!: ChartConfiguration['data'];
  public lineChartType: ChartType = 'line';

  constructor(private readonly healthService: HealthService) {
    this.healthService.users$.pipe(takeUntilDestroyed()).subscribe((data) => {
      if (data.at(-1).week === 52) {
        const olderIndex = data.findIndex((d: any) => d.week > 40);
        data = data.slice(olderIndex).concat(data.slice(0, olderIndex));
      }

      this.lineChartData = {
        datasets: [
          {
            data: data.map((item: any) => item.count),
            pointRadius: 7,
            pointHoverRadius: 10,
            label: 'Number of Users',
          },
        ],
        labels: data.map((item: any) => `Week ${item.week}`),
      };
      this.isLoading.set(false);
    });
  }
}
