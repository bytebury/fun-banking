import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SecuredLayoutComponent } from '../../layouts/secured-layout/secured-layout.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { BannerComponent } from '../../components/banner/banner.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SecuredLayoutComponent,
    ReactiveFormsModule,
    RouterModule,
    BannerComponent,
  ],
})
export class SignupComponent {
  errorMessage$ = this.user.errorMessage$;

  signupForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.maxLength(12),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.maxLength(15),
    ]),
    username: new FormControl('', [
      Validators.required,
      Validators.maxLength(12),
      Validators.pattern('[a-zA-Z0-9]*'),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    passwordConfirmation: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  constructor(private readonly user: UserService) {}

  signUp(): void {
    this.user.signUp({
      first_name: this.signupForm.get('firstName')?.value ?? '',
      last_name: this.signupForm.get('lastName')?.value ?? '',
      username: this.signupForm.get('username')?.value ?? '',
      email: this.signupForm.get('email')?.value ?? '',
      password: this.signupForm.get('password')?.value ?? '',
      password_confirmation:
        this.signupForm.get('passwordConfirmation')?.value ?? '',
    });
  }
}
