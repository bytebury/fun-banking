import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HealthService } from '../../../services/health.service';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

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

  public lineChartData!: ChartConfiguration['data'];
  public lineChartType: ChartType = 'line';

  constructor(private readonly healthService: HealthService) {
    this.healthService.users$.subscribe((data) => {
      this.lineChartData = {
        datasets: [
          {
            data: data.map((item: any) => item.count),
            label: 'Customer Count',
          },
        ],
        labels: data.map((item: any) => `Week ${item.week}`),
      };
    });
  }
}
