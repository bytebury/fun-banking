import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly banks = new BehaviorSubject<any | null>(null);

  constructor(
    private readonly http: HttpClient,
    private readonly userService: UserService,
    private readonly auth: AuthService
  ) {
    this.auth.isLoggedIn$
      .pipe(takeUntilDestroyed(), filter(Boolean))
      .subscribe({
        next: () => {
          this.loadBanks();
        },
      });
  }

  loadBanks(): void {
    this.userService.currentUser$
      .pipe(
        filter(Boolean),
        switchMap((user) => {
          return this.http.get(
            `${environment.apiUrl}/employees/user/${user.id}`
          );
        })
      )
      .subscribe((response) => {
        this.banks.next(response);
      });
  }

  get banks$(): Observable<any | null> {
    return this.banks.asObservable();
  }
}
