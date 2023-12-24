import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { BannerComponent } from '../../../components/banner/banner.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Severity } from '../../../models/severity.enum';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { first } from 'rxjs';

@Component({
  selector: 'app-reset-password-form',
  standalone: true,
  imports: [CommonModule, BannerComponent, ReactiveFormsModule],
  templateUrl: './reset-password-form.component.html',
  styleUrl: './reset-password-form.component.scss',
})
export class ResetPasswordFormComponent {
  @Input({ required: true }) token = '';

  form = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    confirmation: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  message = signal({
    message: '',
    severity: Severity.Danger,
    exclamation: '🚀',
  });

  constructor(private readonly http: HttpClient) {}

  submit(): void {
    this.http
      .post(`${environment.apiUrl}/passwords/reset`, {
        confirmation: this.form.get('confirmation')?.value ?? '',
        password: this.form.get('password')?.value ?? '',
        token: this.token,
      })
      .pipe(first())
      .subscribe({
        next: () => {
          this.message.set({
            message: 'Successfully updated your password.',
            exclamation: '✅',
            severity: Severity.Success,
          });
          this.form.reset();
        },
        error: (error) => {
          this.message.set({
            message: error.error.message,
            exclamation: '❌',
            severity: Severity.Default,
          });
          this.form.reset();
        },
      });
  }
}
