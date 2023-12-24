import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SecuredLayoutComponent } from '../../layouts/secured-layout/secured-layout.component';
import { ResetPasswordFormComponent } from './reset-password-form/reset-password-form.component';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SecuredLayoutComponent, ResetPasswordFormComponent],
})
export class ResetPasswordComponent {
  token = signal('');

  constructor(private readonly activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParamMap
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        this.token.set(params.get('token') ?? '');
      });
  }
}
