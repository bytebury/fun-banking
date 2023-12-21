import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { AnnouncementService } from '../../../services/announcement.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnouncementComponent {
  announcement$ = this.announcementService.announcement$;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly announcementService: AnnouncementService
  ) {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const announcementId = params.get('id');
        this.announcementService.loadAnnouncement(Number(announcementId));
      });
  }
}
