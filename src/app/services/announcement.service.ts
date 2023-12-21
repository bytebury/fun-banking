import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, first, tap } from 'rxjs';
import { Announcement } from '../models/announcement.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  private readonly announcement = new BehaviorSubject<Announcement | null>(
    null
  );

  constructor(private readonly http: HttpClient) {}

  loadAnnouncement(announcementId: number): void {
    this.http
      .get<Announcement>(
        `${environment.apiUrl}/announcements/${announcementId}`
      )
      .pipe(
        first(),
        tap((announcement) => this.announcement.next(announcement))
      )
      .subscribe();
  }

  create(request: { title: string; description: string }): Observable<unknown> {
    return this.http
      .post(`${environment.apiUrl}/announcements`, request)
      .pipe(first());
  }

  get announcements$(): Observable<Announcement[]> {
    return this.http
      .get<Announcement[]>(`${environment.apiUrl}/announcements`)
      .pipe(first());
  }

  get announcement$(): Observable<Announcement> {
    return this.announcement.asObservable().pipe(filter(Boolean));
  }
}
