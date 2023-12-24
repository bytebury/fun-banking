import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SecuredLayoutComponent } from '../../layouts/secured-layout/secured-layout.component';
import { ForgotPasswordFormComponent } from './forgot-password-form/forgot-password-form.component';

@Component({
  selector: 'app-password-forgot',
  standalone: true,
  imports: [CommonModule, SecuredLayoutComponent, ForgotPasswordFormComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {}
