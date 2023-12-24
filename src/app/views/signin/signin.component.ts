import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SecuredLayoutComponent } from '../../layouts/secured-layout/secured-layout.component';
import { BannerComponent } from '../../components/banner/banner.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SecuredLayoutComponent,
    BannerComponent,
  ],
})
export class SigninComponent {
  signinForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  errorMessage$ = this.auth.errorMessage$;

  constructor(private readonly auth: AuthService) {}

  login(): void {
    this.auth.login({
      email: this.signinForm.get('email')?.value ?? '',
      password: this.signinForm.get('password')?.value ?? '',
    });
  }
}
