import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ForgotPasswordFormComponent } from '../../forgot-password/forgot-password-form/forgot-password-form.component';

@Component({
  selector: 'app-account-security',
  standalone: true,
  imports: [CommonModule, ForgotPasswordFormComponent],
  templateUrl: './account-security.component.html',
  styleUrl: './account-security.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSecurityComponent {}
