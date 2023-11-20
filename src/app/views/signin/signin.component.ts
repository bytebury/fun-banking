import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SecuredLayoutComponent } from '../../layouts/secured-layout/secured-layout.component';
import { BannerComponent } from '../../components/banner/banner.component';
import { UserAuthenticationService } from '../../services/user-authentication.service';
import { take } from 'rxjs';

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
  loginError: Error | null = null;

  signinForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private auth: UserAuthenticationService) {}

  login(): void {
    this.auth
      .login({
        username: this.signinForm.get('email')?.value ?? '',
        password: this.signinForm.get('password')?.value ?? '',
      })
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          this.loginError = error;
        },
      });
  }
}
