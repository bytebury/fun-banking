import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AnnouncementService } from '../../services/announcement.service';
import { RouterModule } from '@angular/router';
import { Announcement } from '../../models/announcement.model';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent {
  announcements = signal<Announcement[]>([]);

  constructor(private announcementService: AnnouncementService) {
    this.announcementService.announcements$.subscribe((announcements) => {
      this.announcements.set(announcements?.items ?? []);
    });
  }
}
