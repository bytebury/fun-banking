import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-control-panel-alerts',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './control-panel-alerts.component.html',
  styleUrl: './control-panel-alerts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlPanelAlertsComponent { }
