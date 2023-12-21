import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AnnouncementService } from '../../../services/announcement.service';

@Component({
  selector: 'app-control-panel-announcements',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './control-panel-announcements.component.html',
  styleUrl: './control-panel-announcements.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlPanelAnnouncementsComponent {
  form = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
  });

  constructor(private readonly announcementService: AnnouncementService) {}

  // TODO(HANDLE THESE)
  createAnnouncement(): void {
    this.announcementService
      .create({
        title: this.form.get('title')?.value ?? '',
        description: this.form.get('description')?.value ?? '',
      })
      .subscribe({
        next: () => {
          this.form.reset();
        },
        error: (_error) => {},
      });
  }
}
