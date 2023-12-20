import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, first } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

interface UserSignUpRequest {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly currentUser = new BehaviorSubject<User | null>(null);
  private readonly errorMessage = new BehaviorSubject('');

  constructor(private http: HttpClient, private auth: AuthService) {
    if (!this.currentUser.value) {
      this.loadCurrentUser();
    }
  }

  signUp(userInfo: UserSignUpRequest): void {
    this.http
      .post(`${environment.apiUrl}/users`, userInfo)
      .pipe(first())
      .subscribe({
        next: () => {
          this.auth.login(userInfo);
        },
        error: (error) => {
          this.errorMessage.next(error.error.message);
        },
      });
  }

  loadCurrentUser(): void {
    this.http
      .get<User>(`${environment.apiUrl}/users`)
      .pipe(first())
      .subscribe((user) => {
        this.currentUser.next(user);
      });
  }

  getUser$(username: string): Observable<User> {
    return this.http
      .get<User>(`${environment.apiUrl}/users/${username.toLowerCase()}`)
      .pipe(first());
  }

  get currentUser$(): Observable<User> {
    return this.currentUser.asObservable().pipe(filter(Boolean));
  }

  get errorMessage$(): Observable<string> {
    return this.errorMessage.asObservable();
  }
}
