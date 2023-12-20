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

  aboutMe = signal('');

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
}
