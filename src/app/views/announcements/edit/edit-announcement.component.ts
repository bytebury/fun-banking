import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { EditAnnouncementFormComponent } from './edit-announcement-form/edit-announcement-form.component';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit-announcement',
  standalone: true,
  templateUrl: './edit-announcement.component.html',
  styleUrl: './edit-announcement.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, EditAnnouncementFormComponent, RouterModule],
})
export class EditAnnouncementComponent {
  announcementId = signal(0);

  constructor(private readonly activatedRoute: ActivatedRoute) {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.announcementId.set(Number(params.get('id') ?? 0));
    });
  }
}
