import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AnnouncementService } from '../../../services/announcement.service';
import { RouterModule } from '@angular/router';
import { StripHtmlPipe } from '../../../pipes/strip-html.pipe';

@Component({
  selector: 'app-announcements',
  standalone: true,
  templateUrl: './announcements.component.html',
  styleUrl: './announcements.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, StripHtmlPipe],
})
export class AnnouncementsComponent {
  announcements$ = this.announcementService.announcements$;

  constructor(private readonly announcementService: AnnouncementService) {}
}
