import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_TOKEN_KEY = 'authToken';
  private authToken = '';
  private errorMessageSubject = new BehaviorSubject('');
  private isLoggedInSubject = new BehaviorSubject(false);

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
    this.authToken = localStorage.getItem(this.AUTH_TOKEN_KEY) ?? '';
    this.updateLoginStatus();
  }

  login({ email, password }: { email: string; password: string }): void {
    this.http
      .post<LoginResponse>(`${environment.apiUrl}/login`, { email, password })
      .pipe(take(1))
      .subscribe({
        next: (response: LoginResponse) => {
          localStorage.setItem(this.AUTH_TOKEN_KEY, response.token);
          this.updateLoginStatus();
          window.location.reload();
        },
        error: (error) => {
          this.errorMessageSubject.next(error.error.message);
        },
      });
  }

  logout(): void {
    this.authToken = '';
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    this.updateLoginStatus();
    this.router.navigate(['/']);
  }

  getAuthToken(): string {
    return this.authToken;
  }

  get errorMessage$(): Observable<string> {
    return this.errorMessageSubject.asObservable();
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  private updateLoginStatus(): void {
    this.isLoggedInSubject.next(!!this.authToken);
  }
}
