import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BannerComponent } from '../../../components/banner/banner.component';
import { filter, map } from 'rxjs';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BannerComponent],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSettingsComponent {
  errorMessage$ = this.userService.errorMessage$;

  currentUser = signal<User | null>(null);
  aboutMe = signal('');
  selectedFile = signal<File | null>(null);
  imageUrl = signal<string>('');

  form = new FormGroup({
    first_name: new FormControl('', [
      Validators.required,
      Validators.maxLength(12),
      Validators.pattern('[a-zA-Z]*'),
    ]),
    last_name: new FormControl('', [
      Validators.required,
      Validators.maxLength(15),
      Validators.pattern('[a-zA-Z]*'),
    ]),
    username: new FormControl('', [
      Validators.required,
      Validators.maxLength(12),
      Validators.pattern('[a-zA-Z0-9]*'),
    ]),
    about: new FormControl('', [Validators.maxLength(500)]),
  });

  constructor(private readonly userService: UserService) {
    this.userService.currentUser$
      .pipe(takeUntilDestroyed())
      .subscribe((user) => {
        this.currentUser.set(user);

        this.form.get('first_name')?.setValue(user.first_name);
        this.form.get('last_name')?.setValue(user.last_name);
        this.form.get('username')?.setValue(user.username);
        this.form.get('about')?.setValue(user.about ?? '');

        this.aboutMe.set(user.about ?? '');
      });

    this.form.valueChanges
      .pipe(
        map((value) => value.about),
        filter(Boolean)
      )
      .subscribe((value) => {
        this.aboutMe.set(value);
      });
  }

  onProfileImageSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    const maxSize = 3 * 1024 * 1024; // 3MB

    if (fileList && fileList[0].size > maxSize) {
      alert('File is too large. Maximum size is 3MB.');
      return; // Exit the function if the file is too large
    }

    if (fileList) {
      this.selectedFile.set(fileList[0]);
      this.previewImage();
    }
  }

  previewImage(): void {
    const reader = new FileReader();

    reader.onload = () => {
      this.imageUrl.set(reader.result as string);
    };

    if (this.selectedFile()) {
      reader.readAsDataURL(this.selectedFile()!);
    }
  }

  submit(): void {
    this.userService
      .update(this.currentUser()?.id ?? 0, {
        first_name: this.form.get('first_name')?.value ?? '',
        last_name: this.form.get('last_name')?.value ?? '',
        username: this.form.get('username')?.value ?? '',
        about: this.form.get('about')?.value ?? '',
        avatar: this.imageUrl() ?? '',
      })
      .subscribe();
  }
}
