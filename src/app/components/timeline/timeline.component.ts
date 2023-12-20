import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AnnouncementService } from '../../services/announcement.service';
import { defer } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent {
  announcements$ = this.announcementService.announcements$;

  constructor(private announcementService: AnnouncementService) {}
}
