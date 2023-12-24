import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, first } from 'rxjs';
import { environment } from '../../environments/environment';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Transfer } from '../models/transfer.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly notificationsSubject = new BehaviorSubject<Transfer[]>([]);

  constructor(private readonly http: HttpClient) {
    this.http
      .get<Transfer[]>(`${environment.apiUrl}/notifications`)
      .pipe(takeUntilDestroyed())
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
