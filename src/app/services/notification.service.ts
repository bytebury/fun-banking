import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  filter,
  first,
  interval,
  startWith,
  switchMap,
} from 'rxjs';
import { environment } from '../../environments/environment';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Transfer } from '../models/transfer.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly notificationsSubject = new BehaviorSubject<Transfer[]>([]);

  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService
  ) {
    this.auth.isLoggedIn$
      .pipe(
        filter(Boolean),
        takeUntilDestroyed(),
        switchMap(() => interval(30_000)),
        startWith(0),
        switchMap(() =>
          this.http
            .get<Transfer[]>(`${environment.apiUrl}/notifications`)
            .pipe(first())
        )
      )
      .subscribe((notifications) => {
        this.notificationsSubject.next(notifications);
      });
  }

  reload(): void {
    this.http
      .get<Transfer[]>(`${environment.apiUrl}/notifications`)
      .pipe(first())
      .subscribe((notifications) => {
        this.notificationsSubject.next(notifications);
      });
  }

  get notifications$(): Observable<Transfer[]> {
    return this.notificationsSubject.asObservable();
  }
}
