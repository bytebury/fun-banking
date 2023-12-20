import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-control-panel-announcements',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './control-panel-announcements.component.html',
  styleUrl: './control-panel-announcements.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlPanelAnnouncementsComponent { }
