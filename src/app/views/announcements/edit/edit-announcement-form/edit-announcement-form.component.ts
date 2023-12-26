import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AnnouncementService } from '../../../../services/announcement.service';
import { MarkdownPipe } from '../../../../pipes/markdown.pipe';

@Component({
  selector: 'app-edit-announcement-form',
  standalone: true,
  templateUrl: './edit-announcement-form.component.html',
  styleUrl: './edit-announcement-form.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MarkdownPipe],
})
export class EditAnnouncementFormComponent implements OnInit {
  @Input({ required: true }) announcementId = 0;

  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

  preview = signal('');

  constructor(private readonly announcementService: AnnouncementService) {
    this.announcementService.announcement$.subscribe({
      next: (announcement) => {
        this.form.get('title')?.setValue(announcement.title);
        this.form.get('description')?.setValue(announcement.description);
      },
      error: (_error) => {},
    });

    this.form.valueChanges.subscribe((value) => {
      this.preview.set(value.description ?? '');
    });
  }

  updateAnnouncement(): void {
    this.announcementService
      .update({
        title: this.form.get('title')?.value ?? '',
        description: this.form.get('description')?.value ?? '',
      })
      .subscribe({
        next: () => {},
        error: (_error) => {},
      });
  }

  ngOnInit(): void {
    this.announcementService.loadAnnouncement(this.announcementId);
  }
}
