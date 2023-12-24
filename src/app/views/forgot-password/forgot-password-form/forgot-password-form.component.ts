import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { first } from 'rxjs';
import { Severity } from '../../../models/severity.enum';
import { BannerComponent } from '../../../components/banner/banner.component';

@Component({
  selector: 'app-forgot-password-form',
  standalone: true,
  templateUrl: './forgot-password-form.component.html',
  styleUrl: './forgot-password-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, BannerComponent],
})
export class ForgotPasswordFormComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
  });

  message = signal({
    exclamation: '❌',
    message: '',
    severity: Severity.Default,
  });

  constructor(private auth: AuthService) {}

  submit(): void {
    this.auth
      .sendForgotPasswordEmail(this.form.get('email')?.value ?? '')
      .pipe(first())
      .subscribe({
        next: () => {
          this.message.set({
            exclamation: '✅',
            severity: Severity.Success,
            message:
              'We sent directions on how to update your password to that e-mail if it exists in our system. If the e-mail does not show up within 5 minutes, check your Junk folder.',
          });
          this.form.reset();
        },
        error: () => {
          this.message.set({
            exclamation: '❌',
            severity: Severity.Default,
            message:
              'There was an error sending your password reset e-mail. Try again later.',
          });
        },
      });
  }
}
