import { Injectable } from '@angular/core';
import { Observable, map, of, tap, throwError } from 'rxjs';
import { BrowserStorageService } from './browser-storage.service';
import { Router } from '@angular/router';

export type AuthCredentials = {
  username: string;
  password: string;
};

const mockAuthResponse = {
  token_id: '12345',
  user: {
    first_name: 'Test',
    last_name: 'Account',
    username: 'tester',
    email: 'hey@bytebury.com',
  },
};

@Injectable({
  providedIn: 'root',
})
export class UserAuthenticationService {
  private readonly authTokenKey = 'test_auth_token';

  constructor(
    private browserStorage: BrowserStorageService,
    private router: Router
  ) {}

  isLoggedIn(): boolean {
    return !!this.browserStorage.get(this.authTokenKey);
  }

  login(credentials: AuthCredentials): Observable<any> {
    if (credentials) {
      return of(mockAuthResponse).pipe(
        tap((response) => {
          this.browserStorage.set(this.authTokenKey, response.token_id);
        }),
        map((response) => response.user)
      );
    }

    return throwError(() => new Error('Invalid credentials'));
  }

  logout(): void {
    this.browserStorage.remove(this.authTokenKey);
    this.router.navigate(['/']);
  }
}
