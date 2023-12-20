import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HealthService } from '../../../services/health.service';

@Component({
  selector: 'app-control-panel-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './control-panel-overview.component.html',
  styleUrl: './control-panel-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlPanelOverviewComponent {
  siteStats$ = this.healthService.health$;

  constructor(private readonly healthService: HealthService) {}
}
