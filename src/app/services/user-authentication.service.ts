import { Injectable } from '@angular/core';
import { Observable, map, of, tap, throwError } from 'rxjs';
import { BrowserStorageService } from './browser-storage.service';

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
  constructor(private browserStorage: BrowserStorageService) {}

  isLoggedIn(): boolean {
    return !!this.browserStorage.get('test_auth_token');
  }

  login(credentials: AuthCredentials): Observable<any> {
    if (credentials) {
      return of(mockAuthResponse).pipe(
        tap((response) => {
          this.browserStorage.set('test_auth_token', response.token_id);
        }),
        map((response) => response.user)
      );
    }

    return throwError(() => new Error('Invalid credentials'));
  }
}
