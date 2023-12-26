import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { AnnouncementService } from '../../../services/announcement.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MarkdownPipe } from '../../../pipes/markdown.pipe';
import { UserService } from '../../../services/user.service';
import { UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-announcement',
  standalone: true,
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, MarkdownPipe],
})
export class AnnouncementComponent {
  readonly userRole = UserRole;
  announcement$ = this.announcementService.announcement$;
  currentUser$ = this.userService.currentUser$;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly announcementService: AnnouncementService,
    private readonly userService: UserService
  ) {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const announcementId = params.get('id');
        this.announcementService.loadAnnouncement(Number(announcementId));
      });
  }
}
